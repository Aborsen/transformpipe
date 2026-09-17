import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PageSurface } from './PageSurface';
import { Providers } from './lib/Providers';
import '@/index.css';

/**
 * The same panel, in Chrome's side panel, where it stays open while somebody reads.
 *
 * `live` is the whole difference: the surface subscribes to the tabs and reconverts when the page
 * under it changes, which is the thing a popup cannot do because it closes the moment you look
 * away from it.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <PageSurface live />
    </Providers>
  </StrictMode>
);
