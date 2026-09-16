/*
 * The account, from an extension: one key, one endpoint, and a permission asked for at the moment
 * it is needed.
 *
 * The key is the same `tp_live_…` the command line uses and the same one the account page issues
 * and revokes, so nothing new was built on the server for this and nothing here can outlive a
 * revocation. It is kept in `chrome.storage.local` — the extension's own store, which is where the
 * CLI's `~/.config/tp/config.json` would be if an extension had a disk.
 *
 * The permission to reach transformpipe.com is *optional* and requested when somebody connects an
 * account, not at install. An extension that asks on day one for access to a domain reads the same
 * in the browser's install dialog whether it uses it or not, and until a key exists this one has no
 * reason to talk to us at all — converting is done here, in the page.
 */
const KEY = 'tp.key';
const ORIGIN = 'https://transformpipe.com';

export interface Saved {
  id: string;
  name: string;
  share: { mode: string; url: string | null };
}

export async function storedKey(): Promise<string | null> {
  const stored = await chrome.storage.local.get(KEY);

  return (stored[KEY] as string | undefined) ?? null;
}

export async function forgetKey() {
  await chrome.storage.local.remove(KEY);
}

/** Asks for the one origin this extension ever calls, and only when there is a reason to. */
export async function grantOrigin(): Promise<boolean> {
  return chrome.permissions.request({ origins: [`${ORIGIN}/*`] });
}

async function call(
  key: string,
  path: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(`${ORIGIN}/api/v1${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      authorization: `Bearer ${key}`,
    },
  });
}

/**
 * Whether a key is a key, asked of the cheapest endpoint there is.
 *
 * `/usage` reads two numbers and writes nothing, so a mistyped key costs a rejection rather than a
 * document nobody wanted. It is also the only way to tell a typo from a revoked key before somebody
 * has a converted page in front of them and presses Save.
 */
export async function checkKey(key: string): Promise<boolean> {
  try {
    const response = await call(key, '/usage');

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Saves a document, publishing it in the same call when asked.
 *
 * One request either way: `?share=link` is how the API has always done it, which is why the
 * extension needs no endpoint of its own and no second round trip to get a link back.
 */
export async function saveDocument(
  key: string,
  name: string,
  markdown: string,
  share: boolean
): Promise<Saved> {
  const query = new URLSearchParams({ name });

  if (share) {
    query.set('share', 'link');
  }

  const response = await call(key, `/documents?${query}`, {
    method: 'POST',
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
    body: markdown,
  });

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(failure?.error ?? `HTTP ${response.status}`);
  }

  return (await response.json()) as Saved;
}
