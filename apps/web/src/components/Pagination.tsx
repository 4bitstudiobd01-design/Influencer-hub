'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export function usePagination<T>(rows: T[], pageSize: number, page: number) {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    pageCount,
    page: safePage,
    rows: rows.slice(start, start + pageSize),
    start,
    end: Math.min(start + pageSize, rows.length),
    total: rows.length,
  };
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  total,
  start,
  end,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  total?: number;
  start?: number;
  end?: number;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex items-center justify-between gap-4 pt-4 text-sm">
      {total !== undefined && (
        <p className="text-black/40">
          Showing <span className="font-medium text-black/60">{(start ?? 0) + 1}–{end}</span> of{' '}
          <span className="font-medium text-black/60">{total}</span>
        </p>
      )}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-black/50 hover:bg-black/5 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-black/30">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                p === page ? 'bg-charcoal text-white' : 'text-black/50 hover:bg-black/5',
              )}
            >
              {p}
            </button>
          </span>
        ))}
        <button
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-black/50 hover:bg-black/5 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
