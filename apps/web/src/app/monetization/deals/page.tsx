'use client';

import { useBrandDeals } from '@/lib/api/hooks';
import { DealKanban } from '@/components/DealKanban';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { DashboardSkeleton } from '@/components/Skeleton';

export default function BrandDealsPage() {
  const { data, isLoading, isError } = useBrandDeals();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <p className="text-sm text-decline">Couldn&apos;t load brand deals.</p>;

  const pendingTotal = data
    .filter((d) => d.paymentStatus !== 'paid')
    .reduce((sum, d) => sum + d.agreedRate, 0);
  const paidTotal = data
    .filter((d) => d.paymentStatus === 'paid')
    .reduce((sum, d) => sum + d.agreedRate, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Brand Deals & Sponsorships"
        description="Drag a card between stages, or use the arrows"
        action={
          <div className="flex gap-3">
            <Card className="!p-3">
              <p className="text-xs text-black/40">Pipeline pending</p>
              <p className="text-lg font-semibold text-amber">${pendingTotal.toLocaleString()}</p>
            </Card>
            <Card className="!p-3">
              <p className="text-xs text-black/40">Paid this quarter</p>
              <p className="text-lg font-semibold text-forest">${paidTotal.toLocaleString()}</p>
            </Card>
          </div>
        }
      />
      <DealKanban deals={data} />
    </div>
  );
}
