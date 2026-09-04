import { Controller, Get } from '@nestjs/common';
import type { InboxMessage } from '@creator-hub/types';
import { InboxService } from './inbox.service';

@Controller('inbox')
export class InboxController {
  constructor(private readonly inbox: InboxService) {}

  @Get()
  getMessages(): InboxMessage[] {
    return this.inbox.getMessages();
  }
}
