import Link from 'next/link'
import ArticleCard from '@/components/ui/ArticleCard'
import { getLatestArticles, getPopularArticles, getArticleStats, getCategories } from '@/lib/articles-server'

export default async function Home() {
  try {
    const [latestArticles, popularArticles, stats, categories] = await Promise.all([
      getLatestArticles(3),
      getPopularArticles(3),
      getArticleStats(),
      getCategories(),
    ])

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          {/* ヒーロセクション */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              高山まさあきの夜遊び研究所
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              実体験に基づく信頼できる情報をお届けします
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-8">
              ⚠️ 18歳未満の方は閲覧できません
            </div>
          </div>

          {/* 研究分野紹介 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Link href="/category/fuzoku" className="research-card hover:shadow-xl transition-all duration-300">
              <div className="research-badge bg-red-100 text-red-800 mb-4">
                風俗体験談
              </div>
              <h3 className="research-heading text-lg">店舗型風俗・デリヘル</h3>
              <p className="research-text mb-4">
                実際の利用体験に基づいた詳細なレポートを提供します。
              </p>
              <div className="text-sm text-gray-500">
                {categories.find(c => c.slug === 'fuzoku')?.count || 0} 件の研究報告
              </div>
            </Link>

            <Link href="/category/fanza" className="research-card hover:shadow-xl transition-all duration-300">
              <div className="research-badge bg-purple-100 text-purple-800 mb-4">
                FANZA動画レビュー
              </div>
              <h3 className="research-heading text-lg">動画作品分析</h3>
              <p className="research-text mb-4">
                新作動画の詳細レビューと評価を研究員が分析します。
              </p>
              <div className="text-sm text-gray-500">
                {categories.find(c => c.slug === 'fanza')?.count || 0} 件の研究報告
              </div>
            </Link>

            <Link href="/category/research" className="research-card hover:shadow-xl transition-all duration-300">
              <div className="research-badge bg-blue-100 text-blue-800 mb-4">
                業界研究
              </div>
              <h3 className="research-heading text-lg">トレンド分析</h3>
              <p className="research-text mb-4">
                業界の最新動向と市場分析を定期的にレポートします。
              </p>
              <div className="text-sm text-gray-500">
                {categories.find(c => c.slug === 'research')?.count || 0} 件の研究報告
              </div>
            </Link>
          </div>

          {/* 最新の研究成果 */}
          {latestArticles.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  最新の研究成果
                </h2>
                <Link href="/articles" className="text-blue-600 hover:text-blue-800 font-medium">
                  すべて見る →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestArticles.map((article) => (
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
          )}

          {/* 人気の研究報告 */}
          {popularArticles.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  人気の研究報告
                </h2>
                <Link href="/articles" className="text-blue-600 hover:text-blue-800 font-medium">
                  すべて見る →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularArticles.map((article) => (
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
          )}

          {/* 研究所について */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              研究所について
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  研究方針
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 実体験に基づく客観的な分析</li>
                  <li>• 読者に役立つ実用的な情報提供</li>
                  <li>• 業界の健全な発展への貢献</li>
                  <li>• 法的・倫理的配慮の徹底</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  研究実績
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 風俗ライター歴8年</li>
                  <li>• 年間300本以上の動画レビュー</li>
                  <li>• 全国主要都市での取材実績</li>
                  <li>• 業界関係者との信頼関係</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  研究成果統計
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 総研究報告数: {stats.totalArticles.toLocaleString()} 件</li>
                  <li>• 総閲覧数: {stats.totalViews.toLocaleString()} 回</li>
                  <li>• 活動分野: {categories.length} 分野</li>
                  <li>• 更新頻度: 週2-3回</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA セクション */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">研究成果を詳しく見る</h2>
              <p className="text-blue-100 mb-6">
                高山まさあきの8年間の研究成果をぜひご覧ください
              </p>
              <Link 
                href="/articles" 
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                記事一覧を見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('データ読み込みエラー:', error)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            高山まさあきの夜遊び研究所
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            データ読み込み中です...
          </p>
        </div>
      </div>
    )
  }
}