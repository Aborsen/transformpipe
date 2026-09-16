import type { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n/context';
import { LOCALES, type Locale } from '@/lib/i18n/locales';
import { ThemeProvider } from '@/lib/theme';

/**
 * The app's own providers, with the two things an extension has no version of taken out.
 *
 * There is no address here, so the language cannot come from the path the way it does on the site:
 * it comes from the browser's own preference, which is the same question answered by the same
 * catalogue. And `onNavigate` is a no-op — the language switcher that would use it is a header, and
 * an extension has no header.
 *
 * `ThemeProvider` is unchanged, which is the point of importing it: the popup and the viewer follow
 * the same stored preference as the site, so somebody who reads the site in light does not get a
 * dark panel out of its extension.
 */
function browserLocale(): Locale {
  for (const tag of navigator.languages ?? [navigator.language ?? 'en']) {
    const short = tag.slice(0, 2).toLowerCase() as Locale;

    if (LOCALES.includes(short)) {
      return short;
    }
  }

  return 'en';
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider locale={browserLocale()} onNavigate={() => {}}>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
