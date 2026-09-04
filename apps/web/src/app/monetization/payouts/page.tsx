'use client';

import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import type { PayoutStatus } from '@creator-hub/types';
import { useMonetizationOverview } from '@/lib/api/hooks';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { DashboardSkeleton } from '@/components/Skeleton';
import { Tag } from '@/components/Tag';
import { Pagination, usePagination } from '@/components/Pagination';

const PAGE_SIZE = 8;
const FILTERS: { key: PayoutStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'paid', label: 'Paid' },
  { key: 'pending', label: 'Pending' },
];

export default function PayoutsPage() {
  const { data, isLoading, isError } = useMonetizationOverview();
  const [filter, setFilter] = useState<PayoutStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <p className="text-sm text-decline">Couldn&apos;t load payouts.</p>;

  const paid = data.payouts.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = data.payouts.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  const filtered = useMemo(
    () => data.payouts.filter((p) => filter === 'all' || p.status === filter),
    [data.payouts, filter],
  );
  const paged = usePagination(filtered, PAGE_SIZE, page);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Payouts & Invoices"
        description="Unified ledger across platforms, brands, and affiliates"
        action={
          <button className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm text-black/70 shadow-sm hover:bg-black/5">
            <Download size={14} /> Export CSV
          </button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <Card hover>
          <p className="text-xs font-semibold uppercase tracking-wide text-black/40">Total Paid</p>
          <p className="mt-1 text-2xl font-semibold text-forest">${paid.toLocaleString()}</p>
        </Card>
        <Card hover>
          <p className="text-xs font-semibold uppercase tracking-wide text-black/40">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-amber">${pending.toLocaleString()}</p>
        </Card>
        <Card hover>
          <p className="text-xs font-semibold uppercase tracking-wide text-black/40">Total Payouts</p>
          <p className="mt-1 text-2xl font-semibold text-black/80">{data.payouts.length}</p>
        </Card>
      </section>

      <Card hover>
        <div className="mb-4 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={`rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key ? 'bg-charcoal text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-black/40">
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Source</th>
              <th className="pb-2 pr-4">Amount</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2">Method</th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((payout) => (
              <tr key={payout.id} className="border-t border-black/5 hover:bg-black/[0.02]">
                <td className="py-2.5 pr-4 text-black/50">{payout.date}</td>
                <td className="py-2.5 pr-4 text-black/80">{payout.source}</td>
                <td className="py-2.5 pr-4 font-semibold text-forest">${payout.amount.toLocaleString()}</td>
                <td className="py-2.5 pr-4">
                  <Tag tone={payout.status === 'paid' ? 'forest' : 'amber'}>{payout.status}</Tag>
                </td>
                <td className="py-2.5 text-black/50">{payout.payoutMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} total={paged.total} start={paged.start} end={paged.end} />
      </Card>
    </div>
  );
}
