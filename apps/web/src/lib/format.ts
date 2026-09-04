import type { TrendUnit } from '@creator-hub/types';

export function formatKpiValue(value: number, unit: TrendUnit): string {
  switch (unit) {
    case 'currency':
      return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'number':
    default:
      return value.toLocaleString('en-US');
  }
}
