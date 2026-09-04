'use client';

import type { AudienceDemographics } from '@creator-hub/types';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card } from './Card';

const GENDER_COLORS = ['#1F6D4C', '#F5A524', '#94A3B8'];
const GEO_FLAGS: Record<string, string> = {
  'United States': '🇺🇸',
  India: '🇮🇳',
  'United Kingdom': '🇬🇧',
  Brazil: '🇧🇷',
  Canada: '🇨🇦',
  Philippines: '🇵🇭',
};

function Bars({ items }: { items: { label: string; pct: number }[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm">
          <span className="w-16 flex-shrink-0 text-black/55">{item.label}</span>
          <div className="h-2 flex-1 rounded-pill bg-black/5">
            <div className="h-2 rounded-pill bg-forest transition-all" style={{ width: `${item.pct}%` }} />
          </div>
          <span className="w-9 text-right text-xs font-medium text-black/50">{item.pct}%</span>
        </div>
      ))}
    </div>
  );
}

export function AudiencePanel({ audience }: { audience: AudienceDemographics }) {
  return (
    <Card title="Audience Demographics" hover>
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/40">Age</p>
          <Bars items={audience.ageGroups} />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/40">Gender</p>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={audience.genderSplit} dataKey="pct" innerRadius={26} outerRadius={38} strokeWidth={0}>
                    {audience.genderSplit.map((_, i) => (
                      <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-1.5 text-xs text-black/60">
              {audience.genderSplit.map((g, i) => (
                <li key={g.label} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: GENDER_COLORS[i % GENDER_COLORS.length] }}
                  />
                  {g.label} <span className="font-medium text-black/80">{g.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/40">
            Top Geographies
          </p>
          <ul className="space-y-2">
            {audience.topGeographies.map((geo, i) => (
              <li key={geo.label} className="flex items-center gap-2 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-[10px] font-semibold text-black/50">
                  {i + 1}
                </span>
                <span aria-hidden>{GEO_FLAGS[geo.label] ?? '🌍'}</span>
                <span className="flex-1 text-black/60">{geo.label}</span>
                <span className="font-medium text-black/80">{geo.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
