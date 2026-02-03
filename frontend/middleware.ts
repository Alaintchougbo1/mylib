import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Routes publiques
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // Routes protégées
  if (!token && (pathname.startsWith('/livres') || pathname.startsWith('/demandes') || pathname.startsWith('/admin') || pathname.startsWith('/profil'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
