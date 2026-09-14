import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateKey = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicKey = publicRoutes.some((route) => pathname.startsWith(route));

  let hasSession = !!accessToken;
  let newTokens: { accessToken?: string; refreshToken?: string } | null = null;

  if (!hasSession && refreshToken) {
    try {
      const responseSession = await checkSession();
      if (responseSession) {
        hasSession = true;
        const data = responseSession.data as unknown as Record<string, unknown>;
        
        newTokens = {
          accessToken: (data?.accessToken as string) || (data?.token as string),
          refreshToken: (data?.refreshToken as string) || refreshToken,
        };
      }
    } catch {
      hasSession = false;
    }
  }

  const applyCookies = (res: NextResponse) => {
    if (newTokens) {
      if (newTokens.accessToken) {
        res.cookies.set('accessToken', newTokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      }
      if (newTokens.refreshToken) {
        res.cookies.set('refreshToken', newTokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      }
    }
    return res;
  };

  if (isPrivateKey && !hasSession) {
    const redirectRes = NextResponse.redirect(new URL('/sign-in', request.url));
    return applyCookies(redirectRes);
  }

  if (isPublicKey && hasSession) {
    const redirectRes = NextResponse.redirect(new URL('/', request.url));
    return applyCookies(redirectRes);
  }

  const response = NextResponse.next();
  return applyCookies(response);
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};