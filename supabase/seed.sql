-- Seed data for development
-- This will be run after migrations

-- Insert sample establishments
INSERT INTO establishments (name, type, area, price_range, rating, visit_count, notes) VALUES
('横浜ソープランド「夢」', 'soap', '横浜', '15,000円〜25,000円', 4.2, 3, '清潔感のある店舗。サービス良好。'),
('新宿ヘルス「癒し」', 'health', '新宿', '8,000円〜15,000円', 3.8, 2, '駅近で便利。スタッフの対応が丁寧。'),
('渋谷デリヘル「プレミアム」', 'delivery', '渋谷', '20,000円〜35,000円', 4.5, 5, '高級店。女性の質が高い。'),
('池袋ピンサロ「楽園」', 'other', '池袋', '5,000円〜10,000円', 3.5, 1, '料金は手頃。サービスは普通。')
ON CONFLICT (name) DO NOTHING;

-- Insert sample FANZA works
INSERT INTO fanza_works (fanza_id, title, actress_name, genre, release_date, duration, price, rating, review_count) VALUES
('abc123', '美人秘書の誘惑', '佐藤美香', 'OL・秘書', '2024-01-15', 120, 2980, 4.3, 156),
('def456', '隣の人妻', '田中由美', '人妻・主婦', '2024-02-20', 90, 1980, 3.9, 89),
('ghi789', '制服美少女', '山田花子', '制服・学生', '2024-03-10', 110, 2480, 4.1, 234),
('jkl012', '熟女の魅力', '鈴木恵子', '熟女', '2024-04-05', 95, 2280, 4.0, 78)
ON CONFLICT (fanza_id) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (title, slug, content, excerpt, category_id, article_type, status, published_at, rating, research_method, research_period, research_budget) VALUES
(
  '横浜ソープランド「夢」研究報告書',
  'yokohama-soap-yume-research',
  '# 横浜ソープランド「夢」研究報告書

## 研究概要
横浜エリアで営業するソープランド「夢」について、実際の利用体験を通じて客観的な分析を行いました。

## 研究方法
- 調査方法: 参与観察法
- 調査期間: 2024年1月
- 調査予算: 25,000円

## 研究結果
### 1. 店舗環境
清潔感のある店内で、受付スタッフの対応も丁寧でした。

### 2. サービス内容
基本的なサービスは充実しており、時間配分も適切でした。

### 3. 総合評価
★★★★☆ (4.2/5)

コストパフォーマンスは良好で、リピートを検討したい店舗です。',
  '横浜の人気ソープランド「夢」を実際に利用した詳細レポート。料金、サービス内容、女性の質を研究員が客観的に分析します。',
  (SELECT id FROM categories WHERE slug = 'soap-health' LIMIT 1),
  'fuzoku',
  'published',
  '2024-01-20 10:00:00+09',
  4.2,
  '参与観察法',
  '2024年1月',
  25000
),
(
  'FANZA新作「美人秘書の誘惑」詳細レビュー',
  'fanza-bijin-hisho-review',
  '# FANZA新作「美人秘書の誘惑」詳細レビュー

## 作品概要
- 出演: 佐藤美香
- ジャンル: OL・秘書
- 再生時間: 120分
- 価格: 2,980円

## 評価ポイント
### 1. 演技力
女優の演技は自然で、秘書役がよく似合っています。

### 2. 撮影技術
カメラワークは安定しており、映像品質も高い。

### 3. ストーリー
オフィスでの展開が丁寧に描かれており、没入感があります。

## 総合評価
★★★★☆ (4.3/5)

オフィス系が好きな方には特におすすめの作品です。',
  'FANZA新作「美人秘書の誘惑」の詳細レビュー。演技力、撮影技術、ストーリーを総合的に評価します。',
  (SELECT id FROM categories WHERE slug = 'new-release' LIMIT 1),
  'fanza',
  'published',
  '2024-01-25 14:00:00+09',
  4.3,
  '視聴・分析法',
  '2024年1月',
  2980
),
(
  '2024年風俗業界トレンド分析',
  'fuzoku-trend-analysis-2024',
  '# 2024年風俗業界トレンド分析

## 調査概要
2024年上半期の風俗業界の動向について、複数の情報源から分析を行いました。

## 主要トレンド
### 1. デリヘルの需要増加
店舗型からデリヘルへのシフトが加速しています。

### 2. 料金システムの変化
時間課金制から定額制への移行が見られます。

### 3. 衛生管理の強化
コロナ禍の影響で衛生管理がより重要視されています。

## 今後の予測
2024年後半はさらなる業界再編が予想されます。',
  '2024年風俗業界の最新トレンドを分析。デリヘル需要の増加、料金システムの変化、衛生管理の強化について詳しく解説します。',
  (SELECT id FROM categories WHERE slug = 'trend' LIMIT 1),
  'research',
  'published',
  '2024-02-01 16:00:00+09',
  4.1,
  '市場分析法',
  '2024年1-2月',
  50000
)
ON CONFLICT (slug) DO NOTHING;

-- Link articles to establishments
INSERT INTO article_establishments (article_id, establishment_id)
SELECT 
  a.id,
  e.id
FROM articles a, establishments e
WHERE a.slug = 'yokohama-soap-yume-research' 
  AND e.name = '横浜ソープランド「夢」'
ON CONFLICT DO NOTHING;

-- Link articles to FANZA works
INSERT INTO article_fanza_works (article_id, fanza_work_id)
SELECT 
  a.id,
  f.id
FROM articles a, fanza_works f
WHERE a.slug = 'fanza-bijin-hisho-review' 
  AND f.fanza_id = 'abc123'
ON CONFLICT DO NOTHING;

-- Insert sample page views
INSERT INTO page_views (article_id, ip_address, user_agent, referer, country, city, viewed_at, is_unique_view)
SELECT 
  a.id,
  '192.168.1.1'::inet,
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'https://google.com',
  'JP',
  'Tokyo',
  NOW() - INTERVAL '1 hour' * (random() * 24),
  true
FROM articles a
WHERE a.status = 'published'
ORDER BY random()
LIMIT 50;

-- Update view counts based on page views
UPDATE articles 
SET view_count = (
  SELECT COUNT(*)
  FROM page_views pv
  WHERE pv.article_id = articles.id
)
WHERE status = 'published';

-- Insert sample affiliate clicks
INSERT INTO affiliate_clicks (article_id, affiliate_type, affiliate_id, ip_address, user_agent, converted, conversion_value)
SELECT 
  a.id,
  'fanza',
  'abc123',
  '192.168.1.1'::inet,
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  (random() > 0.7),
  CASE WHEN random() > 0.7 THEN 2980 ELSE NULL END
FROM articles a
WHERE a.article_type = 'fanza' AND a.status = 'published'
ORDER BY random()
LIMIT 20;