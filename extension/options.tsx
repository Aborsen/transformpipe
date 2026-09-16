import { Check, KeyRound, Loader2 } from 'lucide-react';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Logo } from '@/components/Logo';
import { useT } from '@/lib/i18n/context';
import { Button } from '@/ui/components/Button';
import { Input } from '@/ui/components/Input';
import { Typography } from '@/ui/components/Typography';
import {
  checkKey,
  forgetKey,
  grantOrigin,
  storedKey,
} from './lib/account';
import { Providers } from './lib/Providers';
import '@/index.css';

/*
 * The settings page, which exists to hold one string.
 *
 * An API key rather than a sign-in: the extension has no session to borrow — its pages are their
 * own origin — and a key is the credential this product already issues, shows once, stores as a
 * hash and lets somebody revoke from the account page. A leaked key is revocable; a borrowed cookie
 * is not.
 *
 * The key is checked before it is kept. Somebody who pastes half a key would otherwise find out
 * when they press Save on a page they wanted, which is the worst moment to learn it.
 */
function Options() {
  const t = useT();
  const [key, setKey] = useState('');
  const [connected, setConnected] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [refused, setRefused] = useState(false);

  useEffect(() => {
    void storedKey().then((found) => setConnected(Boolean(found)));
  }, []);

  const connect = async () => {
    setBusy(true);
    setRefused(false);

    try {
      const granted = await grantOrigin();

      if (!granted) {
        setRefused(true);
        return;
      }

      const trimmed = key.trim();

      if (!(await checkKey(trimmed))) {
        setRefused(true);
        return;
      }

      await chrome.storage.local.set({ 'tp.key': trimmed });
      setKey('');
      setConnected(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 bg-surface-page px-6 py-10">
      <Logo className="h-6" />

      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="text-xl">
          {t('ext.account')}
        </Typography>
        <Typography variant="p" textColor="secondary" className="text-sm">
          {t('ext.key.hint')}
        </Typography>
      </div>

      {connected ? (
        <div className="flex items-center gap-3 rounded-xl border border-stroke bg-surface-card p-4">
          <Check className="size-4 shrink-0 text-brand-tertiary" />
          <Typography variant="span" className="text-sm">
            {t('ext.key.connected')}
          </Typography>

          <Button
            variant="secondary"
            size="sm"
            className="ml-auto"
            onClick={async () => {
              await forgetKey();
              setConnected(false);
            }}
          >
            {t('ext.key.disconnect')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-stroke bg-surface-card px-3">
            <KeyRound className="size-4 shrink-0 text-ink-inactive" />
            <Input
              value={key}
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder={t('ext.key.placeholder')}
              aria-label={t('ext.account')}
              onChange={(event) => setKey(event.target.value)}
              className="h-11"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button disabled={!key.trim() || busy} onClick={() => void connect()}>
              {busy && <Loader2 className="animate-spin" />}
              {t('ext.key.connect')}
            </Button>

            <a
              href="https://transformpipe.com/docs#account"
              target="_blank"
              rel="noreferrer noopener"
              className="text-brand-tertiary text-sm underline-offset-2 hover:underline"
            >
              {t('ext.key.where')}
            </a>
          </div>

          {refused && (
            <Typography variant="p" textColor="destructive" className="text-sm">
              {t('ext.key.refused')}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <Options />
    </Providers>
  </StrictMode>
);
