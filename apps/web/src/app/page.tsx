'use client';

import { DollarSign, Eye, FileText, Link2, Percent, Plus, UserPlus } from 'lucide-react';
import { useOverview } from '@/lib/api/hooks';
import { KpiCard } from '@/components/KpiCard';
import { PlatformBreakdown } from '@/components/PlatformBreakdown';
import { EarningsChart } from '@/components/EarningsChart';
import { ActivityFeed } from '@/components/ActivityFeed';
import { FeaturedDeals } from '@/components/FeaturedDeals';
import { TrendingContent } from '@/components/TrendingContent';
import { DashboardSkeleton } from '@/components/Skeleton';

const QUICK_ACTIONS = [
  { label: 'Generate Media Kit', icon: FileText },
  { label: 'Add Manual Entry', icon: Plus },
  { label: 'Connect an Account', icon: Link2 },
];

export default function OverviewPage() {
  const { data, isLoading, isError } = useOverview();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data)
    return (
      <p className="text-sm text-decline">
        Couldn&apos;t reach the API. Is `npm run dev:api` running on port 4000?
      </p>
    );

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-card bg-charcoal p-8 text-white shadow-glow sm:p-10">
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="absolute inset-0 bg-card-sheen" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur">
            <UserPlus size={12} /> Top 5% creators in your niche
          </span>
          <h1 className="mt-4 max-w-lg font-display text-3xl leading-tight sm:text-4xl">
            Welcome back, {data.creatorName.split(' ')[0]} — turn your influence{' '}
            <span className="font-display italic text-amber">into revenue.</span>
          </h1>
          <div className="mt-6 flex max-w-md items-center gap-2 rounded-pill bg-white/10 px-4 py-2.5 backdrop-blur">
            <input
              placeholder="Search a post, deal, or platform…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-1.5 rounded-pill border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur transition hover:bg-white/15"
              >
                <action.icon size={13} />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          kpi={data.kpis.totalRevenue}
          icon={<DollarSign size={17} />}
          tone="forest"
          goal={{ pct: (data.kpis.totalRevenue.value / 25_000) * 100, label: 'Goal: $25,000 this period' }}
        />
        <KpiCard kpi={data.kpis.totalReach} icon={<Eye size={17} />} tone="charcoal" />
        <KpiCard kpi={data.kpis.newFollowers} icon={<UserPlus size={17} />} tone="amber" />
        <KpiCard kpi={data.kpis.engagementRate} icon={<Percent size={17} />} tone="forest" />
      </section>

      <TrendingContent />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PlatformBreakdown rows={data.platformBreakdown} />
        </div>
        <ActivityFeed items={data.recentActivity} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EarningsChart points={data.earningsOverTime} />
        </div>
        <FeaturedDeals deals={data.featuredDeals} />
      </section>
    </div>
  );
}
