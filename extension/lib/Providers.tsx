import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { I18nProvider } from '@/lib/i18n/context';
import { LOCALES, type Locale } from '@/lib/i18n/locales';
import { ThemeProvider } from '@/lib/theme';

/**
 * The app's own providers, with the two things an extension has no version of replaced.
 *
 * The site takes its language from the address and changes it by navigating; there is no address
 * here, so the language is guessed from the browser the first time and stored the moment somebody
 * says otherwise. `I18nProvider` still does the loading and the lookup — only the question of which
 * locale it is handed is answered differently — so the extension reads from the same catalogue as
 * every page of the site.
 *
 * `ThemeProvider` is unchanged, which is the point of importing it: somebody who reads the site in
 * light does not get a dark panel out of its extension.
 */
const KEY = 'tp.locale';

interface Chosen {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<Chosen | null>(null);

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
  const [locale, setLocaleState] = useState<Locale>(browserLocale);

  useEffect(() => {
    void chrome.storage.local.get(KEY).then((stored) => {
      const kept = stored[KEY] as Locale | undefined;

      if (kept && LOCALES.includes(kept)) {
        setLocaleState(kept);
      }
    });
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    void chrome.storage.local.set({ [KEY]: next });
  }, []);

  const chosen = useMemo<Chosen>(
    () => ({ locale, setLocale }),
    [locale, setLocale]
  );

  return (
    <ThemeProvider>
      <LocaleContext.Provider value={chosen}>
        <I18nProvider locale={locale} onNavigate={() => {}}>
          {children}
        </I18nProvider>
      </LocaleContext.Provider>
    </ThemeProvider>
  );
}

/** The extension's own language switch — `useI18n().setLocale` navigates, and there is nowhere to go. */
export function useChosenLocale(): Chosen {
  const chosen = useContext(LocaleContext);

  if (!chosen) {
    throw new Error('useChosenLocale outside Providers');
  }

  return chosen;
}
