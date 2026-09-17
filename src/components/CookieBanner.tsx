import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NO_CONSENT, useConsent } from '@/lib/consent';
import { useT } from '@/lib/i18n/context';
import { staticPage } from '@/lib/pages';
import { Button } from '@/ui/components/Button';
import { IconButton } from '@/ui/components/IconButton';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/ui/components/Modal';
import { Switch } from '@/ui/components/Switch';
import { Typography } from '@/ui/components/Typography';

/**
 * The question, asked once.
 *
 * It only appears because there is now something to ask about: `index.html` denies every storage
 * category before the tag manager loads, so until somebody answers here nothing is written and the
 * site behaves exactly as the cookies page has always described it.
 *
 * Three answers, all of them one click: accept, refuse, or open the switches. Refusing is as easy as
 * accepting — it is the close button and a button of its own, not a link hidden in a second screen —
 * because a banner where "no" costs more clicks than "yes" is not a question, and the regulators who
 * write about this say so in as many words.
 */
export function CookieBanner() {
  const t = useT();
  const { consent, save, settingsOpen, setSettingsOpen } = useConsent();
  const [analytics, setAnalytics] = useState(false);

  /* Opening the switches shows what is currently allowed, not what was allowed last time it opened. */
  useEffect(() => {
    if (settingsOpen) {
      setAnalytics(consent?.analytics ?? false);
    }
  }, [settingsOpen, consent]);

  return (
    <>
      {!consent && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-stroke bg-surface-card/95 p-5 shadow-lg backdrop-blur sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <Typography variant="h3" className="text-base">
                {t('cookies.banner.title')}
              </Typography>

              <IconButton
                aria-label={t('cookies.banner.reject')}
                variant="transparent"
                size="sm"
                onClick={() => save(NO_CONSENT)}
              >
                <X className="size-4" />
              </IconButton>
            </div>

            <Typography variant="p" textColor="secondary" className="text-sm">
              {t('cookies.banner.body')}{' '}
              <a
                href={staticPage('cookies').path}
                className="text-brand-tertiary underline underline-offset-2"
              >
                {t('cookies.banner.more')}
              </a>
            </Typography>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => save({ analytics: true })}>
                {t('cookies.banner.accept')}
              </Button>
              <Button variant="secondary" onClick={() => save(NO_CONSENT)}>
                {t('cookies.banner.reject')}
              </Button>
              <Button variant="ghost" onClick={() => setSettingsOpen(true)}>
                {t('cookies.banner.customise')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={settingsOpen} onOpenChange={setSettingsOpen}>
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>{t('cookies.settings.title')}</ModalTitle>
          </ModalHeader>

          <ModalBody className="gap-4">
            <Typography variant="p" textColor="secondary" className="text-sm">
              {t('cookies.settings.lede')}
            </Typography>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-stroke p-4">
              <span className="flex min-w-0 flex-col gap-1">
                <Typography variant="span" weight="medium">
                  {t('cookies.settings.necessary')}
                </Typography>
                <Typography variant="span" textColor="secondary" className="text-xs">
                  {t('cookies.settings.necessary.detail')}
                </Typography>
              </span>

              {/* On, and not a control: refusing the session cookie means refusing to sign in. */}
              <Switch
                checked
                disabled
                aria-label={t('cookies.settings.necessary')}
              />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-stroke p-4">
              <span className="flex min-w-0 flex-col gap-1">
                <Typography variant="span" weight="medium">
                  {t('cookies.settings.analytics')}
                </Typography>
                <Typography variant="span" textColor="secondary" className="text-xs">
                  {t('cookies.settings.analytics.detail')}
                </Typography>
              </span>

              <Switch
                checked={analytics}
                onCheckedChange={setAnalytics}
                aria-label={t('cookies.settings.analytics')}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => {
                save(NO_CONSENT);
                setSettingsOpen(false);
              }}
            >
              {t('cookies.banner.reject')}
            </Button>
            <Button
              onClick={() => {
                save({ analytics });
                setSettingsOpen(false);
              }}
            >
              {t('cookies.settings.save')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
