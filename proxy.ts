import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];

const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasToken = request.cookies.has('token');

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPrivateRoute && !hasToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && hasToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
