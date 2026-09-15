import { NextResponse } from 'next/server';
import { verifyAdminToken, COOKIE_NAME } from './lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login');

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = await verifyAdminToken(token);

  if (!valid) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
