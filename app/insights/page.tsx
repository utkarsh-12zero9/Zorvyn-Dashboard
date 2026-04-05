import { AdvancedInsights } from "@/components/insights/AdvancedInsights";
import { Insights } from "@/components/dashboard/Insights";

export default function InsightsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Deep Insights</h2>
        <p className="text-zinc-400">Advanced analytics and financial patterns.</p>
      </div>
      {/* Contextual summary */}
      <Insights />
      {/* Advanced visual charts */}
      <AdvancedInsights />
    </div>
  );
}
