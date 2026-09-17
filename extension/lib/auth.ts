/*
 * Signing in, with the account this product already has.
 *
 * The first version of this asked for an API key, which works and asks a person to go and find a
 * string. This is the same sign-in the site uses: the extension sends you to `/api/oauth/authorize`
 * in a browser window, you approve it there — signed in already, that is one click — and the
 * extension is handed a token. Nothing is typed, nothing is pasted, and the grant is listed and
 * revocable on the account page beside every other connection.
 *
 * It is all machinery this server already runs for assistants: dynamic registration (RFC 7591),
 * PKCE, refresh tokens, and `/api/v1` accepting the access token as a bearer — see
 * `server/caller.ts`, which has resolved OAuth callers since the MCP endpoint shipped. The
 * extension needed no new endpoint, which is the whole reason this was the shape to build.
 *
 * `chrome.identity.launchWebAuthFlow` opens the window and hands back the redirect. Its redirect
 * URL is `https://<extension id>.chromiumapp.org/` — https, so the server's own rule about usable
 * redirect URIs accepts it, and it is unguessable by anything that is not this extension.
 */
const SITE = 'https://transformpipe.com';
const AUTHORIZE = `${SITE}/api/oauth/authorize`;
const TOKEN = `${SITE}/api/oauth/token`;
const REGISTER = `${SITE}/api/oauth/register`;
const SCOPE = 'documents:read documents:write';

const CLIENT = 'tp.oauth.client';
const TOKENS = 'tp.oauth.tokens';

interface Tokens {
  access: string;
  refresh?: string;
  /** When the access token stops working, in milliseconds since the epoch. */
  expires: number;
}

/** A high-entropy string in the alphabet PKCE allows. */
function verifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(48));

  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function challenge(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  );

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * This installation's client id, registered once and remembered.
 *
 * Every installation registers its own, because every installation has its own redirect URL — the
 * id is part of it. That also means revoking one person's grant cannot touch anybody else's.
 */
async function clientId(): Promise<string> {
  const stored = await chrome.storage.local.get(CLIENT);
  const known = stored[CLIENT] as string | undefined;

  if (known) {
    return known;
  }

  const response = await fetch(REGISTER, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_name: 'TransformPipe for Chrome',
      redirect_uris: [chrome.identity.getRedirectURL()],
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      scope: SCOPE,
    }),
  });

  if (!response.ok) {
    throw new Error(`registration refused: ${response.status}`);
  }

  const registered = (await response.json()) as { client_id: string };

  await chrome.storage.local.set({ [CLIENT]: registered.client_id });

  return registered.client_id;
}

async function exchange(body: Record<string, string>): Promise<Tokens> {
  const response = await fetch(TOKEN, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  });

  if (!response.ok) {
    throw new Error(`token refused: ${response.status}`);
  }

  const granted = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };

  const tokens: Tokens = {
    access: granted.access_token,
    refresh: granted.refresh_token,
    /* A minute early, so a token does not expire between the check and the request. */
    expires: Date.now() + ((granted.expires_in ?? 3600) - 60) * 1000,
  };

  await chrome.storage.local.set({ [TOKENS]: tokens });

  return tokens;
}

/** Opens the approval window and keeps what comes back. One click when already signed in. */
export async function signIn(): Promise<boolean> {
  const granted = await chrome.permissions.request({
    origins: [`${SITE}/*`],
    permissions: ['identity'],
  });

  if (!granted) {
    return false;
  }

  const client = await clientId();
  const secret = verifier();
  /* One request, one value, checked on the way back — the answer has to be to the question asked. */
  const state = verifier();
  const redirect = chrome.identity.getRedirectURL();

  const url = new URL(AUTHORIZE);

  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', client);
  url.searchParams.set('redirect_uri', redirect);
  url.searchParams.set('scope', SCOPE);
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', await challenge(secret));
  url.searchParams.set('code_challenge_method', 'S256');

  const answer = await chrome.identity.launchWebAuthFlow({
    url: url.toString(),
    interactive: true,
  });

  if (!answer) {
    return false;
  }

  const back = new URL(answer);

  /*
   * PKCE already means a code intercepted here cannot be exchanged by anyone else, and the window
   * is one the browser opened and controls — so this is the belt to that pair of braces. It costs
   * a parameter, the server round-trips it, and without it nothing distinguishes the redirect this
   * flow asked for from a redirect that simply arrived.
   */
  if (back.searchParams.get('state') !== state) {
    return false;
  }

  const code = back.searchParams.get('code');

  if (!code) {
    return false;
  }

  await exchange({
    grant_type: 'authorization_code',
    code,
    client_id: client,
    redirect_uri: redirect,
    code_verifier: secret,
  });

  return true;
}

export async function signOut() {
  await chrome.storage.local.remove(TOKENS);
}

/**
 * A usable access token, refreshed if the one in hand has run out.
 *
 * `null` means nobody is signed in — or that the refresh was refused, which is what a revoked grant
 * looks like from here and is the same answer for the caller either way.
 */
export async function accessToken(): Promise<string | null> {
  const stored = await chrome.storage.local.get(TOKENS);
  const tokens = stored[TOKENS] as Tokens | undefined;

  if (!tokens) {
    return null;
  }

  if (tokens.expires > Date.now()) {
    return tokens.access;
  }

  if (!tokens.refresh) {
    return null;
  }

  try {
    const fresh = await exchange({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh,
      client_id: await clientId(),
    });

    return fresh.access;
  } catch {
    await signOut();

    return null;
  }
}
