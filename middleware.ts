import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  

  const hasSession = request.cookies.has('sessionId') || request.cookies.has('token');

  const isPrivateKey = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicKey = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateKey && !hasSession) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicKey && hasSession) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};