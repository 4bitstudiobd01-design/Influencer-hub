import { Controller, Get } from '@nestjs/common';
import type { IntegrationStatus } from '@creator-hub/types';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get()
  getStatuses(): IntegrationStatus[] {
    return this.integrations.getStatuses();
  }
}
