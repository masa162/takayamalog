'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ui/ArticleCard'
import SearchBar from '@/components/ui/SearchBar'
import Pagination from '@/components/ui/Pagination'
import { getArticlesByCategory } from '@/lib/articles'
import type { ArticleMetadata } from '@/lib/articles'


interface CategoryInfo {
  slug: string
  name: string
  description: string
  color: string
  icon: string
}

const categories: Record<string, CategoryInfo> = {
  fuzoku: {
    slug: 'fuzoku',
    name: '風俗体験談',
    description: '実際の風俗店舗利用体験に基づく詳細なレポートをお届けします。店舗選びの参考にしてください。',
    color: 'red',
    icon: '💋'
  },
  fanza: {
    slug: 'fanza',
    name: 'FANZA動画レビュー',
    description: 'FANZA動画の詳細レビューと評価。新作から人気作品まで幅広く分析します。',
    color: 'purple',
    icon: '🎬'
  },
  research: {
    slug: 'research',
    name: '業界研究',
    description: '風俗業界の最新動向、市場分析、技術革新について研究しています。',
    color: 'blue',
    icon: '📊'
  }
}


interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  const category = categories[slug]

  if (!category) {
    notFound()
  }

  // この部分は実際のコンポーネントでは別のコンポーネントに分離
  const CategoryPageClient = ({ category }: { category: CategoryInfo }): React.JSX.Element => {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [articles, setArticles] = useState<ArticleMetadata[]>([])

    // カテゴリー別記事の取得
    useEffect(() => {
      const categoryArticles = getArticlesByCategory(category.name)
      setArticles(categoryArticles)
    }, [category.name])

    const filteredArticles = articles.filter(article => {
      const matchesSearch = !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesSearch
    })

    const articlesPerPage = 6
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
    const startIndex = (currentPage - 1) * articlesPerPage
    const displayedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage)

    const handleSearch = (query: string): void => {
      setSearchQuery(query)
      setCurrentPage(1)
    }

    const handlePageChange = (page: number): void => {
      setCurrentPage(page)
    }

    const getCategoryColorClasses = (color: string): string => {
      switch (color) {
        case 'red':
          return 'from-red-500 to-red-600 text-white'
        case 'purple':
          return 'from-purple-500 to-purple-600 text-white'
        case 'blue':
          return 'from-blue-500 to-blue-600 text-white'
        default:
          return 'from-gray-500 to-gray-600 text-white'
      }
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
              <li className="text-gray-900">{category.name}</li>
            </ol>
          </nav>

          {/* カテゴリーヘッダー */}
          <div className={`bg-gradient-to-r ${getCategoryColorClasses(category.color)} rounded-lg p-8 mb-8`}>
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">{category.icon}</span>
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
            <p className="text-lg opacity-90 mb-4">
              {category.description}
            </p>
            <div className="flex items-center text-sm opacity-80">
              <span>{filteredArticles.length} 件の記事</span>
            </div>
          </div>

          {/* 年齢確認警告 */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <p className="text-red-800 text-sm">
              ⚠️ このカテゴリーは18歳未満の方の閲覧を禁止しています。成人向けコンテンツが含まれています。
            </p>
          </div>

          {/* 検索バー */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <SearchBar
              placeholder={`${category.name}の記事を検索...`}
              onSearch={handleSearch}
              className="w-full"
            />
          </div>

          {/* 統計情報 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredArticles.length} 件の記事が見つかりました
                {searchQuery && (
                  <span className="ml-2 text-blue-600">
                    「{searchQuery}」で検索
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {startIndex + 1} - {Math.min(startIndex + articlesPerPage, filteredArticles.length)} 件目を表示
              </div>
            </div>
          </div>

          {/* 記事一覧 */}
          <div className="mb-8">
            {displayedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedArticles.map((article) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">該当する記事が見つかりませんでした</p>
                <p className="text-gray-400 text-sm mt-2">
                  検索条件を変更してもう一度お試しください
                </p>
              </div>
            )}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* 関連情報 */}
          <div className="bg-white rounded-lg shadow-md p-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {category.name}について
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  このカテゴリーの特徴
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {category.slug === 'fuzoku' && (
                    <>
                      <li>• 実体験に基づく詳細レポート</li>
                      <li>• 料金・サービス内容の透明性</li>
                      <li>• 店舗選びの参考情報</li>
                      <li>• 客観的な評価とレビュー</li>
                    </>
                  )}
                  {category.slug === 'fanza' && (
                    <>
                      <li>• 最新動画の詳細レビュー</li>
                      <li>• ジャンル別分析</li>
                      <li>• 人気作品ランキング</li>
                      <li>• 女優情報とトレンド</li>
                    </>
                  )}
                  {category.slug === 'research' && (
                    <>
                      <li>• 業界動向の分析</li>
                      <li>• 市場データの解析</li>
                      <li>• 技術革新の影響調査</li>
                      <li>• 将来予測とトレンド</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  更新頻度
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 週2-3回の新記事投稿</li>
                  <li>• 月1回の特集記事</li>
                  <li>• 随時情報更新</li>
                  <li>• 読者からのリクエスト対応</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <CategoryPageClient category={category} />
}