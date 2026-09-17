import { ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';
import { useT } from '@/lib/i18n/context';
import { ISSUES_URL } from '@/lib/pages';
import { Button } from '@/ui/components/Button';
import {
  InputGroup,
  InputGroupInput,
} from '@/ui/components/InputGroup';
import { TextArea } from '@/ui/components/TextArea';
import { Typography } from '@/ui/components/Typography';

/**
 * Two fields and a button, at the top of the support page.
 *
 * The issue itself is still GitHub's — it has to be: a repository's issues are where the answers
 * are, where somebody else can find the same problem already answered, and where a fix links back
 * to the report. What was missing was the step before it, which is the one people give up on: a
 * blank "New issue" page asks somebody to invent a format for their own bug.
 *
 * So the form is here and the submission is there. Pressing the button opens GitHub's new-issue
 * page with the title and the body already written from what was typed — nothing is sent from this
 * page, and the issue exists only once somebody presses Submit on GitHub, where they can see
 * exactly what will be public.
 *
 * Embedding the real form was the first idea and it is not possible: github.com answers with
 * `x-frame-options: deny` and `frame-ancestors 'none'`, which is the correct answer to a site
 * wanting somebody's session in an iframe.
 */
export function IssueForm() {
  const t = useT();
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');

  const open = () => {
    const query = new URLSearchParams();

    if (summary.trim()) {
      query.set('title', summary.trim());
    }

    if (details.trim()) {
      query.set('body', details.trim());
    }

    const address = query.toString()
      ? `${ISSUES_URL}/new?${query}`
      : `${ISSUES_URL}/new`;

    window.open(address, '_blank', 'noreferrer,noopener');
  };

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-card p-5">
      <div className="flex flex-col gap-1">
        <Typography variant="h2" weight="semibold" textColor="primary" className="text-base">
          {t('support.form.title')}
        </Typography>
        <Typography variant="p" textColor="secondary" className="text-sm">
          {t('support.form.blurb')}
        </Typography>
      </div>

      <InputGroup>
        <InputGroupInput
          value={summary}
          aria-label={t('support.form.summary')}
          placeholder={t('support.form.summary.placeholder')}
          onChange={(event) => setSummary(event.target.value)}
        />
      </InputGroup>

      <TextArea
        value={details}
        rows={5}
        rounded="lg"
        aria-label={t('support.form.details')}
        placeholder={t('support.form.details.placeholder')}
        onChange={(event) => setDetails(event.target.value)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          leftSlot={<Github />}
          rightSlot={<ExternalLink />}
          onClick={open}
        >
          {t('support.form.open')}
        </Button>

        <Typography variant="span" textColor="light" className="text-xs">
          {t('support.form.note')}
        </Typography>
      </div>
    </section>
  );
}
