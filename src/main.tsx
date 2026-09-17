import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// biome-ignore lint/style/noNonNullAssertion: root element always exists
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/*
 * The service worker, in production and after the page is up.
 *
 * It is what makes this installable — Chrome asks for a worker with a fetch handler before it
 * offers to install anything — and what lets an installed copy open and convert with no network,
 * which the conversions were always able to do. See `public/sw.js` for the narrow set of things it
 * is allowed to cache, and for why an account's answers are not among them.
 *
 * Not in development: a worker serving a cached bundle over Vite's own is a morning wasted, and
 * there is nothing to install locally anyway. A registration that fails is left alone — the app
 * works without it, which is the point of registering it late.
 */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
