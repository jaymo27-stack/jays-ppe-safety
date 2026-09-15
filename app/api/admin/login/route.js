import { NextResponse } from 'next/server';
import { checkAdminCredentials, createAdminToken, COOKIE_NAME } from '../../../../lib/auth';

export async function POST(request) {
  const { username, password } = await request.json();

  if (!checkAdminCredentials(username, password)) {
    return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
  }

  const token = await createAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}
