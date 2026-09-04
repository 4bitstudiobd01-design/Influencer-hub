import type { ActivityItem } from '@creator-hub/types';
import { Award, Flag, Handshake, type LucideIcon, TrendingUp, Wallet } from 'lucide-react';
import { Card } from './Card';

const META: Record<ActivityItem['type'], { icon: LucideIcon; color: string }> = {
  sponsorship_signed: { icon: Handshake, color: '#1F6D4C' },
  milestone: { icon: Award, color: '#F5A524' },
  payout_received: { icon: Wallet, color: '#1F6D4C' },
  flagged_message: { icon: Flag, color: '#E5484D' },
  brand_payment: { icon: TrendingUp, color: '#F5A524' },
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card title="Recent Activity" hover>
      <ul className="space-y-1">
        {items.map((item) => {
          const meta = META[item.type];
          const Icon = meta.icon;
          return (
            <li
              key={item.id}
              className="flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-black/[0.02]"
            >
              <span
                className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${meta.color}17`, color: meta.color }}
              >
                <Icon size={15} />
              </span>
              <div className="flex-1">
                <p className="text-sm text-black/80">{item.message}</p>
                <p className="text-xs text-black/40">
                  {new Date(item.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {item.amount !== undefined && (
                <span className="flex-shrink-0 text-sm font-semibold text-forest">
                  +${item.amount}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
