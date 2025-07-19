import ArticlesPageClient from '@/components/pages/ArticlesPageClient'
import { getAllArticleMetadata, getCategories } from '@/lib/articles-server'

export default async function ArticlesPage(): Promise<React.JSX.Element> {
  try {
    const [allArticles, categoryData] = await Promise.all([
      getAllArticleMetadata(),
      getCategories(),
    ])

    // カテゴリーデータを適切な形式に変換
    const formattedCategories = [
      { id: 'all', name: '全て', color: 'gray', count: allArticles.length },
      ...categoryData.map(cat => ({
        id: cat.slug,
        name: cat.name,
        color:
          cat.slug === 'fuzoku'
            ? 'red'
            : cat.slug === 'fanza'
              ? 'purple'
              : 'blue',
        count: cat.count,
      })),
    ]

    return (
      <ArticlesPageClient
        initialArticles={allArticles}
        categories={formattedCategories}
      />
    )
  } catch (error) {
    console.error('記事データ読み込みエラー:', error)

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">記事一覧</h1>
          <p className="text-xl text-gray-600">データ読み込み中です...</p>
        </div>
      </div>
    )
  }
}
