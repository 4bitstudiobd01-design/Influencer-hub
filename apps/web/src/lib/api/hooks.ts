'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AnalyticsPlatform,
  AnalyticsResponse,
  BrandDeal,
  BrandDealStage,
  ContentDetail,
  ContentListResponse,
  ContentPeriod,
  ContentPerformanceRow,
  InboxMessage,
  IntegrationStatus,
  MonetizationOverview,
  OverviewResponse,
} from '@creator-hub/types';
import { apiGet, apiPatch } from './client';

export function useOverview() {
  return useQuery({
    queryKey: ['overview'],
    queryFn: () => apiGet<OverviewResponse>('/overview'),
  });
}

export function useAnalytics(platform: AnalyticsPlatform) {
  return useQuery({
    queryKey: ['analytics', platform],
    queryFn: () => apiGet<AnalyticsResponse>(`/analytics/${platform}`),
  });
}

export function useMonetizationOverview() {
  return useQuery({
    queryKey: ['monetization'],
    queryFn: () => apiGet<MonetizationOverview>('/monetization'),
  });
}

export function useBrandDeals() {
  return useQuery({
    queryKey: ['monetization', 'deals'],
    queryFn: () => apiGet<BrandDeal[]>('/monetization/deals'),
  });
}

export function useUpdateDealStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: BrandDealStage }) =>
      apiPatch<BrandDeal>(`/monetization/deals/${id}`, { stage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monetization'] });
    },
  });
}

export function useInboxMessages() {
  return useQuery({
    queryKey: ['inbox'],
    queryFn: () => apiGet<InboxMessage[]>('/inbox'),
  });
}

export function useIntegrationStatuses() {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: () => apiGet<IntegrationStatus[]>('/integrations'),
  });
}

export function useContentList(params: {
  platform?: AnalyticsPlatform;
  period: ContentPeriod;
  page: number;
  pageSize?: number;
}) {
  const { platform, period, page, pageSize = 8 } = params;
  return useQuery({
    queryKey: ['content', platform ?? 'all', period, page, pageSize],
    queryFn: () => {
      const query = new URLSearchParams({ period, page: String(page), pageSize: String(pageSize) });
      if (platform) query.set('platform', platform);
      return apiGet<ContentListResponse>(`/content?${query.toString()}`);
    },
  });
}

export function useTopContent(params: { period: ContentPeriod; limit?: number }) {
  const { period, limit = 5 } = params;
  return useQuery({
    queryKey: ['content', 'top', period, limit],
    queryFn: () => apiGet<ContentPerformanceRow[]>(`/content/top?period=${period}&limit=${limit}`),
  });
}

export function useContentDetail(id: string | null) {
  return useQuery({
    queryKey: ['content', 'detail', id],
    queryFn: () => apiGet<ContentDetail>(`/content/${id}`),
    enabled: id !== null,
  });
}
