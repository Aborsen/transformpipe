import { diffLines } from 'diff';
import { useMemo } from 'react';
import { cn } from '@/ui/lib/utils';

interface VersionDiffProps {
  oldText: string;
  oldLabel: string;
  newText: string;
  newLabel: string;
  className?: string;
}

/**
 * A line-level diff between two versions of the same document, computed in the browser.
 *
 * Both documents are already in hand by the time this renders — the same `GET /api/documents/:id`
 * every open uses — so there is nothing here for a server to compute, and one dependency (`diff`)
 * beats a second implementation of it.
 */
export function VersionDiff({
  oldText,
  oldLabel,
  newText,
  newLabel,
  className,
}: VersionDiffProps) {
  const parts = useMemo(() => diffLines(oldText, newText), [oldText, newText]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between text-ink-secondary text-xs">
        <span>− {oldLabel}</span>
        <span>+ {newLabel}</span>
      </div>

      <pre
        className={cn(
          'overflow-auto rounded-md border border-stroke bg-surface-card2 p-4',
          'font-mono text-ink-body text-xs leading-relaxed'
        )}
      >
        <code>
          {parts.map((part, index) => (
            <div
              key={index}
              className={cn(
                'whitespace-pre-wrap',
                part.added && 'bg-fb-green/15 text-fb-green',
                part.removed && 'bg-fb-red/15 text-fb-red-text'
              )}
            >
              {part.value
                .replace(/\n$/, '')
                .split('\n')
                .map((line, lineIndex) => (
                  <div key={lineIndex}>
                    {part.added ? '+ ' : part.removed ? '− ' : '  '}
                    {line}
                  </div>
                ))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
