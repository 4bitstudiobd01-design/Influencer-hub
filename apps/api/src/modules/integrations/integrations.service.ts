import { Injectable } from '@nestjs/common';
import type { IntegrationStatus } from '@creator-hub/types';

@Injectable()
export class IntegrationsService {
  getStatuses(): IntegrationStatus[] {
    return [
      { platform: 'youtube', connected: true, lastSyncedAt: new Date().toISOString(), quotaUsed: 3_200, quotaLimit: 10_000 },
      { platform: 'instagram', connected: true, lastSyncedAt: new Date().toISOString() },
      { platform: 'facebook', connected: false },
      { platform: 'tiktok', connected: true, lastSyncedAt: new Date(Date.now() - 3_600_000).toISOString() },
      { platform: 'whatsapp', connected: true, lastSyncedAt: new Date().toISOString() },
    ];
  }
}
