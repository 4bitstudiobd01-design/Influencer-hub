'use client';

import type { PlatformBreakdownRow } from '@creator-hub/types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from './Card';
import { PlatformBadge, PLATFORM_META } from './PlatformBadge';

export function PlatformBreakdown({ rows }: { rows: PlatformBreakdownRow[] }) {
  const totalClicks = rows.reduce((sum, r) => sum + r.clicks, 0);

  return (
    <Card title="Traffic Source" description="Clicks and revenue attributed per channel" hover>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative h-44 w-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows}
                dataKey="clicks"
                nameKey="platform"
                innerRadius={54}
                outerRadius={76}
                paddingAngle={3}
                strokeWidth={0}
              >
                {rows.map((row) => (
                  <Cell key={row.platform} fill={PLATFORM_META[row.platform].color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  PLATFORM_META[name as keyof typeof PLATFORM_META]?.label ?? name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-black/40">Clicks</span>
            <span className="text-xl font-semibold">{totalClicks.toLocaleString()}</span>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-black/40">
                <th className="pb-2 pr-4">Source</th>
                <th className="pb-2 pr-4">Clicks</th>
                <th className="pb-2 pr-4">CVR</th>
                <th className="pb-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.platform} className="border-t border-black/5">
                  <td className="py-2.5 pr-4">
                    <PlatformBadge platform={row.platform} size="sm" />
                  </td>
                  <td className="py-2.5 pr-4 text-black/70">{row.clicks.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-black/70">{row.cvr}%</td>
                  <td className="py-2.5 font-semibold text-forest">${row.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
