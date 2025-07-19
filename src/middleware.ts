import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Supabase環境変数がない場合はSupabaseセッション更新をスキップ
  let supabaseResponse
  try {
    supabaseResponse = await updateSession(request)
  } catch (error) {
    console.error('ミドルウェアエラー:', error)
    supabaseResponse = NextResponse.next()
  }

  // セキュリティヘッダーの設定
  const response = NextResponse.next()

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // CSPヘッダー設定
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self';
    connect-src 'self' https://*.supabase.co https://api.dmm.com https://www.google-analytics.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  response.headers.set('Content-Security-Policy', cspHeader)

  // 年齢確認チェック
  const ageVerified = request.cookies.get('age_verified')?.value
  const protectedPaths = ['/fuzoku', '/fanza', '/admin']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  // 年齢確認が必要なパスの場合
  if (
    isProtectedPath &&
    pathname !== '/age-verification' &&
    !ageVerified &&
    !pathname.startsWith('/api')
  ) {
    return NextResponse.redirect(new URL('/age-verification', request.url))
  }

  // 管理者画面のアクセス制御
  if (pathname.startsWith('/admin')) {
    // Supabaseセッションをチェック
    const sessionCookie = request.cookies.get('sb-access-token')
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // レート制限（簡易版）
  // const ip = request.headers.get('x-forwarded-for') ||
  //            request.headers.get('x-real-ip') ||
  //            'unknown'

  // APIエンドポイントの保護
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/auth')) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
