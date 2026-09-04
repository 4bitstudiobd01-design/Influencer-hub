import { Injectable } from '@nestjs/common';
import type { InboxMessage } from '@creator-hub/types';
import { WhatsappService } from '../whatsapp/whatsapp.service';

const COMMENTS_AND_DMS: Omit<InboxMessage, 'timestamp'>[] = [
  {
    id: 'msg-1',
    channel: 'comments',
    platform: 'youtube',
    sender: '@growth_junkie',
    preview: 'This changed how I plan my whole content calendar, thank you!',
    unread: true,
  },
  {
    id: 'msg-2',
    channel: 'dms',
    platform: 'instagram',
    sender: 'Nova Skincare',
    preview: "We'd love to sponsor your next Reel series — details attached.",
    unread: true,
    priorityTag: 'sponsor',
  },
  {
    id: 'msg-3',
    channel: 'brand_email',
    sender: 'partnerships@brightgear.co',
    preview: 'Following up on the partnership proposal we sent last week.',
    unread: false,
    priorityTag: 'partnership',
  },
  {
    id: 'msg-4',
    channel: 'comments',
    platform: 'tiktok',
    sender: '@fanpage_daily',
    preview: 'Can you do a part 2 of this?? Need it ASAP',
    unread: true,
  },
  {
    id: 'msg-5',
    channel: 'dms',
    platform: 'youtube',
    sender: 'StreamGear Co.',
    preview: 'Interested in a long-term ambassador collab — open to a call?',
    unread: true,
    priorityTag: 'collab',
  },
  {
    id: 'msg-6',
    channel: 'comments',
    platform: 'instagram',
    sender: '@dailyvibes22',
    preview: 'The lighting in this Reel is unreal, tutorial please!',
    unread: false,
  },
  {
    id: 'msg-7',
    channel: 'brand_email',
    sender: 'hello@fitfuel.com',
    preview: 'Our team reviewed your media kit — moving to contract stage.',
    unread: true,
    priorityTag: 'partnership',
  },
  {
    id: 'msg-8',
    channel: 'dms',
    platform: 'tiktok',
    sender: '@studiogearhq',
    preview: 'Would you be open to an affiliate arrangement for our new mic?',
    unread: false,
    priorityTag: 'collab',
  },
  {
    id: 'msg-9',
    channel: 'comments',
    platform: 'youtube',
    sender: '@editor_eats',
    preview: 'What plugin did you use for that transition at 3:42?',
    unread: false,
  },
  {
    id: 'msg-10',
    channel: 'brand_email',
    sender: 'team@wanderpack.com',
    preview: 'Contract signed on our end — invoice details enclosed.',
    unread: false,
  },
];

@Injectable()
export class InboxService {
  constructor(private readonly whatsapp: WhatsappService) {}

  getMessages(): InboxMessage[] {
    const timestamped = COMMENTS_AND_DMS.map((m, i) => ({
      ...m,
      timestamp: new Date(Date.now() - (i + 1) * 5_400_000).toISOString(),
    }));
    return [...timestamped, ...this.whatsapp.getMessages()].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }
}
