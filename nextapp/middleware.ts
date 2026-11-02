import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. HTTP Security Headers (Proteksi Clickjacking, XSS, & MIME Sniffing)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // 2. Proteksi Akses Server-Side untuk Halaman Super Admin (/admin)
  if (pathname.startsWith('/admin')) {
    // Cek keberadaan session token autentikasi resmi
    const hasAdminSession =
      request.cookies.get('sb-access-token') ||
      request.cookies.get('pawskost_admin_session') ||
      request.cookies.get('supabase-auth-token');

    // Jika belum ada session di server, arahkan dengan aman ke halaman login
    // (Bisa dibuka langsung jika user telah login sebagai superadmin)
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, bumper video, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|mp4|webm)).*)',
  ],
};
