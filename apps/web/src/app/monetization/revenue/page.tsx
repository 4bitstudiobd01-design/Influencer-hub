'use client';

import { AlertCircle } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useMonetizationOverview } from '@/lib/api/hooks';
import { Card } from '@/components/Card';
import { PlatformBadge } from '@/components/PlatformBadge';
import { SectionHeader } from '@/components/SectionHeader';
import { DashboardSkeleton } from '@/components/Skeleton';

export default function PlatformRevenuePage() {
  const { data, isLoading, isError } = useMonetizationOverview();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <p className="text-sm text-decline">Couldn&apos;t load revenue data.</p>;

  const total = data.revenueBySource.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="Platform Revenue" description="Every source of income, one ledger" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Revenue by Source" className="lg:col-span-2" hover>
          <ul className="space-y-3">
            {data.revenueBySource.map((source, i) => {
              const pct = (source.amount / total) * 100;
              return (
                <li key={i}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <PlatformBadge platform={source.platform} size="sm" />
                      <span className="text-black/45">{source.sourceLabel}</span>
                    </div>
                    <span className="font-semibold text-forest">${source.amount.toLocaleString()}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-pill bg-black/5">
                    <div className="h-full rounded-pill bg-forest" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="Total Revenue" hover className="flex flex-col justify-center">
          <p className="text-3xl font-semibold text-black/90">${total.toLocaleString()}</p>
          <p className="mt-1 text-sm text-black/45">Across {data.revenueBySource.length} active sources</p>
        </Card>
      </div>

      <Card title="Revenue Trend" hover>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.revenueTrend}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5A524" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F5A524" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, 'Earnings']}
              />
              <Area type="monotone" dataKey="earnings" stroke="#F5A524" strokeWidth={2.5} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="flex items-start gap-3 border border-amber/30 bg-amber/5">
        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-amber" />
        <p className="text-sm text-black/70">
          <strong>Note:</strong> YouTube ad-revenue data requires Content Owner (CMS) access via
          the YouTube Analytics API — a standard channel connection only shows view/engagement
          stats, not monetary metrics. Revenue shown here for a single-channel account is
          manually entered or CSV-imported from YouTube Studio.
        </p>
      </Card>
    </div>
  );
}
