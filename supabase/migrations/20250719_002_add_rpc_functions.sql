-- 記事の閲覧数を増加させるRPC関数
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE articles 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 記事の統計情報を取得するRPC関数
CREATE OR REPLACE FUNCTION get_article_statistics()
RETURNS TABLE(
    total_articles BIGINT,
    total_views BIGINT,
    average_rating NUMERIC,
    total_categories BIGINT,
    articles_by_type JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM articles WHERE status = 'published') as total_articles,
        (SELECT COALESCE(SUM(view_count), 0) FROM articles WHERE status = 'published') as total_views,
        (SELECT ROUND(AVG(rating), 1) FROM articles WHERE status = 'published' AND rating IS NOT NULL) as average_rating,
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COALESCE(jsonb_object_agg(article_type, type_count), '{}'::jsonb)
         FROM (
             SELECT article_type, COUNT(*) as type_count 
             FROM articles 
             WHERE status = 'published' 
             GROUP BY article_type
         ) stats) as articles_by_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 人気記事を取得するRPC関数
CREATE OR REPLACE FUNCTION get_popular_articles(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    excerpt VARCHAR(500),
    category_name VARCHAR(100),
    category_slug VARCHAR(100),
    article_type VARCHAR(20),
    view_count INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    og_image_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        c.name as category_name,
        c.slug as category_slug,
        a.article_type,
        a.view_count,
        a.published_at,
        a.og_image_url
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
    ORDER BY a.view_count DESC, a.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 最新記事を取得するRPC関数
CREATE OR REPLACE FUNCTION get_latest_articles(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    excerpt VARCHAR(500),
    category_name VARCHAR(100),
    category_slug VARCHAR(100),
    article_type VARCHAR(20),
    view_count INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    og_image_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        c.name as category_name,
        c.slug as category_slug,
        a.article_type,
        a.view_count,
        a.published_at,
        a.og_image_url
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
    ORDER BY a.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 関連記事を取得するRPC関数
CREATE OR REPLACE FUNCTION get_related_articles(
    current_article_id UUID,
    current_article_type VARCHAR(20),
    limit_count INTEGER DEFAULT 3
)
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    excerpt VARCHAR(500),
    category_name VARCHAR(100),
    category_slug VARCHAR(100),
    article_type VARCHAR(20),
    view_count INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    og_image_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        c.name as category_name,
        c.slug as category_slug,
        a.article_type,
        a.view_count,
        a.published_at,
        a.og_image_url
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
    AND a.id != current_article_id
    AND a.article_type = current_article_type
    ORDER BY a.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;