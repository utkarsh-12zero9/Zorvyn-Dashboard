'use client';

import Link from 'next/link';
import { ReceiptText, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

export function QuickLinks() {
  const links = [
    { name: 'Transactions', href: '/transactions', icon: ReceiptText, color: 'text-blue-500' },
    { name: 'Insights', href: '/insights', icon: TrendingUp, color: 'text-purple-500' },
    { name: 'ZorAI Suggestions', href: '/suggestions', icon: Sparkles, color: 'text-fuchsia-500' },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-full shadow-sm">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link 
            key={link.name} 
            href={link.href}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 group"
          >
            <Icon className={`${link.color} transition-transform group-hover:scale-110`} size={16} />
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors uppercase tracking-tight">{link.name}</span>
            <ChevronRight className="text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" size={14} />
          </Link>
        )
      })}
    </div>
  );
}
