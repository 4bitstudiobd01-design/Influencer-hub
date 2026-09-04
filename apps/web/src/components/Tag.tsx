import clsx from 'clsx';

const TONES = {
  forest: 'bg-forest/10 text-forest',
  amber: 'bg-amber/15 text-amber',
  decline: 'bg-decline/10 text-decline',
  neutral: 'bg-black/5 text-black/60',
  charcoal: 'bg-charcoal/10 text-charcoal',
} as const;

export function Tag({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-medium capitalize',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
