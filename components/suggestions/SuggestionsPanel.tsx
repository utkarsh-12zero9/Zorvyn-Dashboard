'use client';

import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { 
  Zap, Sprout, BrainCircuit, LineChart, Home, ShieldCheck, 
  Bot, PieChart, Cpu, Coins, TrendingUp, Sparkles, Building, Briefcase,
  HeartPulse, GraduationCap, Compass, Flower2, Globe
} from 'lucide-react';

const mindfulIconMap: Record<string, any> = {
  'Health & Wellness': HeartPulse,
  'Education & Courses': GraduationCap,
  'Travel & Experiences': Compass,
  'Charity': Flower2,
  'Mindfulness': Sprout
};

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
    const dailySave = saveMoreTarget / 30;
    const weeklySave = saveMoreTarget / 4;
    const quarterlySave = saveMoreTarget * 3;

    // --- 2. INVEST SOMEWHERE ---
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
      dailySave,
      weeklySave,
      quarterlySave,
      investmentSuggestions,
      spendMoreSuggestions: finalSpendMore
    };

  }, [transactions]);

  if (!insights) return null;

  return (
    <div className="space-y-8 relative transition-all duration-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-lg dark:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative p-3 bg-white dark:bg-zinc-900 border border-indigo-500/20 dark:border-indigo-500/40 rounded-xl transition-all duration-300 transform-gpu">
              <BrainCircuit className="text-indigo-500 dark:text-indigo-400" size={28} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 dark:from-indigo-300 dark:via-purple-300 dark:to-fuchsia-300 bg-clip-text text-transparent transition-colors">
              ZorAI Financial Engine
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 transition-colors">Synthesizing your transaction genome into actionable directives.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/20 transition-all hover:bg-indigo-500/20">
          <Sparkles size={14} className="animate-pulse" /> Real-time Synchronized
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        
        {/* Suggestion 1: Save More */}
        <div className="relative overflow-hidden bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 group hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-2xl dark:hover:shadow-indigo-500/5 transition-all duration-300 transform-gpu cursor-default flex flex-col min-h-[440px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full" />
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative p-4 bg-zinc-50 dark:bg-zinc-950 border border-indigo-500/20 rounded-2xl group-hover:border-indigo-500/50 transition-all duration-300 transform group-hover:scale-105">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
                  <Zap className="text-indigo-500 dark:text-indigo-400 relative z-10" size={26} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white transition-colors">Efficiency Protocol</h3>
              </div>
              <div className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-500/20">Active Analysis</div>
            </div>
            
            <div className="space-y-6">
              {insights.topDiscretionaryCategory !== 'None' && insights.avgMonthlyDiscretionary > 0 ? (
                <div className="space-y-6">
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed text-base transition-colors">
                    Traces identified in <span className="inline-flex items-center text-zinc-900 dark:text-zinc-100 font-bold px-3 py-1 bg-zinc-200/50 dark:bg-zinc-800/80 rounded-full text-xs sm:text-sm border border-zinc-300/50 dark:border-zinc-700/50 mx-1">{insights.topDiscretionaryCategory}</span> averaging <span className="text-zinc-900 dark:text-emerald-400 font-bold">${insights.avgMonthlyDiscretionary.toFixed(0)}</span> per month.
                  </p>

                  {/* Savings Progress Meter */}
                  <div className="space-y-3 bg-zinc-100/50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
                    <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">
                      <span>Optimization Target</span>
                      <span className="text-indigo-500">-15% Savings Goal</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-900/80 rounded-full overflow-hidden relative border border-zinc-300/30 dark:border-zinc-800/50 shadow-sm">
                      <div className="absolute top-0 left-0 h-full bg-indigo-500/30 w-full" />
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-indigo-500 w-[15%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-out" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <TrendingUp size={12} className="text-emerald-500" />
                      <span>Potential monthly yield: <span className="text-emerald-500 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/10">${insights.saveMoreTarget.toFixed(0)}</span></span>
                    </div>
                  </div>

                  {/* Chronological Breakdown */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Daily', val: insights.dailySave },
                      { label: 'Weekly', val: insights.weeklySave },
                      { label: 'Quarterly', val: insights.quarterlySave },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/40 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 group/pill">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mb-1 group-hover/pill:text-indigo-500 transition-colors">{item.label}</span>
                        <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">${item.val.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors italic">Your discretionary spending is highly optimized. Maintain this frugal baseline for maximum capital accumulation.</p>
              )}
            </div>
          </div>
        </div>

        {/* Suggestion 2: Mindful Allocation */}
        <div className="relative overflow-hidden bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 group hover:-translate-y-1 hover:border-fuchsia-500/30 hover:shadow-2xl dark:hover:shadow-fuchsia-500/5 transition-all duration-300 transform-gpu cursor-default flex flex-col min-h-[440px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-[40px] rounded-full" />
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative p-4 bg-zinc-50 dark:bg-zinc-950 border border-fuchsia-500/20 rounded-2xl group-hover:border-fuchsia-500/50 transition-all duration-300 transform group-hover:scale-105">
                  <div className="absolute inset-0 bg-fuchsia-500/10 blur-xl rounded-full" />
                  <Sprout className="text-fuchsia-500 dark:text-fuchsia-400 relative z-10" size={26} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white transition-colors">Mindful Allocation</h3>
              </div>
              <div className="px-3 py-1 bg-fuchsia-500/10 text-fuchsia-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-fuchsia-500/20">High Priority</div>
            </div>
            
            <div className="space-y-6">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base transition-colors">
                The ZorAI genome reveals an under-investment in <span className="text-fuchsia-500 font-semibold italic">personal growth</span> sectors. Consider allocating surplus to:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {insights.spendMoreSuggestions.map((suggestion, idx) => {
                  const Icon = mindfulIconMap[suggestion] || Globe;
                  return (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-white/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl transition-all duration-300 transform hover:-translate-x-1 hover:border-fuchsia-500/40 hover:shadow-lg hover:shadow-fuchsia-500/5 cursor-pointer group/row">
                      <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-500 transition-all group-hover/row:scale-110 group-hover/row:bg-fuchsia-500/20 shadow-inner">
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 transition-colors uppercase tracking-tight">{suggestion}</span>
                          <Sparkles size={12} className="text-fuchsia-500/40 group-hover/row:text-fuchsia-500 transition-colors" />
                        </div>
                        <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-fuchsia-500 w-[70%] group-hover/row:w-[100%] transition-all duration-1000 ease-in-out opacity-20 group-hover:opacity-100" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion 3: Wealth Generation */}
        <div className="relative overflow-hidden bg-white/60 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 lg:col-span-2 group hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg dark:hover:shadow-emerald-500/5 transition-all duration-300 transform-gpu cursor-default">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
          
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
                  <div key={idx} className="bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 transform hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/10 cursor-default group/invest">
                    <Icon className="text-emerald-500 mb-4 group-hover/invest:scale-110 transition-transform duration-300" size={24} />
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
