'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import type { AnalyticsPlatform, ContentPeriod, ContentPerformanceRow } from '@creator-hub/types';
import { useContentList } from '@/lib/api/hooks';
import { Card } from './Card';
import { Pagination } from './Pagination';
import { MediaPreviewModal } from './MediaPreviewModal';

const PERIODS: { key: ContentPeriod; label: string }[] = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

const PAGE_SIZE = 6;

export function ContentTable({ platform }: { platform?: AnalyticsPlatform }) {
  const [period, setPeriod] = useState<ContentPeriod>('week');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<ContentPerformanceRow | null>(null);
  const { data, isLoading } = useContentList({ platform, period, page, pageSize: PAGE_SIZE });

  return (
    <Card
      title="Content Performance"
      description="Ranked by views for the selected window — real Postgres aggregates"
      hover
      action={
        <div className="flex gap-1 rounded-pill bg-black/5 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => {
                setPeriod(p.key);
                setPage(1);
              }}
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
        <p className="py-10 text-center text-sm text-black/40">Loading content…</p>
      ) : data.rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-black/40">No content in this window yet.</p>
      ) : (
        <>
          <div className="space-y-1">
            {data.rows.map((row, i) => (
              <button
                key={row.id}
                onClick={() => setPreview(row)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-black/[0.03]"
              >
                <span className="w-5 flex-shrink-0 text-center text-xs font-semibold text-black/30">
                  {(data.page - 1) * PAGE_SIZE + i + 1}
                </span>
                <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={row.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  {row.mediaUrl && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play size={13} className="text-white" fill="white" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-black/80">{row.title}</p>
                  <p className="text-xs capitalize text-black/40">
                    {row.publishedAt} · {row.contentType}
                  </p>
                </div>
                <div className="hidden flex-shrink-0 text-right sm:block">
                  <p className="text-sm font-semibold text-black/80">{row.views.toLocaleString()}</p>
                  <p className="text-xs text-black/40">views</p>
                </div>
                <div className="hidden flex-shrink-0 items-center gap-2 md:flex">
                  <div className="h-1.5 w-16 overflow-hidden rounded-pill bg-black/5">
                    <div
                      className="h-full rounded-pill bg-forest"
                      style={{ width: `${row.retentionPct}%` }}
                    />
                  </div>
                  <span className="text-xs text-black/50">{row.retentionPct}%</span>
                </div>
                <p className="w-16 flex-shrink-0 text-right text-sm font-semibold text-forest">
                  ${row.revenue.toLocaleString()}
                </p>
              </button>
            ))}
          </div>
          <Pagination
            page={data.page}
            pageCount={data.pageCount}
            onPageChange={setPage}
            total={data.total}
            start={(data.page - 1) * PAGE_SIZE}
            end={Math.min(data.page * PAGE_SIZE, data.total)}
          />
        </>
      )}
      <MediaPreviewModal item={preview} onClose={() => setPreview(null)} />
    </Card>
  );
}
