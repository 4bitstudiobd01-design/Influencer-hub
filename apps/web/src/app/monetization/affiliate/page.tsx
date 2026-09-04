'use client';

import { useState } from 'react';
import { Copy, Gift } from 'lucide-react';
import { useMonetizationOverview } from '@/lib/api/hooks';
import { KpiCard } from '@/components/KpiCard';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { DashboardSkeleton } from '@/components/Skeleton';
import { ProgressRing } from '@/components/ProgressRing';
import { PlatformBadge } from '@/components/PlatformBadge';
import { Pagination, usePagination } from '@/components/Pagination';

const PAGE_SIZE = 6;

export default function AffiliatePage() {
  const { data, isLoading, isError } = useMonetizationOverview();
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <p className="text-sm text-decline">Couldn&apos;t load affiliate data.</p>;

  const { affiliate } = data;
  const currentTotal = affiliate.referralEarnings.value;
  const nextTierTotal = currentTotal + (affiliate.nextTierAmount ?? 0);
  const ringPct = (currentTotal / nextTierTotal) * 100;
  const paged = usePagination(affiliate.links, PAGE_SIZE, page);

  return (
    <div className="space-y-6">
      <SectionHeader title="Affiliate & Referral Earnings" description="Programs, links, and payouts in one place" />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard kpi={affiliate.referralEarnings} tone="forest" />
        <KpiCard kpi={affiliate.pendingCommissions} tone="amber" />
        <KpiCard kpi={affiliate.linkClicks} tone="charcoal" />
        <Card hover className="flex items-center gap-4">
          <ProgressRing pct={ringPct} size={60} color="#F5A524">
            <Gift size={18} className="text-amber" />
          </ProgressRing>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40">Affiliate Rank</p>
            <p className="text-xl font-semibold text-amber">{affiliate.affiliateRank}</p>
            {affiliate.nextTierAmount && (
              <p className="text-xs text-black/45">${affiliate.nextTierAmount.toLocaleString()} to Diamond</p>
            )}
          </div>
        </Card>
      </section>

      <Card title="Featured Programs" hover>
        <div className="grid gap-3 sm:grid-cols-2">
          {affiliate.programs.map((program) => (
            <div
              key={program.id}
              className="flex items-center gap-3 rounded-xl border border-black/5 p-3 transition-colors hover:border-forest/20 hover:bg-forest/[0.03]"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-forest-light/20 to-amber/25 text-lg">
                🎯
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-black/80">{program.name}</p>
                <PlatformBadge platform={program.platform} size="sm" />
              </div>
              <span className="flex-shrink-0 text-sm font-semibold text-forest">{program.commissionRate}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-black/[0.02] p-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-black/40">
            Have a referral code?
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-forest"
              placeholder="Enter referral code"
            />
            <button className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-white transition hover:bg-charcoal-soft">
              Apply
            </button>
          </div>
        </div>
      </Card>

      <Card title="Link Performance" hover>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-black/40">
              <th className="pb-2 pr-4">Link</th>
              <th className="pb-2 pr-4">Clicks</th>
              <th className="pb-2 pr-4">CVR</th>
              <th className="pb-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((link) => (
              <tr key={link.id} className="border-t border-black/5 hover:bg-black/[0.02]">
                <td className="py-2.5 pr-4">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(link.url);
                      setCopiedId(link.id);
                      setTimeout(() => setCopiedId((c) => (c === link.id ? null : c)), 1500);
                    }}
                    className="inline-flex items-center gap-1.5 text-black/70 hover:text-forest"
                  >
                    <Copy size={12} />
                    {link.url}
                    {copiedId === link.id && <span className="text-xs text-forest">Copied!</span>}
                  </button>
                </td>
                <td className="py-2.5 pr-4 text-black/70">{link.clicks.toLocaleString()}</td>
                <td className="py-2.5 pr-4 text-black/70">{link.cvr}%</td>
                <td className="py-2.5 font-semibold text-forest">${link.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} total={paged.total} start={paged.start} end={paged.end} />
      </Card>
    </div>
  );
}
