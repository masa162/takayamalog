import Link from 'next/link'
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import {
  getLatestArticles,
  getArchivedArticlesData,
  getAllTagsWithCounts,
} from '@/lib/articles-server'
import SidebarArchiveList from './SidebarArchiveList'
import ClientSearchBarWrapper from './ClientSearchBarWrapper'

interface SidebarProps {
  className?: string
}

export default async function SidebarStatic({
  className = '',
}: SidebarProps): Promise<React.JSX.Element> {
  // 静的データを使用
  const recentPosts = await getLatestArticles(5)
  const archivedData = getArchivedArticlesData()
  const allTags = getAllTagsWithCounts()

  const categories = [
    { name: '風俗体験談', slug: 'fuzoku', count: 2 },
    { name: 'FANZA動画レビュー', slug: 'fanza', count: 2 },
    { name: '業界研究', slug: 'research', count: 1 },
    { name: 'FANZA_VRレビュー', slug: 'fanzavr', count: 1 },
  ]

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 検索ボックス */}
      <div className="content-card sticky top-4">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          サイト内を検索
        </h3>
        <ClientSearchBarWrapper />
      </div>

      {/* 最新の研究報告 */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          最新の研究報告
        </h3>
        <div className="space-y-4">
          {recentPosts.map(post => (
            <Link
              key={post.id}
              href={`/article/${post.slug}`}
              className="block p-3 rounded-lg hover:opacity-80 transition-colors"
              style={{ background: 'var(--surface)' }}
            >
              <h4
                className="text-sm font-medium mb-2 line-clamp-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {post.title}
              </h4>
              <div
                className="flex items-center justify-between text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                  }}
                >
                  {post.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* カテゴリ */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          研究分野
        </h3>
        <div className="space-y-3">
          {categories.map(category => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="flex justify-between items-center p-2 rounded-lg hover:opacity-80 transition-colors"
              style={{ background: 'var(--surface)' }}
            >
              <span
                className="text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                {category.name}
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                }}
              >
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 記事アーカイブ */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          記事アーカイブ
        </h3>
        <SidebarArchiveList archivedData={archivedData} />
      </div>

      {/* タグ一覧 */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          タグ一覧
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Link
              key={tag.name}
              href={`/tags/${tag.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {tag.name} ({tag.count})
            </Link>
          ))}
        </div>
      </div>

      {/* 研究所からのお知らせ */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          研究所からのお知らせ
        </h3>
        <div className="space-y-3">
          <div
            className="p-3 rounded-lg"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            <div className="flex items-center mb-2">
              <span
                className="text-xs font-medium"
                style={{ color: '#22c55e' }}
              >
                NEW
              </span>
              <span
                className="text-xs ml-2"
                style={{ color: 'var(--text-muted)' }}
              >
                2025.07.15
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              新カテゴリ「VR体験」の研究を開始しました
            </p>
          </div>

          <div
            className="p-3 rounded-lg"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <div className="flex items-center mb-2">
              <TagIcon className="h-3 w-3" style={{ color: '#3b82f6' }} />
              <span
                className="text-xs ml-1"
                style={{ color: 'var(--text-muted)' }}
              >
                2025.07.10
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              サイトリニューアルが完了しました
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
