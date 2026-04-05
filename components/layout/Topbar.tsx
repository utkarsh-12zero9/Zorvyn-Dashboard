'use client';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-50 transition-colors duration-300 transform-gpu">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg md:hidden transition-colors text-zinc-600 dark:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-green-500 tracking-tight">
          Zorvyn.
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Theme Toggle Component */}
        <ThemeToggle />
      </div>
    </header>
  );
}
