import { Injectable } from '@nestjs/common';
import type { InboxMessage } from '@creator-hub/types';

/**
 * Owns the WhatsApp Cloud API connection via a Business Solution Provider.
 * Outbound marketing messages are billed per-message since Meta's July 2025 pricing
 * change; replies inside a customer-initiated 24h window stay free — the Inbox UI
 * surfaces that distinction per conversation.
 */
@Injectable()
export class WhatsappService {
  getMessages(): InboxMessage[] {
    const base: Omit<InboxMessage, 'timestamp'>[] = [
      {
        id: 'wa-1',
        channel: 'whatsapp',
        platform: 'whatsapp',
        sender: '+1 555 0148',
        preview: 'Hey! Loved your last video, are you open to a collab?',
        unread: true,
        priorityTag: 'collab',
      },
      {
        id: 'wa-2',
        channel: 'whatsapp',
        platform: 'whatsapp',
        sender: 'Broadcast list: VIP Fans',
        preview: 'Template message delivered to 1,240 recipients',
        unread: false,
      },
      {
        id: 'wa-3',
        channel: 'whatsapp',
        platform: 'whatsapp',
        sender: '+44 7700 900123',
        preview: 'Can you send the media kit for a possible sponsorship?',
        unread: true,
        priorityTag: 'sponsor',
      },
      {
        id: 'wa-4',
        channel: 'whatsapp',
        platform: 'whatsapp',
        sender: '+1 415 555 0192',
        preview: 'Thanks for the shoutout, made my week!',
        unread: false,
      },
    ];
    return base.map((m, i) => ({ ...m, timestamp: new Date(Date.now() - (i + 1) * 3_600_000).toISOString() }));
  }
}
