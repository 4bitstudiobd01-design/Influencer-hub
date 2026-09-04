'use client';

import type { EarningsPoint } from '@creator-hub/types';
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from './Card';

function EarningsTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const earnings = payload.find((p: any) => p.dataKey === 'earnings')?.value ?? 0;
  const clicks = payload.find((p: any) => p.dataKey === 'clicks')?.value ?? 0;
  return (
    <div className="rounded-xl bg-charcoal px-3.5 py-2.5 text-xs text-white shadow-lg">
      <p className="font-medium text-white/70">
        {new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      </p>
      <p className="mt-1 text-sm font-semibold text-amber">${earnings.toFixed(2)}</p>
      <p className="text-white/50">{clicks} clicks</p>
    </div>
  );
}

export function EarningsChart({ points }: { points: EarningsPoint[] }) {
  return (
    <Card title="Earnings Over Time" description="Daily revenue vs. link clicks" hover>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points}>
            <defs>
              <linearGradient id="earningsBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E9166" />
                <stop offset="100%" stopColor="#1F6D4C" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={(d: string) =>
                new Date(d).toLocaleDateString('en-US', { weekday: 'short' })
              }
              tick={{ fontSize: 11, fill: '#00000066' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis yAxisId="left" hide />
            <YAxis yAxisId="right" orientation="right" hide />
            <Tooltip content={<EarningsTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Bar yAxisId="left" dataKey="earnings" fill="url(#earningsBar)" radius={[6, 6, 0, 0]} barSize={18} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="clicks"
              stroke="#F5A524"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
