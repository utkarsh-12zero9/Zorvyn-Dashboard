'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  { name: 'Insights', href: '/insights', icon: TrendingUp },
  { name: 'AI Suggestions', href: '/suggestions', icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black h-screen sticky top-0 flex flex-col transition-colors">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-green-500">
          Zorvyn.
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
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
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-500 text-center transition-colors">
        Finance Dashboard UI
      </div>
    </div>
  );
}
