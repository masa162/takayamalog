import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, EyeIcon, TagIcon } from '@heroicons/react/24/outline'
import { getArticleBySlug, getRelatedArticles, articleExists } from '@/lib/articles'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params
  
  // 記事の存在確認
  if (!articleExists(id)) {
    notFound()
  }
  
  const article = getArticleBySlug(id)
  
  if (!article) {
    notFound()
  }
  
  // 関連記事を取得
  const relatedArticles = getRelatedArticles(article, 3)

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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">
                ホーム
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/articles" className="hover:text-blue-600">
                記事一覧
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{article.title}</li>
          </ol>
        </nav>

        {/* 記事メイン */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 記事ヘッダー */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
              {article.isPremium && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  Premium
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                <span>{article.viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <span>著者: {article.author}</span>
              </div>
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 年齢確認警告 */}
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-800 text-sm">
              ⚠️ この記事は18歳未満の方の閲覧を禁止しています。成人向けコンテンツが含まれています。
            </p>
          </div>

          {/* 記事本文 */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:text-red-600 prose-pre:bg-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-4"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />
          </div>

          {/* 記事フッター */}
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>※ 本記事は個人的な体験・感想に基づくものです</p>
                <p>※ 情報は記事作成時点のものです</p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/articles"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  記事一覧に戻る
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* 関連記事 */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">関連記事</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/article/${relatedArticle.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-3 ${getCategoryColor(relatedArticle.category)}`}>
                      {relatedArticle.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span>{formatDate(relatedArticle.publishedAt)}</span>
                      <span className="mx-2">•</span>
                      <ClockIcon className="h-3 w-3 mr-1" />
                      <span>{relatedArticle.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}