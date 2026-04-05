import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Insights } from "@/components/dashboard/Insights";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors">Overview</h2>
        <p className="text-zinc-600 dark:text-zinc-400 transition-colors">Welcome to your financial overview.</p>
      </div>
      <SummaryCards />
      <Insights />
      <DashboardCharts />
    </div>
  );
}
