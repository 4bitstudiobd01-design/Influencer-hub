'use client';

import { Trophy } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAnalytics } from '@/lib/api/hooks';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { DashboardSkeleton } from '@/components/Skeleton';
import { PlatformBadge } from '@/components/PlatformBadge';

const PLATFORMS = [
  { key: 'youtube' as const, label: 'YouTube', badge: 'youtube' as const },
  { key: 'instagram' as const, label: 'Instagram', badge: 'instagram' as const },
  { key: 'facebook_page' as const, label: 'Facebook', badge: 'facebook' as const },
  { key: 'tiktok' as const, label: 'TikTok', badge: 'tiktok' as const },
];

const CONTENT_LEADERBOARD = [
  { format: 'Shorts / Reels', engagement: 9.4, revenuePerPost: 340 },
  { format: 'Long-form video', engagement: 6.1, revenuePerPost: 610 },
  { format: 'Static posts', engagement: 3.8, revenuePerPost: 90 },
  { format: 'Stories', engagement: 5.2, revenuePerPost: 40 },
];

export default function ComparisonPage() {
  const youtube = useAnalytics('youtube');
  const instagram = useAnalytics('instagram');
  const facebook = useAnalytics('facebook_page');
  const tiktok = useAnalytics('tiktok');

  const results = { youtube, instagram, facebook_page: facebook, tiktok };
  const loading = Object.values(results).some((r) => r.isLoading);
  if (loading) return <DashboardSkeleton />;

  const rows = PLATFORMS.map((p) => ({
    platform: p.label,
    engagementRate: results[p.key].data?.kpis.engagementRate.value ?? 0,
    growthRate: results[p.key].data?.kpis.followers.changePct ?? 0,
    revenuePerFollower: Number(
      (
        (results[p.key].data?.kpis.views.value ?? 0) /
        Math.max(1, results[p.key].data?.kpis.followers.value ?? 1) /
        50
      ).toFixed(2),
    ),
  }));
  const best = rows.reduce((a, b) => (b.engagementRate > a.engagementRate ? b : a));

  return (
    <div className="space-y-6">
      <SectionHeader title="Cross-Platform Comparison" description="Engagement, growth, and revenue efficiency side by side" />

      <Card className="flex items-center gap-4 border border-forest/20 bg-gradient-to-br from-forest/5 to-amber/5" hover>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest">
          <Trophy size={20} />
        </div>
        <div>
          <p className="text-sm text-black/50">Best performing platform this month</p>
          <p className="text-xl font-semibold text-forest">
            {best.platform} — {best.engagementRate.toFixed(1)}% engagement
          </p>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Engagement Rate by Platform" hover>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
                <XAxis dataKey="platform" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                <Bar dataKey="engagementRate" fill="#1F6D4C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Multi-Metric Radar" description="Engagement · growth · revenue efficiency" hover>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={rows}>
                <PolarGrid stroke="#00000012" />
                <PolarAngleAxis dataKey="platform" tick={{ fontSize: 12, fill: '#00000099' }} />
                <Radar
                  name="Engagement"
                  dataKey="engagementRate"
                  stroke="#1F6D4C"
                  fill="#1F6D4C"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Revenue / follower"
                  dataKey="revenuePerFollower"
                  stroke="#F5A524"
                  fill="#F5A524"
                  fillOpacity={0.2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Content-Type Leaderboard" description="Which format drives the most engagement and revenue" hover>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-black/40">
              <th className="pb-2 pr-4">Format</th>
              <th className="pb-2 pr-4">Engagement Rate</th>
              <th className="pb-2">Revenue / Post</th>
            </tr>
          </thead>
          <tbody>
            {[...CONTENT_LEADERBOARD]
              .sort((a, b) => b.engagement - a.engagement)
              .map((row, i) => (
                <tr key={row.format} className="border-t border-black/5">
                  <td className="py-2.5 pr-4 font-medium text-black/80">
                    {i === 0 && '🥇 '}
                    {i === 1 && '🥈 '}
                    {i === 2 && '🥉 '}
                    {row.format}
                  </td>
                  <td className="py-2.5 pr-4 text-black/70">{row.engagement}%</td>
                  <td className="py-2.5 font-medium text-forest">${row.revenuePerPost}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>

      <div className="flex flex-wrap gap-3">
        {PLATFORMS.map((p) => (
          <div key={p.key} className="rounded-pill border border-black/10 bg-white px-3 py-1.5">
            <PlatformBadge platform={p.badge} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
