import { AdvancedInsights } from "@/components/insights/AdvancedInsights";
import { Insights } from "@/components/dashboard/Insights";

export default function InsightsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors">Deep Insights</h2>
        <p className="text-zinc-600 dark:text-zinc-400 transition-colors">Advanced analytics and financial patterns.</p>
      </div>
      {/* Contextual summary */}
      <Insights />
      {/* Advanced visual charts */}
      <AdvancedInsights />
    </div>
  );
}
