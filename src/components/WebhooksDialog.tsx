import { Check, Copy, Eye, EyeOff, Plus, Trash2, Webhook } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, type WebhookRow } from '@/lib/api';
import { formatRelative } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { Hint } from './Hint';
import { Button } from '@/ui/components/Button';
import { InlineCode } from '@/ui/components/Code';
import { IconButton } from '@/ui/components/IconButton';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ui/components/InputGroup';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/ui/components/Modal';
import { Spinner } from '@/ui/components/Spinner';
import { toast } from '@/ui/components/Toast';
import { Typography } from '@/ui/components/Typography';

interface WebhooksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * List, create, revoke — the same shape as ApiKeysDialog, with one difference the underlying
 * secret forces on it: an API key is shown once because it authenticates *to* us, but a webhook
 * secret authenticates deliveries *from* us, so the account owner may legitimately need to see it
 * again to configure or debug a receiver. `reveal` asks the server for it again rather than
 * keeping it in memory after the dialog closes.
 */
export function WebhooksDialog({ open, onOpenChange }: WebhooksDialogProps) {
  const t = useT();
  const { locale } = useI18n();
  const times = INTL_LOCALES[locale];
  const [hooks, setHooks] = useState<WebhookRow[]>([]);
  const [url, setUrl] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fresh, setFresh] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFresh(null);
      setUrl('');
      setRevealed({});
      return;
    }

    setIsLoading(true);
    api
      .listWebhooks()
      .then(setHooks)
      .catch((cause: Error) => toast.error(cause.message))
      .finally(() => setIsLoading(false));
  }, [open]);

  const create = async () => {
    if (!/^https:\/\//.test(url.trim())) {
      toast.error(t('dialog.webhooks.url.error'));
      return;
    }

    setIsBusy(true);

    try {
      const created = await api.createWebhook(url.trim());

      setFresh(created.secret);
      setHooks((current) => [created.webhook, ...current]);
      setUrl('');
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : t('dialog.webhooks.create.error')
      );
    } finally {
      setIsBusy(false);
    }
  };

  const revoke = async (hook: WebhookRow) => {
    setHooks((current) => current.filter((entry) => entry.id !== hook.id));

    await api.revokeWebhook(hook.id).catch((cause: Error) => {
      toast.error(cause.message);

      return api.listWebhooks().then(setHooks);
    });
  };

  const reveal = async (hook: WebhookRow) => {
    if (revealed[hook.id]) {
      setRevealed((current) => {
        const { [hook.id]: _drop, ...rest } = current;
        return rest;
      });
      return;
    }

    try {
      const { secret } = await api.revealWebhookSecret(hook.id);
      setRevealed((current) => ({ ...current, [hook.id]: secret }));
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : t('dialog.webhooks.reveal.error'));
    }
  };

  const copy = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error(t('common.clipboard.error'));
    }
  };

  const status = (hook: WebhookRow) => {
    if (!hook.last_attempted_at) {
      return t('dialog.webhooks.status.never');
    }

    const when = formatRelative(new Date(hook.last_attempted_at).getTime(), times);

    return hook.last_status && hook.last_status < 300
      ? t('dialog.webhooks.status.ok', { when })
      : t('dialog.webhooks.status.failed', { when });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="h-[30rem] max-w-xl">
        <ModalHeader>
          <ModalTitle>{t('dialog.webhooks.title')}</ModalTitle>
          <Typography variant="span" textColor="secondary" className="text-xs">
            {t('dialog.webhooks.blurb')}
          </Typography>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <InputGroup size="sm">
              <InputGroupAddon>
                <Webhook className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                value={url}
                placeholder={t('dialog.webhooks.url.placeholder')}
                aria-label={t('dialog.webhooks.url.label')}
                onChange={(event) => setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void create();
                  }
                }}
              />
            </InputGroup>

            <Button
              variant="secondary"
              size="sm"
              leftSlot={<Plus />}
              disabled={isBusy || url.trim().length === 0}
              onClick={() => void create()}
            >
              {t('dialog.webhooks.create')}
            </Button>
          </div>

          {fresh && (
            <div className="flex shrink-0 flex-col gap-2 rounded-lg border border-brand-primary/40 bg-surface-accent p-3">
              <Typography variant="span" weight="semibold" textColor="primary">
                {t('dialog.webhooks.fresh')}
              </Typography>

              <div className="flex items-center gap-2">
                <InlineCode className="min-w-0 flex-1 truncate bg-surface-card px-2 py-1.5 text-ink-body">
                  {fresh}
                </InlineCode>
                <Button
                  variant="secondary"
                  size="sm"
                  leftSlot={<Copy />}
                  onClick={() => void copy(fresh, 'fresh')}
                >
                  {copiedId === 'fresh' ? t('common.copied') : t('common.copy')}
                </Button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 py-2">
              <Spinner />
              <Typography variant="span" textColor="secondary">
                {t('common.loading')}
              </Typography>
            </div>
          )}

          {!isLoading && hooks.length === 0 && (
            <Typography variant="span" textColor="light" className="text-xs">
              {t('dialog.webhooks.empty')}
            </Typography>
          )}

          {hooks.length > 0 && (
            <ul className="flex min-h-0 flex-col divide-y divide-stroke overflow-y-auto rounded-md border border-stroke">
              {hooks.map((hook) => (
                <li key={hook.id} className="flex shrink-0 flex-col gap-2 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <Typography
                        variant="span"
                        weight="medium"
                        textColor="primary"
                        className="truncate"
                      >
                        {hook.url}
                      </Typography>
                      <Typography variant="span" textColor="secondary" className="text-xs">
                        {status(hook)}
                      </Typography>
                    </div>

                    <span className="flex items-center gap-1">
                      <Hint content={t('dialog.webhooks.reveal')}>
                        <IconButton
                          variant="tertiary"
                          size="sm"
                          aria-label={t('dialog.webhooks.reveal.label', { url: hook.url })}
                          onClick={() => void reveal(hook)}
                        >
                          {revealed[hook.id] ? <EyeOff /> : <Eye />}
                        </IconButton>
                      </Hint>

                      <Hint content={t('dialog.webhooks.revoke')}>
                        <IconButton
                          variant="destructiveTertiary"
                          size="sm"
                          aria-label={t('dialog.webhooks.revoke.label', { url: hook.url })}
                          onClick={() => void revoke(hook)}
                        >
                          <Trash2 />
                        </IconButton>
                      </Hint>
                    </span>
                  </div>

                  {revealed[hook.id] && (
                    <div className="flex items-center gap-2">
                      <InlineCode className="min-w-0 flex-1 truncate bg-surface-card2 px-2 py-1.5 text-ink-body">
                        {revealed[hook.id]}
                      </InlineCode>
                      <IconButton
                        variant="tertiary"
                        size="sm"
                        aria-label={t('common.copy')}
                        onClick={() => void copy(revealed[hook.id], hook.id)}
                      >
                        {copiedId === hook.id ? <Check /> : <Copy />}
                      </IconButton>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
