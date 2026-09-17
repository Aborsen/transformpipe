import { Check, LogIn, LogOut, Settings, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n/context';
import { LOCALE_NAMES, LOCALES } from '@/lib/i18n/locales';
import { LocaleFlag } from '@/components/LocaleFlag';
import { Button } from '@/ui/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/components/DropdownMenu';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';
import { whoAmI } from './account';
import { signIn, signOut } from './auth';
import { useChosenLocale } from './Providers';

/**
 * Who you are and what language this is in, under one icon in the corner.
 *
 * Both were missing and both are the same kind of thing: settings a person changes once and then
 * wants to find again in the place such things live. A panel this size has one such place, and it
 * is the bottom left corner — which is where it is on the site, in the desktop applications people
 * have open beside this, and in the browser itself.
 *
 * Language is stored rather than guessed from here on. The guess — the browser's own preference —
 * is right often enough to be the default and wrong often enough that somebody has to be able to
 * say otherwise, and the site has had that switcher since it had a second language.
 */
export function AccountMenu({
  connected,
  onChanged,
}: {
  connected: boolean;
  onChanged: () => void;
}) {
  const t = useT();
  const { locale, setLocale } = useChosenLocale();
  const [who, setWho] = useState<string | null>(null);

  useEffect(() => {
    if (!connected) {
      setWho(null);

      return;
    }

    void whoAmI().then(setWho);
  }, [connected]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="transparent"
          size="sm"
          aria-label={t('ext.account')}
          title={t('ext.account')}
          leftSlot={
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-full',
                connected
                  ? 'bg-brand-primary text-white'
                  : 'border border-stroke text-ink-inactive'
              )}
            >
              <UserRound className="size-3" />
            </span>
          }
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" side="top" className="w-60">
        {/* Whose account, before what can be done with it. */}
        <div className="px-2 py-1.5">
          <Typography
            variant="span"
            textColor={connected ? 'primary' : 'secondary'}
            className="block truncate text-xs"
          >
            {connected ? (who ?? t('ext.key.connected')) : t('ext.signedout')}
          </Typography>
        </div>

        <DropdownMenuSeparator />

        {connected ? (
          <DropdownMenuItem
            onSelect={async () => {
              await signOut();
              onChanged();
            }}
          >
            <LogOut className="size-4" />
            {t('ext.signout')}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={async () => {
              await signIn();
              onChanged();
            }}
          >
            <LogIn className="size-4" />
            {t('ext.signin')}
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onSelect={() => chrome.runtime.openOptionsPage()}>
          <Settings className="size-4" />
          {t('ext.settings')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Each language named in itself, which is the only name somebody lost in one recognises. */}
        {LOCALES.map((one) => (
          <DropdownMenuItem key={one} onSelect={() => setLocale(one)}>
            <LocaleFlag locale={one} className="h-3 w-4 rounded-[2px]" />
            {LOCALE_NAMES[one]}
            {one === locale && (
              <Check className="ml-auto size-4 text-brand-tertiary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
