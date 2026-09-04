'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { ContentPerformanceRow } from '@creator-hub/types';
import { PLATFORM_META } from './PlatformBadge';

export function MediaPreviewModal({
  item,
  onClose,
}: {
  item: ContentPerformanceRow | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item) return null;
  const platformLabel = PLATFORM_META[item.platform === 'facebook_page' ? 'facebook' : item.platform].label;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-card bg-white shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full bg-black">
          {item.mediaUrl ? (
            <video
              key={item.mediaUrl}
              src={item.mediaUrl}
              controls
              autoPlay
              className="h-full w-full object-contain"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
          )}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
            {platformLabel} · {item.contentType}
          </p>
          <p className="mt-1 font-medium text-black/85">{item.title}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-black/55">
            <span>{item.views.toLocaleString()} views</span>
            <span>{item.likes.toLocaleString()} likes</span>
            <span>{item.comments.toLocaleString()} comments</span>
            <span className="font-medium text-forest">${item.revenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
