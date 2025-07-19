import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, EyeIcon, TagIcon } from '@heroicons/react/24/outline'
import { getArticleBySlug, getRelatedArticles, convertToArticle, incrementViewCount } from '@/lib/database/articles'
import SidebarServer from '@/components/ui/Sidebar.server'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params
  
  const dbArticle = await getArticleBySlug(id)
  
  if (!dbArticle) {
    notFound()
  }
  
  // 閲覧数をインクリメント（バックグラウンドで実行）
  incrementViewCount(dbArticle.id).catch(console.error)
  
  // DatabaseArticle を Article 形式に変換
  const article = convertToArticle(dbArticle)
  
  // 関連記事を取得
  const relatedDbArticles = await getRelatedArticles(dbArticle, 3)
  const relatedArticles = relatedDbArticles.map(convertToArticle)

  const getCategoryStyle = (category: string): React.CSSProperties => {
    switch (category) {
      case '風俗体験談':
        return {
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      case 'FANZA動画':
        return {
          background: 'rgba(139, 92, 246, 0.1)',
          color: '#8b5cf6',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }
      case '業界研究':
        return {
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }
      default:
        return {
          background: 'rgba(115, 115, 115, 0.1)',
          color: '#737373',
          border: '1px solid rgba(115, 115, 115, 0.2)'
        }
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
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li>
              <Link href="/" className="hover:opacity-80" style={{ color: 'var(--primary)' }}>
                ホーム
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/articles" className="hover:opacity-80" style={{ color: 'var(--primary)' }}>
                記事一覧
              </Link>
            </li>
            <li>/</li>
            <li style={{ color: 'var(--text-primary)' }}>{article.title}</li>
          </ol>
        </nav>

        {/* メイン2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* メインコンテンツエリア（約70%幅） */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* 記事メイン */}
            <article className="rounded-lg overflow-hidden content-card-elevated">
              {/* 記事ヘッダー */}
              <div className="p-8" style={{ borderBottom: '1px solid var(--border)' }}>
                {/* 研究報告書ヘッダー */}
                <div className="rounded-lg p-4 mb-6" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: 'var(--primary)' }}>夜遊び研究所</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>研究報告書</span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Report No. {article.slug.toUpperCase().replace(/-/g, '')} / {formatDate(article.publishedAt).replace(/年|月|日/g, '').replace(/\s/g, '')}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        style={getCategoryStyle(article.category)}>
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    {article.isPremium && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            style={{ 
                              background: 'rgba(251, 191, 36, 0.1)',
                              color: '#f59e0b',
                              border: '1px solid rgba(251, 191, 36, 0.2)'
                            }}>
                        Premium
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          style={{ 
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.2)'
                          }}>
                      研究完了
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {article.title}
                </h1>

                {/* 研究概要 */}
                <div className="rounded-lg p-4 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {article.excerpt}
                  </p>
                </div>

                {/* メタ情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg content-card">
                    <CalendarIcon className="h-5 w-5 mx-auto mb-1" style={{ color: 'var(--primary)' }} />
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>研究日</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatDate(article.publishedAt)}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg content-card">
                    <ClockIcon className="h-5 w-5 mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>読了時間</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{article.readTime}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg content-card">
                    <EyeIcon className="h-5 w-5 mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>閲覧数</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{article.viewCount.toLocaleString()}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg content-card">
                    <div className="h-5 w-5 mx-auto mb-1 rounded-full flex items-center justify-center"
                         style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
                      <span className="text-white text-xs">研</span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>研究員</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{article.author}</div>
                  </div>
                </div>

                {/* 研究タグ */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>研究キーワード:</div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 年齢確認警告 */}
              <div className="p-4" style={{ 
                background: 'rgba(239, 68, 68, 0.1)',
                borderLeft: '4px solid var(--primary)'
              }}>
                <p className="text-sm" style={{ color: 'var(--primary)' }}>
                  ⚠️ この記事は18歳未満の方の閲覧を禁止しています。成人向けコンテンツが含まれています。
                </p>
              </div>

              {/* 記事本文 */}
              <div className="p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  style={{ 
                    color: 'var(--text-primary)',
                  }}
                  dangerouslySetInnerHTML={{ __html: article.content || '' }}
                />
              </div>

              {/* 記事フッター */}
              <div className="p-8" style={{ 
                borderTop: '1px solid var(--border)',
                background: 'var(--surface)'
              }}>
                {/* 研究所フッター */}
                <div className="content-card p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                         style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
                      <span className="text-white text-sm font-bold">研</span>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>高山まさあきの夜遊び研究所</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>実体験に基づく信頼できる情報をお届け</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>研究方針</h4>
                      <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <li>• 実体験重視</li>
                        <li>• 客観的分析</li>
                        <li>• 読者第一</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>研究分野</h4>
                      <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <li>• 風俗体験談</li>
                        <li>• FANZA動画分析</li>
                        <li>• 業界トレンド</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>研究実績</h4>
                      <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <li>• ライター歴8年</li>
                        <li>• 年間300本レビュー</li>
                        <li>• 全国取材実績</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="text-sm">
                    <div className="rounded-lg p-3 mb-3" style={{ 
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.2)'
                    }}>
                      <h4 className="font-medium mb-1" style={{ color: '#f59e0b' }}>研究報告書についての注意事項</h4>
                      <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <li>• 本報告書は研究員の実体験・分析に基づくものです</li>
                        <li>• 情報は研究時点のものであり、変更される可能性があります</li>
                        <li>• 利用は自己責任でお願いします</li>
                        <li>• 18歳未満の方は閲覧できません</li>
                      </ul>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      研究番号: {article.slug.toUpperCase().replace(/-/g, '')} | 
                      発行: 夜遊び研究所 | 
                      最終更新: {formatDate(article.publishedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <Link
                      href="/articles"
                      className="inline-flex items-center px-4 py-2 rounded-lg transition-colors text-center"
                      style={{ 
                        background: 'var(--primary)',
                        color: 'white'
                      }}
                    >
                      研究報告一覧
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center px-4 py-2 rounded-lg transition-colors text-center content-card"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      研究所トップ
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* 関連記事 */}
            {relatedArticles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>関連記事</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/article/${relatedArticle.slug}`}
                      className="content-card hover:opacity-80 transition-opacity duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
                              style={getCategoryStyle(relatedArticle.category)}>
                          {relatedArticle.category}
                        </span>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                          {relatedArticle.title}
                        </h3>
                        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {relatedArticle.excerpt}
                        </p>
                        <div className="flex items-center text-xs" style={{ color: 'var(--text-muted)' }}>
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

          {/* サイドバーエリア（約30%幅） */}
          <div className="lg:col-span-1">
            <SidebarServer />
          </div>
        </div>
      </div>
    </div>
  )
}