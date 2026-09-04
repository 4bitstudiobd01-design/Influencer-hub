'use client';

import { Area, AreaChart, ResponsiveContainer } from 'recharts';

export function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const points = data.map((value, i) => ({ i, value }));
  const color = positive ? '#1F6D4C' : '#E5484D';
  const gradientId = `spark-${positive ? 'up' : 'down'}-${data.join('').length}`;

  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
