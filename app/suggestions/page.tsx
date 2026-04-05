import { SuggestionsPanel } from "@/components/suggestions/SuggestionsPanel";

export default function SuggestionsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Suggestions
        </h2>
        <p className="text-zinc-400">Data-driven recommendations to optimize your financial posture.</p>
      </div>
      <SuggestionsPanel />
    </div>
  );
}
