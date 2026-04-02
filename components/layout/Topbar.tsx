'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRole, Role } from '@/store/slices/financeSlice';
import { UserCircle2 } from 'lucide-react';

export function Topbar() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.finance.role);

  return (
    <header className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="text-sm text-zinc-400 font-medium">
        Overview
      </div>

      <div className="flex items-center gap-4">
        {/* Role Toggle */}
        <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          {(['Viewer', 'Admin'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => dispatch(setRole(r))}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                role === r
                  ? 'bg-zinc-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-zinc-300">
          <UserCircle2 size={24} className={role === 'Admin' ? 'text-orange-400' : 'text-zinc-400'} />
          <span className="text-sm font-medium text-zinc-200 hidden sm:inline">{role === 'Admin' ? 'Administrator' : 'Guest Viewer'}</span>
        </div>
      </div>
    </header>
  );
}
