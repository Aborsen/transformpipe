import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PageSurface } from './PageSurface';
import { Providers } from './lib/Providers';
import '@/index.css';

/** The panel under the toolbar button: one page, converted, and gone when it loses focus. */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <PageSurface />
    </Providers>
  </StrictMode>
);
