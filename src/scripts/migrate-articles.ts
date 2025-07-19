#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 環境変数を読み込み
config({ path: '.env.local' })
import type { ArticleInput } from '@/lib/database/articles'

// 環境変数の確認
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('環境変数が設定されていません:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

// Service Role キーでSupabaseクライアントを作成（RLS回避）
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// カテゴリマッピング
const categoryMapping: Record<string, { id: string; article_type: 'fuzoku' | 'fanza' | 'research' }> = {
  '風俗体験談': { id: '', article_type: 'fuzoku' },
  'FANZA動画': { id: '', article_type: 'fanza' },
  '業界研究': { id: '', article_type: 'research' }
}

/**
 * カテゴリを作成・取得
 */
async function ensureCategories(): Promise<void> {
  console.log('📁 カテゴリを確認/作成中...')
  
  for (const [categoryName, categoryInfo] of Object.entries(categoryMapping)) {
    const slug = categoryInfo.article_type
    
    // 既存カテゴリを確認
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (existingCategory) {
      categoryMapping[categoryName].id = existingCategory.id
      console.log(`  ✓ カテゴリ "${categoryName}" 既存: ${existingCategory.id}`)
    } else {
      // カテゴリを作成
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
          name: categoryName,
          slug: slug,
          description: `${categoryName}に関する記事`,
          article_type: categoryInfo.article_type,
          color: getCategoryColor(categoryInfo.article_type),
          sort_order: getTypeOrder(categoryInfo.article_type)
        })
        .select('id')
        .single()
      
      if (error) {
        console.error(`カテゴリ作成エラー (${categoryName}):`, error)
        throw error
      }
      
      categoryMapping[categoryName].id = newCategory.id
      console.log(`  ✅ カテゴリ "${categoryName}" 作成: ${newCategory.id}`)
    }
  }
}

/**
 * カテゴリの色を取得
 */
function getCategoryColor(articleType: string): string {
  switch (articleType) {
    case 'fuzoku': return '#ef4444'
    case 'fanza': return '#8b5cf6'
    case 'research': return '#3b82f6'
    default: return '#6B7280'
  }
}

/**
 * カテゴリの順序を取得
 */
function getTypeOrder(articleType: string): number {
  switch (articleType) {
    case 'fuzoku': return 1
    case 'fanza': return 2
    case 'research': return 3
    default: return 999
  }
}

/**
 * Markdownファイルからメタデータとコンテンツを読み取り
 */
function parseMarkdownFile(filePath: string): {
  frontmatter: Record<string, unknown>
  content: string
  slug: string
} | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data: frontmatter, content } = matter(fileContents)
    
    const fileName = path.basename(filePath, '.md')
    const slug = fileName
    
    return {
      frontmatter,
      content,
      slug
    }
  } catch (error) {
    console.error(`ファイル読み取りエラー (${filePath}):`, error)
    return null
  }
}

/**
 * 記事データをSupabaseフォーマットに変換
 */
function convertToArticleInput(
  frontmatter: Record<string, unknown>,
  content: string,
  slug: string
): ArticleInput {
  // カテゴリIDを取得
  const categoryName = (frontmatter.category as string) || '業界研究'
  const categoryInfo = categoryMapping[categoryName]
  
  if (!categoryInfo) {
    throw new Error(`未知のカテゴリ: ${categoryName}`)
  }
  
  // 公開日の処理
  let publishedAt: string | undefined
  if (frontmatter.publishedAt) {
    publishedAt = new Date(frontmatter.publishedAt as string).toISOString()
  }
  
  return {
    title: (frontmatter.title as string) || `無題記事 (${slug})`,
    slug: slug,
    content: content,
    excerpt: (frontmatter.excerpt as string) || extractExcerpt(content),
    category_id: categoryInfo.id,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags as string[] : [],
    status: 'published',
    published_at: publishedAt,
    meta_title: (frontmatter.metaTitle as string) || (frontmatter.title as string),
    meta_description: (frontmatter.metaDescription as string) || (frontmatter.excerpt as string),
    og_image_url: (frontmatter.thumbnail as string) || (frontmatter.ogImage as string),
    article_type: categoryInfo.article_type,
    rating: frontmatter.rating ? parseFloat(frontmatter.rating as string) : undefined,
    research_method: frontmatter.researchMethod as string,
    research_period: frontmatter.researchPeriod as string,
    research_budget: frontmatter.researchBudget ? parseInt(frontmatter.researchBudget as string) : undefined
  }
}

