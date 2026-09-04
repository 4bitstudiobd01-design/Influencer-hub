'use client';

import { notFound, useParams } from 'next/navigation';
import { Clock, Eye, Percent, PlayCircle, Radar, UserPlus } from 'lucide-react';
import type { AnalyticsPlatform } from '@creator-hub/types';
import { useAnalytics } from '@/lib/api/hooks';
import { KpiCard } from '@/components/KpiCard';
import { GrowthChart } from '@/components/GrowthChart';
import { ContentTable } from '@/components/ContentTable';
import { AudiencePanel } from '@/components/AudiencePanel';
import { SectionHeader } from '@/components/SectionHeader';
import { DashboardSkeleton } from '@/components/Skeleton';
import { PlatformBadge } from '@/components/PlatformBadge';

const SLUG_TO_PLATFORM: Record<string, AnalyticsPlatform> = {
  youtube: 'youtube',
  instagram: 'instagram',
  'facebook-page': 'facebook_page',
  tiktok: 'tiktok',
};

const PLATFORM_TITLE: Record<AnalyticsPlatform, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook_page: 'Facebook (Page)',
  tiktok: 'TikTok',
};

const BADGE_PLATFORM: Record<AnalyticsPlatform, 'youtube' | 'instagram' | 'facebook' | 'tiktok'> = {
  youtube: 'youtube',
  instagram: 'instagram',
  facebook_page: 'facebook',
  tiktok: 'tiktok',
};

export default function PlatformAnalyticsPage() {
  const params = useParams<{ platform: string }>();
  const platform = SLUG_TO_PLATFORM[params.platform];

  if (!platform) notFound();

  return <PlatformAnalytics platform={platform} />;
}

function PlatformAnalytics({ platform }: { platform: AnalyticsPlatform }) {
  const { data, isLoading, isError } = useAnalytics(platform);

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <p className="text-sm text-decline">Couldn&apos;t load analytics.</p>;

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`${PLATFORM_TITLE[platform]} Analytics`}
        description="Performance, content, and audience for this channel"
        action={<PlatformBadge platform={BADGE_PLATFORM[platform]} />}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard kpi={data.kpis.followers} icon={<UserPlus size={17} />} tone="amber" />
        <KpiCard kpi={data.kpis.views} icon={<Eye size={17} />} tone="charcoal" />
        <KpiCard kpi={data.kpis.reach} icon={<Radar size={17} />} tone="charcoal" />
        <KpiCard kpi={data.kpis.engagementRate} icon={<Percent size={17} />} tone="forest" />
        {data.kpis.watchTime && <KpiCard kpi={data.kpis.watchTime} icon={<Clock size={17} />} tone="forest" />}
        {data.kpis.avgViewDuration && (
          <KpiCard kpi={data.kpis.avgViewDuration} icon={<PlayCircle size={17} />} tone="forest" />
        )}
      </section>

      <GrowthChart points={data.growth} />
      <ContentTable platform={platform} />
      <AudiencePanel audience={data.audience} />
    </div>
  );
}
