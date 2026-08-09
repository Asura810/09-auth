import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from './lib/api/serverApi';
const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (!accessToken && !refreshToken) {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      const setCookie = response.headers['set-cookie'];
      if (setCookie) {
        const responseWithCookies = NextResponse.next();
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookie of cookieArray) {
          responseWithCookies.headers.append('Set-Cookie', cookie);
        }
        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url));
        }
        return responseWithCookies;
      }
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
      return NextResponse.next();
    }
  }
  if (isPublicRoute && accessToken && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (isPrivateRoute && (!accessToken || !refreshToken)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'] };
