import clsx from 'clsx';

export function Card({
  children,
  className,
  title,
  description,
  action,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={clsx(
        'rounded-card bg-white p-5 shadow-card transition-shadow',
        hover && 'hover:shadow-card-hover',
        className,
      )}
    >
      {title && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-black/80">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-black/40">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
