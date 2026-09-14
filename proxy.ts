import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivateKey = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicKey = publicRoutes.some((route) => pathname.startsWith(route));

  let hasSession = !!accessToken;
  let newTokens: { accessToken?: string; refreshToken?: string } | null = null;

  if (!hasSession && refreshToken) {
    try {
      const sessionData = await checkSession();

      if (sessionData) {
        hasSession = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = sessionData as any;
        newTokens = {
          accessToken: data.accessToken || data.token,
          refreshToken: data.refreshToken || refreshToken,
        };
      }
    } catch {
      hasSession = false;
    }
  }

  if (isPrivateKey && !hasSession) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicKey && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();

  if (newTokens) {
    if (newTokens.accessToken) {
      response.cookies.set('accessToken', newTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }
    if (newTokens.refreshToken) {
      response.cookies.set('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};