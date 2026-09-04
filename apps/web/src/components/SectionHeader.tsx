export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl text-black/90">{title}</h1>
        {description && <p className="mt-1 text-sm text-black/45">{description}</p>}
      </div>
      {action}
    </div>
  );
}
