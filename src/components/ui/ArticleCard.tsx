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

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case '風俗体験談':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'FANZA動画':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case '業界研究':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link href={href}>
        <div className="block">
          {/* サムネイル */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-gray-600 text-sm">No Image</span>
              </div>
            )}
            
            {/* プレミアムバッジ */}
            {isPremium && (
              <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Premium
              </div>
            )}
            
            {/* カテゴリーバッジ */}
            <div className="absolute bottom-3 left-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}>
                {category}
              </span>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
              {title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {excerpt}
            </p>
            
            {/* メタ情報 */}
            <div className="flex items-center justify-between text-sm text-gray-500">
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