import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import type { Context } from 'hono';

/*
 * Addresses: the ones this server may call, and the one calling it.
 *
 * Two features hand a stranger's URL to our own `fetch`: a client's metadata document (`cimd.ts`)
 * and a webhook (`webhooks.ts`). Both are server-side request forgery unless the address is checked,
 * and both are checked here rather than each keeping its own idea of what counts as private —
 * because that is the shape the bug took the first time: the OAuth side had the whole check written
 * and the webhook side had `/^https:\/\//`.
 *
 * It was written for `cimd.ts` and lived there; nothing about it was ever specific to OAuth.
 *
 * `clientAddress` is the other direction and lives here for the same reason: every rate limiter
 * needs it and each one that writes its own gets it subtly wrong.
 */

/**
 * The address the platform actually saw, for counting a caller who has no account.
 *
 * The LAST entry of `x-forwarded-for`, not the first. Everything before it is what the caller
 * claimed — a header they wrote themselves — and the platform appends what it observed. Keying a
 * rate limiter on the first entry means keying it on a value the caller chooses, which is a
 * counter anybody can reset by typing a different number.
 *
 * `x-real-ip` first, because on this platform it is set by the proxy and not forwardable.
 */
export function clientAddress(c: Context): string {
  return (
    c.req.header('x-real-ip')?.trim() ||
    c.req.header('x-forwarded-for')?.split(',').pop()?.trim() ||
    'unknown'
  );
}

/** Addresses no client is ever hosted at, and several that an attacker would like us to fetch. */
function privateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const flat = ip.toLowerCase();

    return (
      flat === '::1' ||
      flat === '::' ||
      flat.startsWith('fe80:') ||
      // Unique local addresses, fc00::/7.
      /^f[cd][0-9a-f]{2}:/.test(flat) ||
      // IPv4 wearing an IPv6 hat: ::ffff:169.254.169.254 must not get through.
      flat.startsWith('::ffff:')
    );
  }

  const parts = ip.split('.').map(Number);

  if (parts.length !== 4 || parts.some((one) => Number.isNaN(one))) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

/**
 * Where the hostname actually points, refused if that is inside.
 *
 * The check a URL string cannot make: `metadata.example.com` is a public name and may resolve to
 * 169.254.169.254. It is not proof against a name that answers differently on the second lookup —
 * the fetch resolves again — but it stops the plain attack, and the request carries no credential
 * of ours to steal even if one got through.
 */
export async function publicHost(hostname: string): Promise<boolean> {
  const bare = hostname.replace(/^\[|\]$/g, '');

  if (isIP(bare)) {
    // An address rather than a name. No real client or webhook is published at one, and it is the
    // shape every SSRF attempt takes, so it is refused whether it is private or not.
    return false;
  }

  if (/(^|\.)(localhost|local|internal|localdomain)$/i.test(bare)) {
    return false;
  }

  try {
    const found = await lookup(bare, { all: true });

    return found.length > 0 && found.every((one) => !privateAddress(one.address));
  } catch {
    return false;
  }
}
