'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, TrendingUp, Sparkles, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRole, Role } from '@/store/slices/financeSlice';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  { name: 'Insights', href: '/insights', icon: TrendingUp },
  { name: 'ZorAI Suggestions', href: '/suggestions', icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.finance.role);

  return (
    <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black h-full flex flex-col transition-colors">
      <nav className="flex-1 px-4 space-y-2 mt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "bg-emerald-50 dark:bg-zinc-900 text-emerald-600 dark:text-green-400 border border-green-500/20"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              )}
            >
              <Icon size={18} className={isActive ? "text-emerald-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 transition-colors">
        <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
          <UserCircle2 size={36} className={role === 'Admin' ? 'text-orange-500 dark:text-orange-400' : 'text-zinc-500 dark:text-zinc-400'} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{role === 'Admin' ? 'Administrator' : 'Guest Viewer'}</span>
            <span className="text-[10px] text-zinc-500">zorvyn@finance.app</span>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800 transition-colors w-full">
          {(['Viewer', 'Admin'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => dispatch(setRole(r))}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${role === r
                  ? 'bg-zinc-300 dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
