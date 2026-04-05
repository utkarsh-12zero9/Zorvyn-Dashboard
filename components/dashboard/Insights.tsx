'use client';

import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { PiggyBank, Flame, AlertTriangle, BarChart2, ShoppingBag } from 'lucide-react';

export function Insights() {
  const transactions = useAppSelector((state) => state.finance.transactions);

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    let totalIncome = 0;
    let totalExpense = 0;
    const expenseByCategory: Record<string, number> = {};
    let maxSingleExpense = { amount: 0, category: '', date: '' };

    const months = new Set<string>();

    transactions.forEach(t => {
      months.add(t.date.substring(0, 7));

      if (t.type === 'Income') {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
        
        if (t.amount > maxSingleExpense.amount) {
          maxSingleExpense = { amount: t.amount, category: t.category, date: t.date };
        }
      }
    });

    let topCategory = 'None';
    let maxCategoryExpense = 0;
    Object.entries(expenseByCategory).forEach(([cat, amount]) => {
      if (amount > maxCategoryExpense) {
        maxCategoryExpense = amount;
        topCategory = cat;
      }
    });

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    const isOverspending = totalExpense > totalIncome;
    const numMonths = Math.max(1, months.size);
    const avgMonthlyExpense = totalExpense / numMonths;
    const topPct = totalExpense > 0 ? ((maxCategoryExpense / totalExpense) * 100).toFixed(0) : '0';

    return {
      topCategory,
      maxCategoryExpense,
      topPct,
      savingsRate: savingsRate.toFixed(1),
      isOverspending,
      avgMonthlyExpense,
      maxSingleExpense,
      numMonths
    };
  }, [transactions]);

  if (!insights) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
      {/* 1. Top Spending Category */}
      <InsightCard 
        icon={<Flame size={20} />} 
        color="bg-red-500/10 text-red-500 border-red-500/20" 
        label="Top Spending" 
        value={insights.topCategory} 
        subtext={`${insights.topPct}% of expenses`}
      />

      {/* 2. Monthly Average Expense */}
      <InsightCard 
        icon={<BarChart2 size={20} />} 
        color="bg-blue-500/10 text-blue-500 border-blue-500/20" 
        label="Monthly Avg" 
        value={`$${insights.avgMonthlyExpense.toLocaleString('en-US', {maximumFractionDigits: 0})}`} 
        subtext={`Based on ${insights.numMonths} months`}
      />

      {/* 3. Largest Single Transaction */}
      <InsightCard 
        icon={<ShoppingBag size={20} />} 
        color="bg-orange-500/10 text-orange-500 border-orange-500/20" 
        label="Largest Purchase" 
        value={`$${insights.maxSingleExpense.amount.toLocaleString()}`} 
        subtext={insights.maxSingleExpense.category}
      />

      {/* 4. Financial Health / Savings Rate */}
      <InsightCard 
        icon={insights.isOverspending ? <AlertTriangle size={20} /> : <PiggyBank size={20} />} 
        color={insights.isOverspending ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"} 
        label="Savings Rate" 
        value={`${insights.savingsRate}%`} 
        subtext={insights.isOverspending ? 'Capital Deficit' : 'Healthy Surplus'}
      />
    </div>
  );
}

function InsightCard({ icon, color, label, value, subtext }: { icon: React.ReactNode, color: string, label: string, value: string, subtext: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transform hover:-translate-y-1 group cursor-default transform-gpu">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110 shadow-sm`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{label}</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5 leading-none transition-colors">{value}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
        <p className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-tight font-medium">{subtext}</p>
      </div>
    </div>
  );
}
