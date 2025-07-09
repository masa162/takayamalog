-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    article_type VARCHAR(20) NOT NULL CHECK (article_type IN ('fuzoku', 'fanza', 'research')),
    color VARCHAR(7) DEFAULT '#6B7280',
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create establishments table
CREATE TABLE establishments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('soap', 'health', 'delivery', 'other')),
    area VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    website_url TEXT,
    price_range VARCHAR(100),
    business_hours TEXT,
    services TEXT[],
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    visit_count INTEGER DEFAULT 0,
    last_visit_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fanza_works table
CREATE TABLE fanza_works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fanza_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    actress_name VARCHAR(255),
    director VARCHAR(255),
    genre VARCHAR(100),
    release_date DATE,
    duration INTEGER,
    fanza_url TEXT,
    thumbnail_url TEXT,
    price INTEGER,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    last_checked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- SEO fields
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    og_image_url TEXT,
    
    -- Statistics
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- Article type specific fields
    article_type VARCHAR(20) NOT NULL CHECK (article_type IN ('fuzoku', 'fanza', 'research')),
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    
    -- Research specific fields
    research_method TEXT,
    research_period VARCHAR(50),
    research_budget INTEGER
);

-- Create junction tables
CREATE TABLE article_establishments (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, establishment_id)
);

CREATE TABLE article_fanza_works (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    fanza_work_id UUID REFERENCES fanza_works(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, fanza_work_id)
);

-- Create analytics tables
CREATE TABLE page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id UUID,
    is_unique_view BOOLEAN DEFAULT true
);

CREATE TABLE affiliate_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    affiliate_type VARCHAR(20) NOT NULL CHECK (affiliate_type IN ('fanza', 'establishment', 'other')),
    affiliate_id VARCHAR(100),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    converted BOOLEAN DEFAULT false,
    conversion_value DECIMAL(10,2)
);

-- Create indexes for better performance
CREATE INDEX idx_articles_published ON articles(published_at) WHERE status = 'published';
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_type ON articles(article_type);
CREATE INDEX idx_articles_rating ON articles(rating);
CREATE INDEX idx_articles_slug ON articles(slug);

-- Full text search index
CREATE INDEX idx_articles_search ON articles USING GIN(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || content));

-- Analytics indexes
CREATE INDEX idx_page_views_article ON page_views(article_id);
CREATE INDEX idx_page_views_date ON page_views(viewed_at);
CREATE INDEX idx_affiliate_clicks_article ON affiliate_clicks(article_id);
CREATE INDEX idx_affiliate_clicks_date ON affiliate_clicks(clicked_at);

-- Establishment indexes
CREATE INDEX idx_establishments_type ON establishments(type);
CREATE INDEX idx_establishments_area ON establishments(area);
CREATE INDEX idx_establishments_rating ON establishments(rating);

-- FANZA works indexes
CREATE INDEX idx_fanza_works_fanza_id ON fanza_works(fanza_id);
CREATE INDEX idx_fanza_works_release_date ON fanza_works(release_date);
CREATE INDEX idx_fanza_works_actress ON fanza_works(actress_name);

-- Category indexes
CREATE INDEX idx_categories_type ON categories(article_type);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_establishments_updated_at BEFORE UPDATE ON establishments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fanza_works_updated_at BEFORE UPDATE ON fanza_works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();