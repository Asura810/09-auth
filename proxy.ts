import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';
const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
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
      const nextResponse = isPublicRoute
        ? NextResponse.redirect(new URL('/', request.url))
        : NextResponse.next();
      const setCookie = response.headers['set-cookie'];
      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookie of cookieArray) {
          const [nameValue, ...attributes] = cookie.split(';');
          const [name, value] = nameValue.split('=');
          if (name && value) {
            nextResponse.cookies.set(name.trim(), value.trim(), {
              httpOnly: attributes.some(attr => attr.trim().toLowerCase() === 'httponly'),
              secure: attributes.some(attr => attr.trim().toLowerCase() === 'secure'),
              sameSite: 'lax',
            });
          }
        }
      }
      return nextResponse;
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
  if (isPrivateRoute && accessToken) {
    return NextResponse.next();
  }
  return NextResponse.next();
}
export const config = { matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'] };
