'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRole, Role } from '@/store/slices/financeSlice';
import { UserCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Topbar() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.finance.role);

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur flex items-center justify-end px-6 sticky top-0 z-10 transition-colors">
      <div className="flex items-center gap-6">
        
        {/* Theme Toggle Component */}
        <ThemeToggle />

        {/* Role Toggle */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800 transition-colors">
          {(['Viewer', 'Admin'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => dispatch(setRole(r))}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                role === r
                  ? 'bg-zinc-300 dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 transition-colors">
          <UserCircle2 size={24} className={role === 'Admin' ? 'text-orange-500 dark:text-orange-400' : 'text-zinc-500 dark:text-zinc-400'} />
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hidden sm:inline">{role === 'Admin' ? 'Administrator' : 'Guest Viewer'}</span>
        </div>
      </div>
    </header>
  );
}
