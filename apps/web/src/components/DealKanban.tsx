'use client';

import { useState } from 'react';
import type { BrandDeal, BrandDealStage } from '@creator-hub/types';
import { AlertTriangle, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { useUpdateDealStage } from '@/lib/api/hooks';
import { Avatar } from './Avatar';
import { Tag } from './Tag';

const STAGES: { key: BrandDealStage; label: string; color: string }[] = [
  { key: 'prospecting', label: 'Prospecting', color: '#94A3B8' },
  { key: 'negotiating', label: 'Negotiating', color: '#F5A524' },
  { key: 'contract_sent', label: 'Contract Sent', color: '#3B82F6' },
  { key: 'in_production', label: 'In Production', color: '#8B5CF6' },
  { key: 'delivered', label: 'Delivered', color: '#1F6D4C' },
  { key: 'paid', label: 'Paid', color: '#1F6D4C' },
];

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function DealCard({
  deal,
  onDragStart,
  dragging,
}: {
  deal: BrandDeal;
  onDragStart: (id: string) => void;
  dragging: boolean;
}) {
  const updateStage = useUpdateDealStage();
  const currentIndex = STAGES.findIndex((s) => s.key === deal.stage);
  const due = daysUntil(deal.dueDate);
  const overdue = due < 0;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', deal.id);
        onDragStart(deal.id);
      }}
      className={clsx(
        'group cursor-grab rounded-xl border border-black/5 bg-white p-3.5 shadow-sm transition-all active:cursor-grabbing',
        dragging ? 'opacity-40' : 'hover:-translate-y-0.5 hover:shadow-card-hover',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar name={deal.brandName} size={30} />
          <div>
            <p className="text-sm font-semibold text-black/80">{deal.brandName}</p>
            <p className="text-xs text-black/45">{deal.contactPerson}</p>
          </div>
        </div>
        <GripVertical size={14} className="mt-1 text-black/15 opacity-0 group-hover:opacity-100" />
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-black/50">{deal.deliverables}</p>
      <div className="mt-3 flex items-center justify-between">
        <span
          className={clsx(
            'inline-flex items-center gap-1 text-xs',
            overdue ? 'font-medium text-decline' : 'text-black/40',
          )}
        >
          {overdue && <AlertTriangle size={11} />}
          {overdue ? `${Math.abs(due)}d overdue` : `Due in ${due}d`}
        </span>
        <span className="text-sm font-semibold text-forest">${deal.agreedRate.toLocaleString()}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <Tag tone={deal.paymentStatus === 'paid' ? 'forest' : deal.paymentStatus === 'overdue' ? 'decline' : 'neutral'}>
          {deal.paymentStatus}
        </Tag>
        <div className="flex gap-1">
          <button
            disabled={currentIndex === 0}
            onClick={() => updateStage.mutate({ id: deal.id, stage: STAGES[currentIndex - 1].key })}
            className="flex h-6 w-6 items-center justify-center rounded-md text-black/40 hover:bg-black/5 disabled:opacity-20"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            disabled={currentIndex === STAGES.length - 1}
            onClick={() => updateStage.mutate({ id: deal.id, stage: STAGES[currentIndex + 1].key })}
            className="flex h-6 w-6 items-center justify-center rounded-md text-forest hover:bg-forest/10 disabled:opacity-20"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DealKanban({ deals }: { deals: BrandDeal[] }) {
  const updateStage = useUpdateDealStage();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<BrandDealStage | null>(null);

  return (
    <div className="grid grid-flow-col auto-cols-[260px] gap-4 overflow-x-auto pb-2">
      {STAGES.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage.key);
        const stageValue = stageDeals.reduce((sum, d) => sum + d.agreedRate, 0);
        return (
          <div
            key={stage.key}
            onDragOver={(e) => {
              e.preventDefault();
              setOverStage(stage.key);
            }}
            onDragLeave={() => setOverStage((s) => (s === stage.key ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain');
              if (id) updateStage.mutate({ id, stage: stage.key });
              setDraggingId(null);
              setOverStage(null);
            }}
            className={clsx(
              'flex-shrink-0 rounded-2xl border-2 border-dashed p-2 transition-colors',
              overStage === stage.key ? 'border-forest/40 bg-forest/[0.04]' : 'border-transparent',
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-black/40">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stage.color }} />
                {stage.label}
                <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[11px] font-medium text-black/50">
                  {stageDeals.length}
                </span>
              </span>
            </div>
            <p className="mb-2 px-1 text-xs text-black/35">${stageValue.toLocaleString()} value</p>
            <div className="space-y-3">
              {stageDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  dragging={draggingId === deal.id}
                  onDragStart={setDraggingId}
                />
              ))}
              {stageDeals.length === 0 && (
                <div className="rounded-xl border border-dashed border-black/10 py-6 text-center text-xs text-black/30">
                  Drop a deal here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
