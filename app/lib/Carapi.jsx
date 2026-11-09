// Server-only helper for CarAPI (https://carapi.app/docs/).
// CarAPI does not allow browser (CORS) requests, so this must only run on the server.
// Put your credentials in .env.local (never prefix them with NEXT_PUBLIC_):
  CARAPI_TOKEN= process.env.CARAPI_TOKEN
  CARAPI_SECRET=process.env.CARAPI_SECRET
// Without credentials, CarAPI returns its demo dataset (vehicles from 2015-2020 only).

const BASE = 'https://carapi.app';

let cached = { jwt: null, exp: 0 };

async function getJwt() {
  const { CARAPI_TOKEN, CARAPI_SECRET } = process.env;
  if (!CARAPI_TOKEN || !CARAPI_SECRET) return null; // demo mode

  // Reuse the token until an hour before it expires (the login endpoint is rate limited)
  const now = Date.now() / 1000;
  if (cached.jwt && cached.exp - 3600 > now) return cached.jwt;

  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'text/plain' },
    body: JSON.stringify({ api_token: CARAPI_TOKEN, api_secret: CARAPI_SECRET }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`CarAPI login failed (${res.status})`);

  const jwt = (await res.text()).trim();
  const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
  cached = { jwt, exp: payload.exp };
  return jwt;
}

// Fetches every page of a list endpoint and returns the sorted, unique names.
export async function carApiNames(path, params = {}) {
  const jwt = await getJwt();
  const headers = { accept: 'application/json' };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const names = new Set();
  let url = `${BASE}${path}?${new URLSearchParams(params)}`;

  for (let page = 0; url && page < 30; page++) {
    // Car data rarely changes, so cache each response for a day
    const res = await fetch(url, { headers, next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`CarAPI request failed (${res.status})`);

    const body = await res.json();
    (body.data || []).forEach((item) => names.add(item.name));

    const next = body.collection?.next;
    url = next ? (next.startsWith('http') ? next : `${BASE}${next}`) : null;
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}