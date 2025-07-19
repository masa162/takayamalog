import { NextResponse } from 'next/server'
import { getArticleStats } from '@/lib/database/articles'

/**
 * GET /api/stats
 * サイト統計情報を取得
 */
export async function GET(): Promise<NextResponse> {
  try {
    const stats = await getArticleStats()
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('統計情報取得エラー:', error)
    return NextResponse.json(
      { error: '統計情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}