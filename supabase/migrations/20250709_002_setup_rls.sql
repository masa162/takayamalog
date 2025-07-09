-- Enable Row Level Security on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fanza_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_fanza_works ENABLE ROW LEVEL SECURITY;

-- Articles policies
-- 公開記事は誰でも閲覧可能
CREATE POLICY "Articles are viewable by everyone when published" 
ON articles FOR SELECT 
USING (status = 'published');

-- 認証済みユーザーは管理者として全てのアクセス権限を持つ
CREATE POLICY "Authenticated users can do everything on articles" 
ON articles FOR ALL 
USING (auth.role() = 'authenticated');

-- Categories policies
-- カテゴリは誰でも閲覧可能
CREATE POLICY "Categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

-- 認証済みユーザーは管理者として全てのアクセス権限を持つ
CREATE POLICY "Authenticated users can manage categories" 
ON categories FOR ALL 
USING (auth.role() = 'authenticated');

-- Establishments policies
-- 認証済みユーザーのみ閲覧・管理可能
CREATE POLICY "Authenticated users can view and manage establishments" 
ON establishments FOR ALL 
USING (auth.role() = 'authenticated');

-- FANZA works policies
-- 公開記事に関連するFANZA作品は閲覧可能
CREATE POLICY "FANZA works are viewable when related to published articles" 
ON fanza_works FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM article_fanza_works afw
    JOIN articles a ON afw.article_id = a.id
    WHERE afw.fanza_work_id = fanza_works.id
    AND a.status = 'published'
  )
);

-- 認証済みユーザーは管理者として全てのアクセス権限を持つ
CREATE POLICY "Authenticated users can manage fanza_works" 
ON fanza_works FOR ALL 
USING (auth.role() = 'authenticated');

-- Page views policies
-- 認証済みユーザーのみ閲覧可能
CREATE POLICY "Authenticated users can view page_views" 
ON page_views FOR SELECT 
USING (auth.role() = 'authenticated');

-- 誰でもページビューを記録可能
CREATE POLICY "Anyone can insert page_views" 
ON page_views FOR INSERT 
WITH CHECK (true);

-- Affiliate clicks policies
-- 認証済みユーザーのみ閲覧可能
CREATE POLICY "Authenticated users can view affiliate_clicks" 
ON affiliate_clicks FOR SELECT 
USING (auth.role() = 'authenticated');

-- 誰でもアフィリエイトクリックを記録可能
CREATE POLICY "Anyone can insert affiliate_clicks" 
ON affiliate_clicks FOR INSERT 
WITH CHECK (true);

-- Junction table policies
-- 公開記事に関連するjunctionテーブルは閲覧可能
CREATE POLICY "Article establishments are viewable when article is published" 
ON article_establishments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM articles a
    WHERE a.id = article_establishments.article_id
    AND a.status = 'published'
  )
);

CREATE POLICY "Article fanza works are viewable when article is published" 
ON article_fanza_works FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM articles a
    WHERE a.id = article_fanza_works.article_id
    AND a.status = 'published'
  )
);

-- 認証済みユーザーは管理者として全てのアクセス権限を持つ
CREATE POLICY "Authenticated users can manage article_establishments" 
ON article_establishments FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage article_fanza_works" 
ON article_fanza_works FOR ALL 
USING (auth.role() = 'authenticated');

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() ->> 'email' = 'admin@takayamalog.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create more specific admin policies
CREATE POLICY "Admin can do everything on articles" 
ON articles FOR ALL 
USING (is_admin());

CREATE POLICY "Admin can do everything on categories" 
ON categories FOR ALL 
USING (is_admin());

CREATE POLICY "Admin can do everything on establishments" 
ON establishments FOR ALL 
USING (is_admin());

CREATE POLICY "Admin can do everything on fanza_works" 
ON fanza_works FOR ALL 
USING (is_admin());

CREATE POLICY "Admin can do everything on page_views" 
ON page_views FOR ALL 
USING (is_admin());

CREATE POLICY "Admin can do everything on affiliate_clicks" 
ON affiliate_clicks FOR ALL 
USING (is_admin());

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET view_count = view_count + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get published articles with related data
CREATE OR REPLACE FUNCTION get_published_articles(
  limit_count INTEGER DEFAULT 10,
  offset_count INTEGER DEFAULT 0,
  article_type_filter TEXT DEFAULT NULL,
  category_slug_filter TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  title VARCHAR(255),
  slug VARCHAR(255),
  excerpt VARCHAR(500),
  published_at TIMESTAMP WITH TIME ZONE,
  article_type VARCHAR(20),
  rating DECIMAL(2,1),
  view_count INTEGER,
  category_name VARCHAR(100),
  category_slug VARCHAR(100),
  category_color VARCHAR(7)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.published_at,
    a.article_type,
    a.rating,
    a.view_count,
    c.name as category_name,
    c.slug as category_slug,
    c.color as category_color
  FROM articles a
  LEFT JOIN categories c ON a.category_id = c.id
  WHERE a.status = 'published'
    AND (article_type_filter IS NULL OR a.article_type = article_type_filter)
    AND (category_slug_filter IS NULL OR c.slug = category_slug_filter)
  ORDER BY a.published_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;