/**
 * コンテンツから抜粋を生成
 */
function extractExcerpt(content: string): string {
  // Markdownの記号を除去して最初の200文字を抜粋として使用
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // ヘッダー
    .replace(/\*\*(.*?)\*\*/g, '$1') // 太字
    .replace(/\*(.*?)\*/g, '$1') // イタリック
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // リンク
    .replace(/!\[.*?\]\(.*?\)/g, '') // 画像
    .replace(/```[\s\S]*?```/g, '') // コードブロック
    .replace(/`(.*?)`/g, '$1') // インラインコード
    .replace(/\n+/g, ' ') // 改行をスペースに
    .trim()
  
  return plainText.length > 200 ? plainText.slice(0, 200) + '...' : plainText
}

/**
 * 記事をデータベースに挿入
 */
async function insertArticle(articleInput: ArticleInput): Promise<boolean> {
  try {
    // 既存記事の確認
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', articleInput.slug)
      .single()
    
    if (existingArticle) {
      console.log(`  ⚠️  記事 "${articleInput.title}" は既に存在します (slug: ${articleInput.slug})`)
      return false
    }
    
    // 記事を挿入
    const { data, error } = await supabase
      .from('articles')
      .insert(articleInput)
      .select('id, title')
      .single()
    
    if (error) {
      console.error(`記事挿入エラー (${articleInput.slug}):`, error)
      return false
    }
    
    console.log(`  ✅ 記事 "${data.title}" を作成しました (ID: ${data.id})`)
    return true
  } catch (error) {
    console.error(`記事作成エラー (${articleInput.slug}):`, error)
    return false
  }
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
  console.log('🚀 Markdown記事からSupabaseへの移行を開始します...\n')
  
  const articlesDir = path.join(process.cwd(), 'content/articles')
  
  // 記事ディレクトリの存在確認
  if (!fs.existsSync(articlesDir)) {
    console.error(`❌ 記事ディレクトリが見つかりません: ${articlesDir}`)
    process.exit(1)
  }
  
  try {
    // 1. カテゴリの確認/作成
    await ensureCategories()
    console.log('')
    
    // 2. Markdownファイルの取得
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'))
    console.log(`📄 ${files.length}件のMarkdownファイルを発見しました`)
    
    if (files.length === 0) {
      console.log('移行する記事がありません。')
      return
    }
    
    console.log('')
    
    // 3. 各ファイルを処理
    let successCount = 0
    let skipCount = 0
    let errorCount = 0
    
    for (const file of files) {
      const filePath = path.join(articlesDir, file)
      console.log(`📝 処理中: ${file}`)
      
      // Markdownファイルを解析
      const parsed = parseMarkdownFile(filePath)
      if (!parsed) {
        errorCount++
        continue
      }
      
      try {
        // Supabase形式に変換
        const articleInput = convertToArticleInput(
          parsed.frontmatter,
          parsed.content,
          parsed.slug
        )
        
        // データベースに挿入
        const inserted = await insertArticle(articleInput)
        if (inserted) {
          successCount++
        } else {
          skipCount++
        }
      } catch (error) {
        console.error(`  ❌ 変換エラー: ${error}`)
        errorCount++
      }
    }
    
    // 4. 結果の表示
    console.log('\n📊 移行結果:')
    console.log(`  ✅ 成功: ${successCount}件`)
    console.log(`  ⚠️  スキップ: ${skipCount}件`)
    console.log(`  ❌ エラー: ${errorCount}件`)
    console.log(`  📄 合計: ${files.length}件`)
    
    if (successCount > 0) {
      console.log('\n🎉 移行が完了しました！')
      console.log('次のステップ:')
      console.log('  1. Webサイトで記事が正しく表示されることを確認')
      console.log('  2. 必要に応じて記事の微調整')
      console.log('  3. 旧ファイルシステムから新システムへの切り替え')
    }
    
  } catch (error) {
    console.error('移行処理中にエラーが発生しました:', error)
    process.exit(1)
  }
}

// メイン処理を実行
if (require.main === module) {
  main().catch(console.error)
}

export { main as migrateArticles }