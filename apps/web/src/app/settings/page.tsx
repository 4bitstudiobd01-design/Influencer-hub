'use client';

import { Plus, Users } from 'lucide-react';
import { useIntegrationStatuses } from '@/lib/api/hooks';
import { Card } from '@/components/Card';
import { PlatformBadge } from '@/components/PlatformBadge';
import { SectionHeader } from '@/components/SectionHeader';
import { DashboardSkeleton } from '@/components/Skeleton';
import { Tag } from '@/components/Tag';

export default function SettingsPage() {
  const { data, isLoading, isError } = useIntegrationStatuses();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <p className="text-sm text-decline">Couldn&apos;t load integrations.</p>;

  return (
    <div className="space-y-6">
      <SectionHeader title="Settings & Integrations" description="Connections, quotas, manual entries, and team roles" />

      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((status) => (
          <Card key={status.platform} hover>
            <div className="flex items-center justify-between">
              <PlatformBadge platform={status.platform} />
              <Tag tone={status.connected ? 'forest' : 'decline'}>
                {status.connected ? 'Connected' : 'Disconnected'}
              </Tag>
            </div>
            <div className="mt-3 space-y-2 text-xs text-black/45">
              <p>
                {status.lastSyncedAt
                  ? `Last synced ${new Date(status.lastSyncedAt).toLocaleTimeString()}`
                  : 'Never synced'}
              </p>
              {status.quotaUsed !== undefined && status.quotaLimit !== undefined && (
                <div>
                  <div className="h-1.5 w-full overflow-hidden rounded-pill bg-black/5">
                    <div
                      className="h-full rounded-pill bg-amber"
                      style={{ width: `${(status.quotaUsed / status.quotaLimit) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1">
                    {status.quotaUsed.toLocaleString()} / {status.quotaLimit.toLocaleString()} API units today
                  </p>
                </div>
              )}
            </div>
            <button className="mt-3 w-full rounded-lg border border-black/10 py-1.5 text-xs font-medium text-black/60 transition hover:bg-black/5">
              {status.connected ? 'Manage Connection' : 'Connect'}
            </button>
          </Card>
        ))}
      </div>

      <Card title="Manual Data Entry" description="Anything without API access" hover>
        <p className="text-sm text-black/55">
          Personal Facebook profile reach, cash sponsorships, and merch revenue from third-party
          stores are entered here rather than synced automatically.
        </p>
        <button className="mt-3 flex items-center gap-2 rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-white hover:bg-charcoal-soft">
          <Plus size={14} /> Add Manual Entry
        </button>
      </Card>

      <Card title="Team & Roles" description="Manager, editor, and viewer access" hover>
        <div className="flex items-center gap-3 rounded-xl border border-black/5 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/40">
            <Users size={16} />
          </div>
          <p className="text-sm text-black/55">No team members added yet.</p>
          <button className="ml-auto rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 hover:bg-black/5">
            Invite
          </button>
        </div>
      </Card>
    </div>
  );
}
