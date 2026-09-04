import type { BrandDealSummary } from '@creator-hub/types';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { Tag } from './Tag';

export function FeaturedDeals({ deals }: { deals: BrandDealSummary[] }) {
  return (
    <Card title="Active Brand Deals" hover>
      <div className="grid gap-3 sm:grid-cols-2">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="rounded-xl border border-black/5 p-3.5 transition-colors hover:border-forest/20 hover:bg-forest/[0.03]"
          >
            <div className="flex items-center gap-2.5">
              <Avatar name={deal.brandName} size={32} />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-wide text-black/40">
                  {deal.brandName}
                </p>
                <p className="truncate font-medium text-black/80">{deal.dealName}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Tag tone="amber">{deal.deliverableStatus}</Tag>
              <span className="text-sm font-semibold text-forest">
                ${deal.payoutAmount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
