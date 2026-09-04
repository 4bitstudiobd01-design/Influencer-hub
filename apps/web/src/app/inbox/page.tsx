'use client';

import { useMemo, useState } from 'react';
import { MessageSquareWarning } from 'lucide-react';
import type { InboxChannel } from '@creator-hub/types';
import { useInboxMessages } from '@/lib/api/hooks';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { DashboardSkeleton } from '@/components/Skeleton';
import { Avatar } from '@/components/Avatar';
import { Tag } from '@/components/Tag';
import { Pagination, usePagination } from '@/components/Pagination';

const PAGE_SIZE = 7;

const TABS: { key: InboxChannel | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'comments', label: 'Comments' },
  { key: 'dms', label: 'DMs' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'brand_email', label: 'Brand Emails' },
];

const PRIORITY_TONE: Record<string, 'forest' | 'amber' | 'charcoal'> = {
  collab: 'forest',
  sponsor: 'amber',
  partnership: 'charcoal',
};

export default function InboxPage() {
  const { data, isLoading, isError } = useInboxMessages();
  const [tab, setTab] = useState<InboxChannel | 'all'>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (data ?? []).filter((m) => tab === 'all' || m.channel === tab),
    [data, tab],
  );
  const paged = usePagination(filtered, PAGE_SIZE, page);

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <p className="text-sm text-decline">Couldn&apos;t load the inbox.</p>;

  return (
    <div className="space-y-6">
      <SectionHeader title="Unified Inbox" description="Comments, DMs, WhatsApp, and brand emails in one stream" />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count = data.filter((m) => (t.key === 'all' ? true : m.channel === t.key) && m.unread).length;
          return (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
              className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-charcoal text-white' : 'bg-white text-black/60 shadow-sm hover:bg-black/5'
              }`}
            >
              {t.label}
              {count > 0 && (
                <span className={`ml-1.5 ${tab === t.key ? 'text-amber' : 'text-decline'}`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <Card className="!p-0" hover>
        <ul className="divide-y divide-black/5">
          {paged.rows.map((message) => (
            <li key={message.id} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-black/[0.015]">
              <Avatar name={message.sender} size={34} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${message.unread ? 'font-semibold text-black/85' : 'font-medium text-black/60'}`}>
                    {message.sender}
                  </p>
                  {message.unread && <span className="h-1.5 w-1.5 rounded-full bg-forest" />}
                  {message.priorityTag && (
                    <Tag tone={PRIORITY_TONE[message.priorityTag]}>{message.priorityTag}</Tag>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-black/55">{message.preview}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-black/35">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </li>
          ))}
          {paged.rows.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-black/40">No messages in this tab.</li>
          )}
        </ul>
        <div className="px-5 pb-4">
          <Pagination page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} total={paged.total} start={paged.start} end={paged.end} />
        </div>
      </Card>

      <Card className="flex items-start gap-3 border border-forest/20 bg-forest/5">
        <MessageSquareWarning size={18} className="mt-0.5 flex-shrink-0 text-forest" />
        <p className="text-sm text-black/70">
          WhatsApp outbound marketing messages are billed per-message under Meta&apos;s July 2025
          pricing change; replies inside a customer-initiated 24-hour window stay free.
        </p>
      </Card>
    </div>
  );
}
