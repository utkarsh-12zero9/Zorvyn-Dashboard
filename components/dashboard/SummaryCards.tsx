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
      />
      <Card 
        title="Total Income" 
        amount={income} 
        icon={<TrendingUp className="text-green-500" />} 
      />
      <Card 
        title="Total Expenses" 
        amount={expense} 
        icon={<TrendingDown className="text-red-500" />} 
      />
    </div>
  );
}

function Card({ title, amount, icon }: { title: string, amount: number, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">${amount.toLocaleString()}</p>
      </div>
      <div className="p-3 bg-black rounded-lg border border-zinc-800 shadow-sm">
        {icon}
      </div>
    </div>
  );
}
