'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  Users,
  CalendarDays,
  Inbox,
  FileText,
  Settings,
  ChevronDown,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

interface NavLeaf {
  label: string;
  href: string;
}

interface NavSection {
  icon: LucideIcon;
  label: string;
  href?: string;
  children?: NavLeaf[];
}

const NAV: NavSection[] = [
  { icon: LayoutDashboard, label: 'Overview', href: '/' },
  {
    icon: LineChart,
    label: 'Analytics',
    children: [
      { label: 'YouTube', href: '/analytics/youtube' },
      { label: 'Instagram', href: '/analytics/instagram' },
      { label: 'Facebook (Page)', href: '/analytics/facebook-page' },
      { label: 'TikTok', href: '/analytics/tiktok' },
      { label: 'Cross-Platform Comparison', href: '/analytics/comparison' },
    ],
  },
  {
    icon: Wallet,
    label: 'Monetization',
    children: [
      { label: 'Platform Revenue', href: '/monetization/revenue' },
      { label: 'Brand Deals & Sponsorships', href: '/monetization/deals' },
      { label: 'Affiliate & Referral Earnings', href: '/monetization/affiliate' },
      { label: 'Payouts & Invoices', href: '/monetization/payouts' },
    ],
  },
  { icon: Users, label: 'Audience', href: '/audience' },
  { icon: CalendarDays, label: 'Content Calendar', href: '/calendar' },
  { icon: Inbox, label: 'Inbox', href: '/inbox' },
  { icon: FileText, label: 'Media Kit', href: '/media-kit' },
  { icon: Settings, label: 'Settings & Integrations', href: '/settings' },
];

function isSectionActive(section: NavSection, pathname: string) {
  if (section.href) return pathname === section.href;
  return section.children?.some((c) => pathname === c.href) ?? false;
}

function SidebarSection({ section, pathname }: { section: NavSection; pathname: string }) {
  const active = isSectionActive(section, pathname);
  const [open, setOpen] = useState(active || !section.children);
  const Icon = section.icon;

  if (section.href) {
    return (
      <Link
        href={section.href}
        className={clsx(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          active
            ? 'bg-white text-charcoal shadow-[0_4px_14px_rgba(0,0,0,0.25)]'
            : 'text-white/60 hover:bg-white/[0.06] hover:text-white',
        )}
      >
        <Icon size={17} className={active ? 'text-forest' : 'text-white/40 group-hover:text-white/70'} />
        {section.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
          active ? 'text-white' : 'text-white/60 hover:text-white',
        )}
      >
        <Icon size={17} className={active ? 'text-forest' : 'text-white/40'} />
        <span className="flex-1 text-left">{section.label}</span>
        <ChevronDown
          size={14}
          className={clsx('text-white/30 transition-transform', open && 'rotate-180')}
        />
      </button>
      <div
        className={clsx(
          'ml-[1.55rem] overflow-hidden border-l border-white/10 pl-3 transition-all',
          open ? 'mt-0.5 max-h-96' : 'max-h-0',
        )}
      >
        {section.children?.map((leaf) => {
          const leafActive = pathname === leaf.href;
          return (
            <Link
              key={leaf.href}
              href={leaf.href}
              className={clsx(
                'block rounded-lg px-3 py-1.5 text-[13px] transition-colors',
                leafActive ? 'font-medium text-forest-light' : 'text-white/45 hover:text-white',
              )}
            >
              {leaf.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-charcoal lg:flex">
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-forest-light to-forest text-white">
          <Sparkles size={16} />
        </div>
        <span className="font-display text-lg text-white">Creator Hub</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {NAV.map((section) => (
          <SidebarSection key={section.label} section={section} pathname={pathname} />
        ))}
      </nav>
      <div className="mx-3 mb-4 flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-3">
        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-amber to-forest-light text-center text-sm font-semibold leading-9 text-white">
          AR
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-charcoal bg-forest-light" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">Alex Rivera</p>
          <p className="truncate text-xs text-white/40">Platinum Creator</p>
        </div>
      </div>
    </aside>
  );
}
