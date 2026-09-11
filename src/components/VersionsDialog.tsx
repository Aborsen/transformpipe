import { GitCompare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { formatDateTime } from '@/lib/format';
import { Button } from '@/ui/components/Button';
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
import { VersionDiff } from './VersionDiff';

interface VersionEntry {
  id: string;
  name: string;
  created_at: string;
}

interface VersionsDialogProps {
  /** Any document in the chain — the server walks it in both directions from here. */
  documentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The chain a document belongs to, oldest first, with a diff against the one before for any entry
 * that has one.
 *
 * One dialog rather than a popover plus a separate diff view: a chain is short by design — this is
 * for versions somebody deliberately linked with `replaces`, not automatic history — so the whole
 * of it reads on one screen.
 */
export function VersionsDialog({
  documentId,
  open,
  onOpenChange,
}: VersionsDialogProps) {
  const t = useT();
  const { locale } = useI18n();
  const numbers = INTL_LOCALES[locale];
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comparing, setComparing] = useState<{
    older: VersionEntry;
    newer: VersionEntry;
  } | null>(null);
  const [diff, setDiff] = useState<{ oldText: string; newText: string } | null>(
    null
  );
  const [isDiffing, setIsDiffing] = useState(false);

  useEffect(() => {
    if (!open || !documentId) {
      setComparing(null);
      setDiff(null);
      return;
    }

    setIsLoading(true);
    api
      .documentVersions(documentId)
      .then((result) => setVersions(result.versions))
      .catch((cause: Error) => toast.error(cause.message))
      .finally(() => setIsLoading(false));
  }, [open, documentId]);

  const compare = async (older: VersionEntry, newer: VersionEntry) => {
    setComparing({ older, newer });
    setDiff(null);
    setIsDiffing(true);

    try {
      const [before, after] = await Promise.all([
        api.getDocument(older.id),
        api.getDocument(newer.id),
      ]);

      setDiff({
        oldText: before.markdown ?? '',
        newText: after.markdown ?? '',
      });
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : t('dialog.versions.error')
      );
      setComparing(null);
    } finally {
      setIsDiffing(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="h-[30rem] max-w-2xl">
        <ModalHeader>
          <ModalTitle>{t('dialog.versions.title')}</ModalTitle>
          <Typography variant="span" textColor="secondary" className="text-xs">
            {t('dialog.versions.blurb')}
          </Typography>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          {isLoading && (
            <div className="flex items-center gap-2 py-2">
              <Spinner />
              <Typography variant="span" textColor="secondary">
                {t('common.loading')}
              </Typography>
            </div>
          )}

          {!isLoading && comparing && (
            <div className="flex flex-col gap-2">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  setComparing(null);
                  setDiff(null);
                }}
              >
                {t('dialog.versions.back')}
              </Button>

              {isDiffing && (
                <div className="flex items-center gap-2 py-2">
                  <Spinner />
                  <Typography variant="span" textColor="secondary">
                    {t('common.loading')}
                  </Typography>
                </div>
              )}

              {diff && (
                <VersionDiff
                  oldText={diff.oldText}
                  oldLabel={comparing.older.name}
                  newText={diff.newText}
                  newLabel={comparing.newer.name}
                  className="min-h-0 flex-1"
                />
              )}
            </div>
          )}

          {!isLoading && !comparing && (
            <ul className="flex min-h-0 flex-col divide-y divide-stroke overflow-y-auto rounded-md border border-stroke">
              {versions.map((version, index) => {
                const previous = versions[index - 1];

                return (
                  <li
                    key={version.id}
                    className="flex shrink-0 items-center justify-between gap-3 px-3 py-2"
                  >
                    <div className="flex min-w-0 flex-col">
                      <Typography
                        variant="span"
                        weight="medium"
                        textColor="primary"
                        className="truncate"
                      >
                        {version.name}
                      </Typography>
                      <Typography
                        variant="span"
                        textColor="secondary"
                        className="text-xs"
                      >
                        {formatDateTime(
                          new Date(version.created_at).getTime(),
                          numbers
                        )}
                      </Typography>
                    </div>

                    {previous && (
                      <Button
                        variant="tertiary"
                        size="sm"
                        leftSlot={<GitCompare />}
                        onClick={() => void compare(previous, version)}
                      >
                        {t('dialog.versions.compare')}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
