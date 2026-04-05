'use client';

import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Topbar() {
  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur flex items-center justify-between px-6 shrink-0 z-50 transition-colors">
      <h1 className="text-2xl font-bold text-emerald-600 dark:text-green-500 tracking-tight">
        Zorvyn.
      </h1>

      <div className="flex items-center gap-6">
        {/* Theme Toggle Component */}
        <ThemeToggle />
      </div>
    </header>
  );
}
