import { NextRequest, NextResponse } from 'next/server'
import {
  getArticleById,
  updateArticle,
  deleteArticle,
  incrementViewCount,
} from '@/lib/database/articles'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/articles/[id]
 * 記事の詳細を取得
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params

    // 閲覧数をインクリメントするかどうかのクエリパラメータ
    const { searchParams } = new URL(request.url)
    const incrementView = searchParams.get('increment_view') === 'true'

    const article = await getArticleById(id)

    if (!article) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      )
    }

    // 閲覧数をインクリメント（バックグラウンドで実行）
    if (incrementView) {
      incrementViewCount(id).catch(console.error)
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

/**
 * PUT /api/articles/[id]
 * 記事を更新
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = await request.json()

    // 必要に応じて認証チェックを追加
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    // }

    const updatedArticle = await updateArticle(id, body)

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error('記事更新エラー:', error)
    return NextResponse.json(
      { error: '記事の更新に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/articles/[id]
 * 記事を削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params

    // 必要に応じて認証チェックを追加
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    // }

    await deleteArticle(id)

    return NextResponse.json({ message: '記事を削除しました' })
  } catch (error) {
    console.error('記事削除エラー:', error)
    return NextResponse.json(
      { error: '記事の削除に失敗しました' },
      { status: 500 }
    )
  }
}
