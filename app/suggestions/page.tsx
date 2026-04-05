import { SuggestionsPanel } from "@/components/suggestions/SuggestionsPanel";

export default function SuggestionsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2 transition-colors">
          Suggestions
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 transition-colors">Data-driven recommendations to optimize your financial posture.</p>
      </div>
      <SuggestionsPanel />
    </div>
  );
}
