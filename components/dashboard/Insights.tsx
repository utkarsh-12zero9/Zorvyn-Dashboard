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

    const months = new Set();

    transactions.forEach(t => {
      months.add(t.date.substring(0, 7)); // Count unique months for average

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Top Spending Category */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex items-start gap-4 transition-colors">
        <div className="p-2.5 bg-red-400/10 border border-red-500/20 rounded-lg text-red-400">
          <Flame size={18} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Top Spending</h4>
          <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1 leading-snug">{insights.topCategory}</p>
          <p className="text-xs text-zinc-500 mt-1">{insights.topPct}% of all expenses</p>
        </div>
      </div>

      {/* 2. Monthly Average Expense */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex items-start gap-4 transition-colors">
        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
          <BarChart2 size={18} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Monthly Avg</h4>
          <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1 leading-snug">${insights.avgMonthlyExpense.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-zinc-500 mt-1">Based on {insights.numMonths} months</p>
        </div>
      </div>

      {/* 3. Largest Single Transaction */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex items-start gap-4 transition-colors">
        <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400">
          <ShoppingBag size={18} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Largest Purchase</h4>
          <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1 leading-snug">${insights.maxSingleExpense.amount.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 mt-1">{insights.maxSingleExpense.category}</p>
        </div>
      </div>

      {/* 4. Financial Health / Savings Rate */}
      <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border rounded-xl p-5 flex items-start gap-4 transition-colors ${insights.isOverspending ? 'border-red-500/30' : 'border-zinc-200 dark:border-zinc-800'}`}>
        <div className={`p-2.5 border rounded-lg ${insights.isOverspending ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
          {insights.isOverspending ? <AlertTriangle size={18} /> : <PiggyBank size={18} />}
        </div>
        <div>
          <h4 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Savings Rate</h4>
          <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1 leading-snug">{insights.savingsRate}%</p>
          <p className="text-xs text-zinc-500 mt-1">
            {insights.isOverspending ? 'Currently running a deficit' : 'Healthy surplus'}
          </p>
        </div>
      </div>
    </div>
  );
}
