import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, EyeIcon, TagIcon } from '@heroicons/react/24/outline'
import { getArticleBySlug, getRelatedArticles, articleExists } from '@/lib/articles-server'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params
  
  // 記事の存在確認
  if (!(await articleExists(id))) {
    notFound()
  }
  
  const article = await getArticleBySlug(id)
  
  if (!article) {
    notFound()
  }
  
  // 関連記事を取得
  const relatedArticles = await getRelatedArticles(article, 3)

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
            {/* 研究報告書ヘッダー */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600">夜遊び研究所</span>
                <span className="text-xs text-gray-500">研究報告書</span>
              </div>
              <div className="text-xs text-gray-600">
                Report No. {article.slug.toUpperCase().replace(/-/g, '')} / {formatDate(article.publishedAt).replace(/年|月|日/g, '').replace(/\s/g, '')}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
              <div className="flex items-center space-x-2">
                {article.isPremium && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Premium
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  研究完了
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* 研究概要 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* メタ情報 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-white rounded-lg border">
                <CalendarIcon className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-xs text-gray-500">研究日</div>
                <div className="text-sm font-medium">{formatDate(article.publishedAt)}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <ClockIcon className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-xs text-gray-500">読了時間</div>
                <div className="text-sm font-medium">{article.readTime}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <EyeIcon className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                <div className="text-xs text-gray-500">閲覧数</div>
                <div className="text-sm font-medium">{article.viewCount.toLocaleString()}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="h-5 w-5 mx-auto mb-1 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">研</span>
                </div>
                <div className="text-xs text-gray-500">研究員</div>
                <div className="text-sm font-medium">{article.author}</div>
              </div>
            </div>

            {/* 研究タグ */}
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600 mb-2">研究キーワード:</div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
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
            {/* 研究所フッター */}
            <div className="bg-white rounded-lg p-6 mb-6 border">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">研</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">高山まさあきの夜遊び研究所</h3>
                  <p className="text-sm text-gray-600">実体験に基づく信頼できる情報をお届け</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">研究方針</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 実体験重視</li>
                    <li>• 客観的分析</li>
                    <li>• 読者第一</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">研究分野</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 風俗体験談</li>
                    <li>• FANZA動画分析</li>
                    <li>• 業界トレンド</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">研究実績</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• ライター歴8年</li>
                    <li>• 年間300本レビュー</li>
                    <li>• 全国取材実績</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-yellow-800 mb-1">研究報告書についての注意事項</h4>
                  <ul className="text-yellow-700 text-xs space-y-1">
                    <li>• 本報告書は研究員の実体験・分析に基づくものです</li>
                    <li>• 情報は研究時点のものであり、変更される可能性があります</li>
                    <li>• 利用は自己責任でお願いします</li>
                    <li>• 18歳未満の方は閲覧できません</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500">
                  研究番号: {article.slug.toUpperCase().replace(/-/g, '')} | 
                  発行: 夜遊び研究所 | 
                  最終更新: {formatDate(article.publishedAt)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/articles"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  研究報告一覧
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  研究所トップ
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