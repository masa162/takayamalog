import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlug, incrementViewCount } from '@/lib/database/articles'

interface RouteParams {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/articles/slug/[slug]
 * スラッグで記事を取得
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { slug } = await params
    
    // 閲覧数をインクリメントするかどうかのクエリパラメータ
    const { searchParams } = new URL(request.url)
    const incrementView = searchParams.get('increment_view') === 'true'
    
    const article = await getArticleBySlug(slug)
    
    if (!article) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      )
    }
    
    // 閲覧数をインクリメント（バックグラウンドで実行）
    if (incrementView) {
      incrementViewCount(article.id).catch(console.error)
    }
    
    return NextResponse.json(article)
  } catch (error) {
    console.error('記事取得エラー:', error)
    return NextResponse.json(
      { error: '記事の取得に失敗しました' },
      { status: 500 }
    )
  }
}