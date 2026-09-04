import type { KpiTrend, TrendUnit } from '@creator-hub/types';

/** Deterministic pseudo-random generator so mock responses stay stable across requests. */
export function seededSeries(seed: number, length: number, min: number, max: number): number[] {
  let state = seed;
  const next = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
  return Array.from({ length }, () => Math.round(min + next() * (max - min)));
}

export function kpi(
  label: string,
  value: number,
  unit: TrendUnit,
  changePct: number,
  sparkline: number[],
): KpiTrend {
  return { label, value, unit, changePct, sparkline };
}

export function isoDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}
