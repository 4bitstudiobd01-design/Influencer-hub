import type { Platform } from '@creator-hub/types';
import { Camera, Globe, Mail, MessageCircle, Music2, PlayCircle, ThumbsUp, type LucideIcon } from 'lucide-react';

export const PLATFORM_META: Record<Platform, { label: string; color: string; icon: LucideIcon }> = {
  youtube: { label: 'YouTube', color: '#FF0000', icon: PlayCircle },
  instagram: { label: 'Instagram', color: '#E1306C', icon: Camera },
  facebook: { label: 'Facebook', color: '#1877F2', icon: ThumbsUp },
  tiktok: { label: 'TikTok', color: '#000000', icon: Music2 },
  whatsapp: { label: 'WhatsApp', color: '#25D366', icon: MessageCircle },
  website: { label: 'Website', color: '#6B7280', icon: Globe },
  email: { label: 'Email', color: '#6B7280', icon: Mail },
};

export function PlatformBadge({ platform, size = 'md' }: { platform: Platform; size?: 'sm' | 'md' }) {
  const meta = PLATFORM_META[platform];
  const Icon = meta.icon;
  const dim = size === 'sm' ? 6 : 7;

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span
        className="flex items-center justify-center rounded-full"
        style={{
          width: `${dim * 4}px`,
          height: `${dim * 4}px`,
          backgroundColor: `${meta.color}17`,
          color: meta.color,
        }}
        aria-hidden
      >
        <Icon size={size === 'sm' ? 12 : 14} />
      </span>
      {meta.label}
    </span>
  );
}
