import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export function ComingSoon({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader title={title} />
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-black/10 bg-white/60 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-light/20 to-amber/20 text-forest">
          <Icon size={26} />
        </div>
        <p className="mt-4 max-w-sm text-sm text-black/50">{description}</p>
        <span className="mt-3 rounded-pill bg-black/5 px-3 py-1 text-xs font-medium text-black/40">
          Coming soon
        </span>
      </div>
    </div>
  );
}
