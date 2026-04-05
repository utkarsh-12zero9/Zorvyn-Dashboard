'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white w-full transition-colors overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
