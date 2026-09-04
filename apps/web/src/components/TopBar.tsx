'use client';

import { Bell, ChevronDown, Search } from 'lucide-react';

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-black/5 bg-canvas/85 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35" />
        <input
          type="search"
          placeholder="Search creators, deals, posts…"
          className="w-full rounded-pill border border-black/10 bg-white py-2 pl-9 pr-4 text-sm shadow-sm outline-none transition-shadow focus:border-forest/40 focus:shadow-[0_0_0_3px_rgba(31,109,76,0.12)]"
        />
      </div>

      <div className="hidden items-center gap-1 rounded-pill border border-black/10 bg-white px-3 py-1.5 text-sm text-black/60 shadow-sm sm:flex">
        Last 30 days
        <ChevronDown size={14} className="text-black/30" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/60 shadow-sm transition hover:border-forest/30 hover:text-forest"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-decline" />
        </button>
        <div className="flex items-center gap-2 rounded-pill border border-black/10 bg-white px-1.5 py-1 pr-3 shadow-sm">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber to-forest-light text-center text-xs font-semibold leading-7 text-white">
            AR
          </div>
          <span className="hidden text-sm font-medium text-black/70 sm:inline">Alex</span>
        </div>
      </div>
    </header>
  );
}
