import Link from 'next/link'
import { CalendarIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline'

interface ArticleCardProps {
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime?: string
  viewCount?: number
  thumbnail?: string
  href: string
  isPremium?: boolean
}

export default function ArticleCard({
  title,
  excerpt,
  category,
  publishedAt,
  readTime,
  viewCount,
  thumbnail,
  href,
  isPremium = false,
}: ArticleCardProps): React.JSX.Element {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryStyle = (category: string): React.CSSProperties => {
    switch (category) {
      case '風俗体験談':
        return {
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }
      case 'FANZA動画':
        return {
          background: 'rgba(139, 92, 246, 0.1)',
          color: '#8b5cf6',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        }
      case '業界研究':
        return {
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        }
      default:
        return {
          background: 'rgba(115, 115, 115, 0.1)',
          color: '#737373',
          border: '1px solid rgba(115, 115, 115, 0.2)',
        }
    }
  }

  return (
    <article
      className="rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Link href={href}>
        <div className="block">
          {/* サムネイル */}
          <div
            className="relative h-48 overflow-hidden"
            style={{ background: 'var(--surface-elevated)' }}
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, var(--border) 0%, var(--border-light) 100%)',
                }}
              >
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  No Image
                </span>
              </div>
            )}

            {/* プレミアムバッジ */}
            {isPremium && (
              <div
                className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                  color: 'white',
                }}
              >
                Premium
              </div>
            )}

            {/* カテゴリーバッジ */}
            <div className="absolute bottom-3 left-3">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={getCategoryStyle(category)}
              >
                {category}
              </span>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="p-6">
            <h3
              className="text-xl font-semibold mb-3 line-clamp-2 transition-colors hover:opacity-80"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h3>

            <p
              className="mb-4 line-clamp-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              {excerpt}
            </p>

            {/* メタ情報 */}
            <div
              className="flex items-center justify-between text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{formatDate(publishedAt)}</span>
                </div>

                {readTime && (
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{readTime}</span>
                  </div>
                )}
              </div>

              {viewCount && (
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{viewCount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
