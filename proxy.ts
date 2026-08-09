import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(route + '/');
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(route => matchesRoute(pathname, route));
  const isPublicRoute = publicRoutes.some(route => matchesRoute(pathname, route));

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
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);
          if (parsed.value !== undefined) {
            nextResponse.cookies.set(parsed.name, parsed.value, {
              path: parsed.path,
              maxAge: parsed.maxAge,
              expires: parsed.expires,
              httpOnly: parsed.httpOnly,
              secure: parsed.secure,
              sameSite: parsed.sameSite,
              domain: parsed.domain,
              priority: parsed.priority,
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

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
