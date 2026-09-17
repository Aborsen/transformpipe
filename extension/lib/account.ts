import { accessToken } from './auth';

/*
 * What the account is for, from here: saving a converted page, and publishing a link to it.
 *
 * Who you are is `auth.ts` — the site's own sign-in, through the OAuth server this product already
 * runs for assistants. This file is only the two calls that spend the token, and it holds no
 * credential of its own: `accessToken()` answers with a live one or with nothing, which is also
 * what a revoked grant looks like from here.
 *
 * Reaching transformpipe.com is an optional permission, asked for at sign-in rather than at
 * install: until somebody signs in, this extension has no reason to talk to us at all — the
 * converting is done in the page — and an origin in the install dialog reads the same to a person
 * whether it is ever used or not.
 */
const ORIGIN = 'https://transformpipe.com';

export interface Saved {
  id: string;
  name: string;
  share: { mode: string; url: string | null };
}

/** What the share endpoint answers with: the audience as it now stands, and who was told. */
export interface Shared {
  mode: string;
  url: string | null;
  emails: string[];
  notified: string[];
}

export async function call(
  token: string,
  path: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(`${ORIGIN}/api/v1${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      authorization: `Bearer ${token}`,
    },
  });
}

/** Whether there is a live grant behind this installation, without spending anything. */
export async function signedIn(): Promise<boolean> {
  return Boolean(await accessToken());
}

/**
 * Whose account this is, from the cheapest endpoint there is.
 *
 * "Signed in" with no name beside it is indistinguishable from signed in as somebody else, which
 * matters most for the person with a work account and a personal one. `/usage` reads two numbers
 * and writes nothing, and now answers with the caller's own address as well.
 */
export async function whoAmI(): Promise<string | null> {
  const token = await accessToken();

  if (!token) {
    return null;
  }

  try {
    const response = await call(token, '/usage');

    if (!response.ok) {
      return null;
    }

    const usage = (await response.json()) as { email?: string | null };

    return usage.email ?? null;
  } catch {
    return null;
  }
}

/**
 * Saves a document, publishing it in the same call when asked.
 *
 * One request either way: `?share=link` is how the API has always done it, which is why the
 * extension needs no endpoint of its own and no second round trip to get a link back.
 */
export async function saveDocument(
  name: string,
  markdown: string,
  share: boolean
): Promise<Saved> {
  const token = await accessToken();

  if (!token) {
    throw new Error('not signed in');
  }

  const query = new URLSearchParams({ name });

  if (share) {
    query.set('share', 'link');
  }

  const response = await call(token, `/documents?${query}`, {
    method: 'POST',
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
    body: markdown,
  });

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    /*
     * The status as well as the sentence: 401 is a grant that has gone, 403 is an account out of
     * room, 413 is a document over the limit, and they are four different things to do next.
     */
    throw new Error(
      failure?.error
        ? `${failure.error} (${response.status})`
        : `HTTP ${response.status}`
    );
  }

  /*
   * `{ document: … }`, not the document. Every `/api/v1` answer names what it is returning, and
   * reading the body as the document itself is why Share copied nothing: `saved.share.url` was
   * `undefined` on an object whose only key was `document`, so the save worked and the link never
   * arrived.
   */
  const body = (await response.json()) as { document: Saved };

  return body.document;
}

