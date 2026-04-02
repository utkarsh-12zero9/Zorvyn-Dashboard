import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Overview</h2>
        <p className="text-zinc-400">Welcome to your financial overview.</p>
      </div>
      <SummaryCards />
      <DashboardCharts />
    </div>
  );
}
