/*
 * The service worker, and it is deliberately the smallest one that earns its keep.
 *
 * Two things it is for. The app is installable — Chrome asks for a worker with a fetch handler
 * before it offers that — and the conversions genuinely run in the browser, so an installed
 * TransformPipe with no network should still open and still convert. That is the whole promise;
 * anything else it could cache is somebody else's data or a page that changes without us.
 *
 * What it will not do, because a service worker that gets these wrong is worse than none:
 *
 *   - `/api/**` is never touched. An answer about somebody's account has no business in a cache,
 *     and a stale one is a lie with a long tail.
 *   - `/s/**` and `/open/**` are never cached: a shared document can be revoked, and a page that
 *     outlives its revocation is exactly the failure the share dialog promises will not happen.
 *   - HTML is network-first. The bundle's names carry hashes, so a cached page that outlives a
 *     deploy points at files that no longer exist — the white screen every hand-rolled worker
 *     eventually ships. The cache is the fallback, not the source.
 *
 * What it does cache: `/assets/**`, which is content-hashed and therefore safe forever, and the
 * fonts and icons, which change about twice a year and are fine slightly stale.
 *
 * Every cache name carries VERSION. Bump it and the old one is deleted on the next activation,
 * which is the manual kill switch as well: a worker shipped with a bug is replaced by bumping this
 * and deploying, and `clients.claim()` means it takes over without waiting for every tab to close.
 */
const VERSION = 'v1';
const SHELL = `tp-shell-${VERSION}`;
const ASSETS = `tp-assets-${VERSION}`;

/* The page an install opens on, kept so a cold start with no network has something to show. */
const START = '/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);

      /* One request, and a failure is not fatal: an install that cannot reach the network still
       * produces a worker, and the first successful navigation fills this in. */
      await cache.add(new Request(START, { cache: 'reload' })).catch(() => undefined);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([SHELL, ASSETS]);

      await Promise.all(
        (await caches.keys())
          .filter((name) => name.startsWith('tp-') && !keep.has(name))
          .map((name) => caches.delete(name))
      );

      await self.clients.claim();
    })()
  );
});

/** Everything this worker refuses to have an opinion about. */
function mine(url, request) {
  if (url.origin !== self.location.origin) {
    return false;
  }

  if (request.method !== 'GET') {
    return false;
  }

  return !/^\/(api|s|open|report)(\/|$)/.test(url.pathname);
}

const hashed = (pathname) =>
  pathname.startsWith('/assets/') ||
  pathname.startsWith('/fonts/') ||
  /^\/(icon|favicon|apple-touch)/.test(pathname);

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (!mine(url, event.request)) {
    return;
  }

  /* Hashed or good-as-hashed: answer from the cache and fill it on the way past. */
  if (hashed(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSETS);
        const hit = await cache.match(event.request);

        if (hit) {
          return hit;
        }

        const response = await fetch(event.request);

        if (response.ok) {
          void cache.put(event.request, response.clone());
        }

        return response;
      })()
    );

    return;
  }

  if (event.request.mode !== 'navigate') {
    return;
  }

  /* A page: the network decides, and the cache catches somebody who is offline. */
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);

        if (response.ok) {
          const cache = await caches.open(SHELL);

          void cache.put(START, response.clone());
        }

        return response;
      } catch (offline) {
        const cached =
          (await caches.match(event.request)) ?? (await caches.match(START));

        if (cached) {
          return cached;
        }

        throw offline;
      }
    })()
  );
});
