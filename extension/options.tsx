import { Check, Loader2, LogIn } from 'lucide-react';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Logo } from '@/components/Logo';
import { useT } from '@/lib/i18n/context';
import { Button } from '@/ui/components/Button';
import { Typography } from '@/ui/components/Typography';
import { signedIn } from './lib/account';
import { signIn, signOut } from './lib/auth';
import { Providers } from './lib/Providers';
import '@/index.css';

/*
 * The settings page, which now exists to hold no string at all.
 *
 * It asked for an API key first. That worked and asked a person to go and find one — open the site,
 * open the account page, create a key, copy it, come back, paste it, and hope they copied the whole
 * thing. This is the same sign-in the site uses: a window opens on the approval screen, and
 * somebody already signed in presses one button.
 *
 * What is granted is listed on the account page beside every other connection and revoked there in
 * the same way, which is the other half of why this shape is better than a pasted secret: the
 * person can see it exists.
 */
function Options() {
  const t = useT();
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refused, setRefused] = useState(false);

  useEffect(() => {
    void signedIn().then(setConnected);
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 bg-surface-page px-6 py-10">
      <Logo className="h-6" />

      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="text-xl">
          {t('ext.account')}
        </Typography>
        <Typography variant="p" textColor="secondary" className="text-sm">
          {t('ext.signin.hint')}
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
              await signOut();
              setConnected(false);
            }}
          >
            {t('ext.key.disconnect')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Button
            className="w-fit"
            disabled={busy}
            leftSlot={busy ? <Loader2 className="animate-spin" /> : <LogIn />}
            onClick={async () => {
              setBusy(true);
              setRefused(false);

              try {
                const done = await signIn();

                setConnected(done);
                setRefused(!done);
              } catch {
                setRefused(true);
              } finally {
                setBusy(false);
              }
            }}
          >
            {t('ext.signin')}
          </Button>

          {refused && (
            <Typography variant="p" textColor="destructive" className="text-sm">
              {t('ext.signin.refused')}
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
