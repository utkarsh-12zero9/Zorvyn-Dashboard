'use client';

import { useAppSelector } from '@/store/hooks';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useMemo } from 'react';

export function SummaryCards() {
  const transactions = useAppSelector((state) => state.finance.transactions);

  const { income, expense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'Income') {
          acc.income += curr.amount;
          acc.balance += curr.amount;
        } else {
          acc.expense += curr.amount;
          acc.balance -= curr.amount;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card 
        title="Total Balance" 
        amount={balance} 
        icon={<Wallet className="text-orange-500" />} 
        hoverGlow="hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 dark:hover:shadow-orange-500/10"
      />
      <Card 
        title="Total Income" 
        amount={income} 
        icon={<TrendingUp className="text-green-500" />} 
        hoverGlow="hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 dark:hover:shadow-green-500/10"
      />
      <Card 
        title="Total Expenses" 
        amount={expense} 
        icon={<TrendingDown className="text-red-500" />} 
        hoverGlow="hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/10"
      />
    </div>
  );
}

function Card({ title, amount, icon, hoverGlow }: { title: string, amount: number, icon: React.ReactNode, hoverGlow?: string }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 shadow-sm dark:shadow-none cursor-default group ${hoverGlow || ''}`}>
      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">{title}</p>
        <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1 transition-colors">${amount.toLocaleString()}</p>
      </div>
      <div className="p-3 bg-zinc-50 dark:bg-black rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
    </div>
  );
}
