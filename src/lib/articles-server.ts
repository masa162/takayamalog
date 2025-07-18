import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Article, ArticleMetadata } from './articles'

// Markdownコンテンツのディレクトリパス
const articlesDirectory = path.join(process.cwd(), 'content/articles')

// Markedの設定
marked.setOptions({
  breaks: true,
  gfm: true,
})

/**
 * 記事ファイルのパスを取得
 */
function getArticleFilePaths(): string[] {
  try {
    const files = fs.readdirSync(articlesDirectory)
    return files.filter(file => file.endsWith('.md'))
  } catch (error) {
    console.error('記事ディレクトリの読み取りエラー:', error)
    return []
  }
}

/**
 * ファイル名からスラッグを生成
 */
function getSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/, '')
}

/**
 * 記事のメタデータを取得
 */
export function getArticleMetadata(slug: string): ArticleMetadata | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      id: slug,
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      category: data.category || '',
      publishedAt: data.publishedAt || '',
      readTime: data.readTime || '',
      viewCount: data.viewCount || 0,
      thumbnail: data.thumbnail || '',
      isPremium: data.isPremium || false,
      tags: data.tags || [],
      author: data.author || '',
    }
  } catch (error) {
    console.error(`記事メタデータの読み取りエラー (${slug}):`, error)
    return null
  }
}

/**
 * 記事の詳細情報を取得
 */
export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // MarkdownをHTMLに変換
    const htmlContent = marked(content) as string

    return {
      id: slug,
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: htmlContent,
      category: data.category || '',
      publishedAt: data.publishedAt || '',
      readTime: data.readTime || '',
      viewCount: data.viewCount || 0,
      thumbnail: data.thumbnail || '',
      isPremium: data.isPremium || false,
      tags: data.tags || [],
      author: data.author || '',
    }
  } catch (error) {
    console.error(`記事の読み取りエラー (${slug}):`, error)
    return null
  }
}

/**
 * 全記事のメタデータを取得
 */
export function getAllArticleMetadata(): ArticleMetadata[] {
  const filePaths = getArticleFilePaths()
  const articles: ArticleMetadata[] = []

  filePaths.forEach(fileName => {
    const slug = getSlugFromFileName(fileName)
    const metadata = getArticleMetadata(slug)

    if (metadata) {
      articles.push(metadata)
    }
  })

  // 公開日の降順でソート
  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

/**
 * カテゴリー別の記事メタデータを取得
 */
export function getArticlesByCategory(category: string): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  return allArticles.filter(article => article.category === category)
}

/**
 * 記事を検索
 */
export function searchArticles(query: string): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  const searchTerm = query.toLowerCase()

  return allArticles.filter(
    article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

/**
 * 関連記事を取得
 */
export function getRelatedArticles(
  article: ArticleMetadata,
  limit: number = 3
): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()

  // 同じカテゴリーの記事を優先
  const sameCategory = allArticles.filter(
    a => a.id !== article.id && a.category === article.category
  )

  // 同じタグを持つ記事
  const sameTags = allArticles.filter(
    a =>
      a.id !== article.id &&
      a.category !== article.category &&
      a.tags.some(tag => article.tags.includes(tag))
  )

  // 結果をマージして制限数に切り詰め
  const related = [...sameCategory, ...sameTags].slice(0, limit)

  return related
}

/**
 * 記事の統計情報を取得
 */
export function getArticleStats(): {
  totalArticles: number
  articlesByCategory: Record<string, number>
  totalViews: number
} {
  const allArticles = getAllArticleMetadata()

  const articlesByCategory: Record<string, number> = {}
  let totalViews = 0

  allArticles.forEach(article => {
    // カテゴリー別カウント
    articlesByCategory[article.category] =
      (articlesByCategory[article.category] || 0) + 1

    // 総閲覧数
    totalViews += article.viewCount
  })

  return {
    totalArticles: allArticles.length,
    articlesByCategory,
    totalViews,
  }
}

/**
 * 記事の存在確認
 */
export function articleExists(slug: string): boolean {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`)
    return fs.existsSync(fullPath)
  } catch {
    return false
  }
}

/**
 * 最新記事を取得
 */
export function getLatestArticles(limit: number = 5): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  return allArticles.slice(0, limit)
}

/**
 * 人気記事を取得（閲覧数順）
 */
export function getPopularArticles(limit: number = 5): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  return allArticles.sort((a, b) => b.viewCount - a.viewCount).slice(0, limit)
}

/**
 * プレミアム記事を取得
 */
export function getPremiumArticles(): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  return allArticles.filter(article => article.isPremium)
}

/**
 * カテゴリー一覧を取得
 */
export function getCategories(): Array<{
  name: string
  slug: string
  count: number
}> {
  const stats = getArticleStats()

  const categoryMapping: Record<string, string> = {
    風俗体験談: 'fuzoku',
    FANZA動画: 'fanza',
    業界研究: 'research',
  }

  return Object.entries(stats.articlesByCategory).map(([name, count]) => ({
    name,
    slug: categoryMapping[name] || name.toLowerCase(),
    count,
  }))
}
