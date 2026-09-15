// Lightweight signed-cookie session using the Web Crypto API (works in both
// Node.js API routes and Edge middleware — no dependency on Node's `crypto` module).

const COOKIE_NAME = 'jays_admin_session';
const ONE_DAY = 60 * 60 * 24;

function getSecret() {
  return process.env.JWT_SECRET || 'dev-secret-change-me';
}

function base64UrlEncode(bytes) {
  let str = typeof bytes === 'string' ? bytes : String.fromCharCode(...new Uint8Array(bytes));
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

async function getKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function createAdminToken() {
  const payload = { role: 'admin', exp: Math.floor(Date.now() / 1000) + ONE_DAY / 2 };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(payloadStr);

  const key = await getKey();
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const sigB64 = base64UrlEncode(signature);

  return `${payloadB64}.${sigB64}`;
}

async function verifyAdminToken(token) {
  if (!token || !token.includes('.')) return false;
  const [payloadB64, sigB64] = token.split('.');

  try {
    const key = await getKey();
    const enc = new TextEncoder();
    const sigBytes = Uint8Array.from(base64UrlDecode(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payloadB64));
    if (!valid) return false;

    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.role !== 'admin') return false;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch (e) {
    return false;
  }
}

function checkAdminCredentials(username, password) {
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'admin';
  return username === validUser && password === validPass;
}

module.exports = {
  COOKIE_NAME,
  createAdminToken,
  verifyAdminToken,
  checkAdminCredentials,
};
