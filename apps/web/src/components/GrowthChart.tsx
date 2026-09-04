'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from './Card';

export function GrowthChart({ points }: { points: { date: string; followers: number }[] }) {
  const peak = points.reduce((a, b) => (b.followers > a.followers ? b : a), points[0]);

  return (
    <Card
      title="Follower Growth"
      description={`Peak on ${new Date(peak?.date ?? Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${peak?.followers.toLocaleString()} followers`}
      hover
    >
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1F6D4C" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#1F6D4C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#00000066' }}
              tickFormatter={(d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
              labelFormatter={(d: string) => new Date(d).toLocaleDateString()}
              formatter={(v: number) => [v.toLocaleString(), 'Followers']}
            />
            <Area
              type="monotone"
              dataKey="followers"
              stroke="#1F6D4C"
              strokeWidth={2.5}
              fill="url(#growthFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
