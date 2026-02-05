import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/mypage', '/rank', '/mogak', '/room']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 프리페칭 요청은 인증 체크를 건너뜀
  if (
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.has('x-middleware-prefetch') ||
    request.headers.has('next-router-prefetch')
  ) {
    return NextResponse.next()
  }

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get('accessToken')?.value

  if (!accessToken) {
    const loginUrl = new URL('/auth/signin', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
