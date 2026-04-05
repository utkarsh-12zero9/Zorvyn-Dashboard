'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, TrendingUp, Sparkles, UserCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRole, Role } from '@/store/slices/financeSlice';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  { name: 'Insights', href: '/insights', icon: TrendingUp },
  { name: 'ZorAI Suggestions', href: '/suggestions', icon: Sparkles },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.finance.role);

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed md:sticky top-0 left-0 w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black h-screen flex flex-col transition-all duration-300 z-[70] transform-gpu",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Mobile Header in Sidebar */}
        <div className="flex md:hidden items-center justify-between px-6 h-16 border-b border-zinc-200 dark:border-zinc-800">
          <span className="font-bold text-emerald-600 dark:text-green-500">Zorvyn Navigation</span>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose()} // Close on mobile navigation
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
        <div className="mt-auto p-4 md:pb-20 border-t border-zinc-200 dark:border-zinc-800 flex-none bg-zinc-50/50 dark:bg-black transition-colors">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-1">
              <div className="relative">
                <UserCircle2 size={38} className={cn("transition-colors duration-500", role === 'Admin' ? 'text-green-500' : 'text-zinc-500')} />
                <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-black transition-colors duration-500", role === 'Admin' ? 'bg-green-500' : 'bg-zinc-400')} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate transition-colors">{role === 'Admin' ? 'Administrator' : 'Guest'}</span>
                <span className="text-[10px] text-zinc-500 truncate">zorvyn@finance.app</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-200 dark:bg-zinc-900 rounded-lg border border-zinc-300/50 dark:border-zinc-800">
              {(['Viewer', 'Admin'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => dispatch(setRole(r))}
                  className={cn(
                    "py-1.5 px-2 text-[10px] font-bold rounded-md transition-all duration-300 uppercase tracking-wider",
                    role === r 
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/5" 
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
