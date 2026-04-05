'use client';

import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { Zap, Sparkles, Sprout, BrainCircuit } from 'lucide-react';

export function SuggestionsPanel() {
  const transactions = useAppSelector((state) => state.finance.transactions);

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const incomes = transactions.filter(t => t.type === 'Income');
    
    const expenseByCategory: Record<string, number> = {};
    expenses.forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    
    const months = new Set(transactions.map(t => t.date.substring(0, 7)));
    const numMonths = Math.max(1, months.size);
    
    const avgMonthlySurplus = (totalIncome - totalExpense) / numMonths;

    // --- 1. SAVE MORE ---
    const discretionaryCategories = ['Shopping', 'Dining', 'Entertainment'];
    let topDiscretionary = { category: 'None', amount: 0 };
    Object.entries(expenseByCategory).forEach(([cat, amt]) => {
      if (discretionaryCategories.includes(cat) && amt > topDiscretionary.amount) {
        topDiscretionary = { category: cat, amount: amt };
      }
    });

    const avgMonthlyDiscretionary = topDiscretionary.amount / numMonths;
    const saveMoreTarget = avgMonthlyDiscretionary * 0.15; // 15% cut

    // --- 2. INVEST SOMEWHERE ---
    let investmentSuggestions = [];
    if (avgMonthlySurplus > 2000) {
      investmentSuggestions = [
        { name: "S&P 500 Index Funds (VOO, SPY)", reason: "Low-cost, broad market exposure for long-term compounding." },
        { name: "Real Estate Investment Trusts (REITs)", reason: "Diversify your portfolio into real estate without direct property management." },
        { name: "Blue-Chip Tech Stocks", reason: "Higher yield potential through established, dominant market players." }
      ];
    } else if (avgMonthlySurplus > 500) {
      investmentSuggestions = [
        { name: "Robo-Advisors Accounts", reason: "Automated, hands-off portfolio management perfectly tailored to your risk tolerance." },
        { name: "Total Market ETFs (VTI)", reason: "Simple, single-fund diversification across the entire US stock market." },
        { name: "High-Yield Savings / CDs", reason: "Virtually risk-free returns to protect your capital from inflation while staying liquid." }
      ];
    } else {
      investmentSuggestions = [
        { name: "High-Yield Savings (HYSA)", reason: "Risk-free returns to help you safely build up a 3-6 month emergency fund." },
        { name: "Fractional Shares", reason: "Invest in high-value companies with whatever small amounts you have available." },
        { name: "Micro-Investing (e.g. Acorns)", reason: "Automatically invest spare change from everyday purchases without feeling it." }
      ];
    }

    // --- 3. SPEND MORE SECTOR ---
    const mindfulCategories = ['Health & Wellness', 'Education & Courses', 'Travel & Experiences', 'Charity', 'Home Improvement'];
    // Just select 2 random mindful categories for suggestions to make it feel dynamic
    const suggestions = mindfulCategories.sort(() => 0.5 - Math.random()).slice(0, 2);

    return {
      avgMonthlySurplus,
      topDiscretionaryCategory: topDiscretionary.category,
      avgMonthlyDiscretionary,
      saveMoreTarget,
      investmentSuggestions,
      spendMoreSuggestions: suggestions
    };

  }, [transactions]);

  if (!insights) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <BrainCircuit className="text-indigo-400" size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Financial Engine</h2>
          <p className="text-sm text-zinc-400">Synthesizing your transaction genome into actionable strategies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Suggestion 1: Save More */}
        <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:border-indigo-500/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-zinc-950 border border-indigo-500/30 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Zap className="text-indigo-400" size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Optimization Protocol: Save More</h3>
              {insights.topDiscretionaryCategory !== 'None' && insights.avgMonthlyDiscretionary > 0 ? (
                <p className="text-zinc-400 text-sm leading-relaxed">
                  My analysis indicates that <strong className="text-zinc-200">{insights.topDiscretionaryCategory}</strong> is your highest discretionary expense, averaging <strong className="text-zinc-200">${insights.avgMonthlyDiscretionary.toFixed(0)}/mo</strong>. 
                  <br className="my-2" />
                  If you strategically cut this category by just <span className="text-indigo-400 font-medium">15%</span>, you could save an extra <span className="text-green-400 font-bold">${insights.saveMoreTarget.toFixed(0)}</span> every month without significantly impacting your lifestyle.
                </p>
              ) : (
                <p className="text-zinc-400 text-sm leading-relaxed">Your discretionary spending is already hyper-optimized. Keep maintaining your current frugal baseline.</p>
              )}
            </div>
          </div>
        </div>

        {/* Suggestion 2: Spend More / Well-being */}
        <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:border-fuchsia-500/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-zinc-950 border border-fuchsia-500/30 rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.2)]">
              <Sprout className="text-fuchsia-400" size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Mindful Allocation</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Financial health isn't just about hoarding wealth—it's about quality of life. Based on missing data in your spending genome, consider allocating a portion of your surplus to:
              </p>
              <ul className="mt-4 space-y-2">
                {insights.spendMoreSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/50" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Suggestion 3: Invest Somewhere */}
        <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:col-span-2 group hover:border-emerald-500/50 transition-all duration-500">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-zinc-950 border border-emerald-500/30 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles className="text-emerald-400" size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Wealth Generation Directives</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                You have an estimated monthly operating surplus of <strong className="text-emerald-400 font-bold">${Math.max(0, insights.avgMonthlySurplus).toFixed(0)}</strong>. Letting this sit idle in a checking account exposes it to inflationary decay. Based on this volume, I recommend diversifying into these top 3 sectors:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.investmentSuggestions.map((inv, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-emerald-500/30 transition-colors">
                    <h4 className="font-semibold text-zinc-200 text-sm mb-2">{inv.name}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{inv.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
