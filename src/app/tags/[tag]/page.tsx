import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ui/ArticleCard'
import SidebarStatic from '@/components/ui/Sidebar.static'
import MobileSidebar from '@/components/ui/MobileSidebar'
import { getAllTagsWithCounts, getArticlesByTag } from '@/lib/articles-server'

export async function generateStaticParams() {
  const allTags = getAllTagsWithCounts()
  return allTags.map(tag => ({
    tag: tag.slug,
  }))
}

export default async function TagPage({
  params,
}: {
  params: { tag: string }
}): Promise<React.JSX.Element> {
  const decodedTag = decodeURIComponent(params.tag)
  const articles = getArticlesByTag(params.tag)

  if (articles.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="mb-8">
          <ol
            className="flex items-center space-x-2 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <li>
              <Link
                href="/"
                className="hover:opacity-80"
                style={{ color: 'var(--primary)' }}
              >
                ホーム
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/tags"
                className="hover:opacity-80"
                style={{ color: 'var(--primary)' }}
              >
                タグ一覧
              </Link>
            </li>
            <li>/</li>
            <li style={{ color: 'var(--text-primary)' }}>{decodedTag}</li>
          </ol>
        </nav>

        {/* メイン2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* メインコンテンツエリア（約70%幅） */}
          <div className="lg:col-span-3 space-y-8">
            <h1
              className="text-3xl font-bold mb-8"
              style={{ color: 'var(--text-primary)' }}
            >
              タグ: {decodedTag}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category}
                  publishedAt={article.publishedAt}
                  readTime={article.readTime}
                  viewCount={article.viewCount}
                  thumbnail={article.thumbnail}
                  href={`/article/${article.slug}`}
                  isPremium={article.isPremium}
                />
              ))}
            </div>
          </div>

          {/* サイドバーエリア（約30%幅） */}
          <div className="lg:col-span-1 hidden lg:block">
            <SidebarStatic />
          </div>
          <div className="lg:hidden">
            <MobileSidebar>
              <SidebarStatic />
            </MobileSidebar>
          </div>
        </div>
      </div>
    </div>
  )
}
