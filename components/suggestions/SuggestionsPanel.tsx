'use client';

import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { 
  Zap, Sprout, BrainCircuit, LineChart, Home, ShieldCheck, 
  Bot, PieChart, Cpu, Coins, TrendingUp, Sparkles, Building, Briefcase 
} from 'lucide-react';

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
    const saveMoreTarget = avgMonthlyDiscretionary * 0.15;

    // --- 2. INVEST SOMEWHERE (Data-Driven Dynamic Pool) ---
    const investmentPool = [
      { name: "S&P 500 Index", reason: "Broad market compounding.", icon: LineChart, min: 500, triggerCat: 'any' },
      { name: "High-Yield Savings", reason: "Risk-free liquid returns.", icon: ShieldCheck, min: 0, triggerCat: 'any' },
      { name: "Real Estate (REITs)", reason: "Diversify into properties.", icon: Home, min: 1000, triggerCat: 'any' },
      { name: "Robo-Advisors", reason: "Automated portfolio management.", icon: Bot, min: 200, triggerCat: 'any' },
      { name: "Fractional Shares", reason: "Micro-invest in big tech.", icon: PieChart, min: 0, triggerCat: 'any' },
      { name: "Blue-Chip Tech", reason: "Established tech dominants.", icon: Cpu, min: 1500, triggerCat: 'Shopping' },
      { name: "Dividend Aristocrats", reason: "Stable dividend payouts.", icon: Coins, min: 800, triggerCat: 'any' },
      { name: "Consumer Staples ETFs", reason: "Hedge against inflation.", icon: Building, min: 100, triggerCat: 'Groceries' },
      { name: "Energy/Utilities ETFs", reason: "Capitalize on utility sectors.", icon: Zap, min: 500, triggerCat: 'Utilities' },
      { name: "Corporate Bonds", reason: "Fixed-income securities.", icon: Briefcase, min: 1000, triggerCat: 'any' }
    ];

    let availableInvestments = investmentPool.filter(i => avgMonthlySurplus >= i.min);
    if (availableInvestments.length === 0) {
      availableInvestments = investmentPool.filter(i => i.min === 0);
    }

    availableInvestments.sort((a, b) => {
      const aMatch = a.triggerCat === topDiscretionary.category ? 1 : 0;
      const bMatch = b.triggerCat === topDiscretionary.category ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
      
      const hashA = (a.name.length * totalExpense) % 100;
      const hashB = (b.name.length * totalExpense) % 100;
      return hashB - hashA;
    });

    const investmentSuggestions = availableInvestments.slice(0, 3);

    // --- 3. SPEND MORE SECTOR ---
    const mindfulCategories = ['Health & Wellness', 'Education & Courses', 'Travel & Experiences', 'Charity'];
    const activeCategories = Object.keys(expenseByCategory);
    
    const unusedMindful = mindfulCategories.filter(c => !activeCategories.includes(c));
    const suggestions = unusedMindful.length >= 2 ? unusedMindful : mindfulCategories;
    const finalSpendMore = suggestions.sort((a, b) => ((a.length * totalExpense) % 10) - ((b.length * totalExpense) % 10)).slice(0, 2);

    return {
      avgMonthlySurplus,
      topDiscretionaryCategory: topDiscretionary.category,
      avgMonthlyDiscretionary,
      saveMoreTarget,
      investmentSuggestions,
      spendMoreSuggestions: finalSpendMore
    };

  }, [transactions]);

  if (!insights) return null;

  return (
    <div className="space-y-8 relative transition-colors">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-xl dark:shadow-2xl transition-colors">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 animate-pulse" />
            <div className="relative p-3 bg-zinc-50 dark:bg-zinc-900 border border-indigo-500/30 dark:border-indigo-500/50 rounded-xl transition-colors">
              <BrainCircuit className="text-indigo-500 dark:text-indigo-400" size={28} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 dark:from-indigo-300 dark:via-purple-300 dark:to-fuchsia-300 bg-clip-text text-transparent transition-colors">
              AI Financial Engine
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 transition-colors">Synthesizing your transaction genome into actionable directives.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/20 transition-colors">
          <Sparkles size={14} /> Synchronized
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        
        {/* Suggestion 1: Save More */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 group hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_8px_30px_rgb(99,102,241,0.1)] transition-all duration-300">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-indigo-500/20 rounded-2xl group-hover:border-indigo-500/50 transition-colors">
              <Zap className="text-indigo-500 dark:text-indigo-400" size={26} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 transition-colors">Optimization Protocol: Save More</h3>
              {insights.topDiscretionaryCategory !== 'None' && insights.avgMonthlyDiscretionary > 0 ? (
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors">
                  My analysis traces your highest flexible expenditure to <span className="text-zinc-900 dark:text-zinc-200 font-medium px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md transition-colors">{insights.topDiscretionaryCategory}</span>, averaging <span className="text-zinc-900 dark:text-zinc-200 font-medium transition-colors">${insights.avgMonthlyDiscretionary.toFixed(0)}/mo</span>. 
                  <br className="my-3" />
                  Strategically shaving this by just <span className="text-indigo-600 dark:text-indigo-400 font-semibold transition-colors">15%</span> will yield an extra <span className="text-emerald-600 dark:text-green-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md transition-colors">${insights.saveMoreTarget.toFixed(0)}</span> in monthly liquidity.
                </p>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors">Your discretionary spending is highly optimized. Maintain this frugal baseline for maximum capital accumulation.</p>
              )}
            </div>
          </div>
        </div>

        {/* Suggestion 2: Spend More / Well-being */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 group hover:-translate-y-1 hover:border-fuchsia-500/40 hover:shadow-[0_8px_30px_rgb(217,70,239,0.1)] transition-all duration-300">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-fuchsia-500/20 rounded-2xl group-hover:border-fuchsia-500/50 transition-colors">
              <Sprout className="text-fuchsia-500 dark:text-fuchsia-400" size={26} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 transition-colors">Mindful Allocation</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5 transition-colors">
                Financial health encompasses holistic well-being. The data genome reveals an under-investment in personal growth sectors. Consider allocating surplus to:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {insights.spendMoreSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgb(217,70,239)] shrink-0" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion 3: Wealth Generation */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 lg:col-span-2 group hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10 relative z-10">
            <div className="md:w-1/3">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-emerald-500/20 rounded-2xl group-hover:border-emerald-500/50 transition-colors">
                  <TrendingUp className="text-emerald-500 dark:text-emerald-400" size={26} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white transition-colors">Wealth Directives</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors">
                Estimated monthly surplus sits at <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md transition-colors">${Math.max(0, insights.avgMonthlySurplus).toFixed(0)}</span>. Based on your specific cashflow volume and expenditure categories, the AI recommends routing capital into these diversified vehicles to outpace inflation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              {insights.investmentSuggestions.map((inv, idx) => {
                const Icon = inv.icon;
                return (
                  <div key={idx} className="bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-emerald-500/30 transition-all cursor-default">
                    <Icon className="text-emerald-500 mb-4" size={24} />
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 transition-colors">{inv.name}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-500 leading-relaxed transition-colors">{inv.reason}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
