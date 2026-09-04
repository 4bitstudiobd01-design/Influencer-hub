import type { KpiTrend } from '@creator-hub/types';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatKpiValue } from '@/lib/format';
import { Sparkline } from './Sparkline';
import { Card } from './Card';

export function KpiCard({
  kpi,
  icon,
  tone = 'forest',
  goal,
}: {
  kpi: KpiTrend;
  icon?: React.ReactNode;
  tone?: 'forest' | 'amber' | 'charcoal';
  goal?: { pct: number; label: string };
}) {
  const positive = kpi.changePct >= 0;
  const toneClasses: Record<string, string> = {
    forest: 'bg-forest/10 text-forest',
    amber: 'bg-amber/15 text-amber',
    charcoal: 'bg-charcoal/10 text-charcoal',
  };

  return (
    <Card hover className="group relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-black/40">{kpi.label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-black/90">
            {formatKpiValue(kpi.value, kpi.unit)}
          </p>
          <span
            className={`mt-2 inline-flex items-center gap-0.5 rounded-pill px-1.5 py-0.5 text-xs font-medium ${
              positive ? 'bg-forest/10 text-forest' : 'bg-decline/10 text-decline'
            }`}
          >
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(kpi.changePct)}%
          </span>
        </div>
        {icon && (
          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 opacity-70 transition-opacity group-hover:opacity-100">
        <Sparkline data={kpi.sparkline} positive={positive} />
      </div>

      {goal && (
        <div className="mt-3 border-t border-black/5 pt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-pill bg-black/5">
            <div
              className="h-full rounded-pill bg-forest transition-all"
              style={{ width: `${Math.min(100, goal.pct)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-black/40">{goal.label}</p>
        </div>
      )}
    </Card>
  );
}
