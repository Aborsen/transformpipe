import type { Context } from 'hono';
import { currentUser, selfOrigin } from './auth.js';
import { ownerOfKey } from './keys.js';
import { ownerOfAccessToken } from './oauth.js';

/*
 * Who is calling, across all three ways of arriving.
 *
 * One resolver, because the alternative is three: the API had a key-or-cookie check of its own, the
 * MCP endpoint needs a token check, and a second copy of "who is this" is how the two come to
 * disagree about whose documents to show.
 *
 * The `via` label is not decoration — it keys the rate limiter, so a runaway assistant cannot spend
 * the allowance of the same person's browser or their build server.
 */

export type Via = 'key' | 'oauth' | 'session';

export interface Caller {
  id: string;
  email: string | null;
  via: Via;
  /** OAuth callers carry what they were granted; the other two can do everything the owner can. */
  scope: string | null;
}

/**
 * Whether a call that was authenticated by cookie actually came from us.
 *
 * A bearer token is presented deliberately: something had to go and fetch it. A cookie is sent by
 * the browser whether or not the page meant to send it, so a cookie-authenticated request from
 * somewhere else is a request nobody made — `tp_delete_document`, driven by a page the account
 * holder happened to open.
 *
 * The same check `/api/oauth/approve` makes, and its comment says the rest: without it the defence
 * is the session cookie's SameSite attribute, which is somebody else's default to change. Today
 * SameSite=Lax does hold this shut, which is why this is a second lock rather than a fix.
 *
 * Absent headers pass. A browser sends Origin on every cross-site POST and Sec-Fetch-Site on every
 * request it makes; a caller that sends neither is not a browser, and a caller that is not a
 * browser has no cookie of ours to be driven with.
 */
export function cameFromUs(c: Context): boolean {
  const origin = c.req.header('origin');
  const site = c.req.header('sec-fetch-site');

  if (origin && origin !== 'null' && origin !== selfOrigin(c)) {
    return false;
  }

  return !site || site === 'same-origin' || site === 'none';
}

const KEY_PREFIX = 'tp_live_';

export async function resolveCaller(c: Context): Promise<Caller | null> {
  const header = c.req.header('authorization') ?? '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  // Ours and unambiguous: it carries our prefix and is answered from our own table.
  if (bearer.startsWith(KEY_PREFIX)) {
    const owner = await ownerOfKey(bearer);

    return owner
      ? { id: owner.id, email: owner.email, via: 'key', scope: null }
      : null;
  }

  if (bearer) {
    try {
      const grant = await ownerOfAccessToken(bearer);

      if (grant) {
        return {
          id: grant.userId,
          email: grant.email,
          via: 'oauth',
          scope: grant.scope,
        };
      }
    } catch {
      /*
       * No OAuth tables on this deployment yet — a deploy can be ahead of `npm run db:init`. A
       * missing table must not be able to break the two ways of signing in that predate it.
       */
    }

    /*
     * A bearer token was presented and it is not one of ours. Answering "anonymous, then maybe your
     * cookie" from here is the kind of thing nobody can debug from the other end.
     */
    return null;
  }

  // A network hop to the auth service, so it goes last.
  const user = await currentUser(c);

  return user
    ? { id: user.id, email: user.email, via: 'session', scope: null }
    : null;
}

/** Whether this caller may change anything. Only an OAuth grant can be narrower than the owner. */
export const mayWrite = (caller: Caller) =>
  caller.via !== 'oauth' || (caller.scope ?? '').includes('documents:write');
