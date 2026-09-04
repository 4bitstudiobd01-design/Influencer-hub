'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import type { ContentPeriod, ContentPerformanceRow } from '@creator-hub/types';
import { useTopContent } from '@/lib/api/hooks';
import { Card } from './Card';
import { PlatformBadge } from './PlatformBadge';
import { MediaPreviewModal } from './MediaPreviewModal';

const PERIODS: { key: ContentPeriod; label: string }[] = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const RANK_MEDAL = ['🥇', '🥈', '🥉'];

export function TrendingContent() {
  const [period, setPeriod] = useState<ContentPeriod>('week');
  const [preview, setPreview] = useState<ContentPerformanceRow | null>(null);
  const { data, isLoading } = useTopContent({ period, limit: 5 });

  return (
    <Card
      title="Trending Content"
      description="Your highest-viewed videos & posts right now"
      hover
      action={
        <div className="flex gap-1 rounded-pill bg-black/5 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${
                period === p.key ? 'bg-white text-black/80 shadow-sm' : 'text-black/50 hover:text-black/70'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      }
    >
      {isLoading || !data ? (
        <p className="py-8 text-center text-sm text-black/40">Loading trending content…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {data.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setPreview(item)}
              className="group text-left"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                <span className="absolute left-2 top-2 text-lg leading-none drop-shadow">
                  {RANK_MEDAL[i] ?? `#${i + 1}`}
                </span>
                {item.mediaUrl && (
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
                      <Play size={13} fill="#141414" className="text-charcoal" />
                    </span>
                  </span>
                )}
                <span className="absolute bottom-1.5 left-2 text-xs font-semibold text-white drop-shadow">
                  {item.views.toLocaleString()} views
                </span>
              </div>
              <p className="mt-1.5 truncate text-xs font-medium text-black/75">{item.title}</p>
              <PlatformBadge platform={item.platform === 'facebook_page' ? 'facebook' : item.platform} size="sm" />
            </button>
          ))}
        </div>
      )}
      <MediaPreviewModal item={preview} onClose={() => setPreview(null)} />
    </Card>
  );
}
