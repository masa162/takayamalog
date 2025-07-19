import { NextRequest, NextResponse } from 'next/server'
import { createArticle, getArticles } from '@/lib/database/articles'

/**
 * GET /api/articles
 * 記事一覧を取得
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      limit: searchParams.get('limit')
        ? parseInt(searchParams.get('limit')!)
        : undefined,
      offset: searchParams.get('offset')
        ? parseInt(searchParams.get('offset')!)
        : undefined,
      category: searchParams.get('category') || undefined,
      article_type: searchParams.get('article_type') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      sort:
        (searchParams.get('sort') as
          | 'created_at'
          | 'published_at'
          | 'view_count'
          | 'rating') || undefined,
      order: (searchParams.get('order') as 'asc' | 'desc') || undefined,
    }

    const result = await getArticles(options)

    return NextResponse.json(result)
  } catch (error) {
    console.error('記事一覧取得エラー:', error)
    return NextResponse.json(
      { error: '記事一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/articles
 * 新しい記事を作成
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    // 必要に応じて認証チェックを追加
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    // }

    // 必須フィールドの検証
    if (!body.title || !body.slug || !body.content || !body.article_type) {
      return NextResponse.json(
        {
          error:
            '必須フィールドが不足しています (title, slug, content, article_type)',
        },
        { status: 400 }
      )
    }

    const newArticle = await createArticle(body)

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error('記事作成エラー:', error)
    return NextResponse.json(
      { error: '記事の作成に失敗しました' },
      { status: 500 }
    )
  }
}
