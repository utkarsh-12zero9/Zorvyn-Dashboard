import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Insights } from "@/components/dashboard/Insights";
import { QuickLinks } from "@/components/dashboard/QuickLinks";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl pb-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors">Overview</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors mt-1">Intelligent financial monitoring system.</p>
        </div>
        <div className="hidden md:block">
          <QuickLinks />
        </div>
      </div>

      <div className="space-y-6">
        <SummaryCards />
        <div className="space-y-6">
          <div className="md:hidden">
            <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Quick Navigation</h4>
            <QuickLinks />
          </div>
          <Insights />
        </div>
        <DashboardCharts />
      </div>
    </div>
  );
}
