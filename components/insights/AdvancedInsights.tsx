'use client';

import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Bar, Line, Legend
} from 'recharts';

const COLORS = ['#22c55e', '#f8590aff', '#eab308', '#3b82f6', '#ef4444', '#a855f7'];

export function AdvancedInsights() {
  const transactions = useAppSelector((state) => state.finance.transactions);

  // 1. Time-series data for AreaChart (Savings) and ComposedChart (Cashflow)
  const timeData = useMemo(() => {
    const dataByMonth: Record<string, { income: number; expense: number; timestamp: number }> = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      if (!dataByMonth[monthYear]) {
        dataByMonth[monthYear] = {
          income: 0,
          expense: 0,
          timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime()
        };
      }

      if (t.type === 'Income') {
        dataByMonth[monthYear].income += t.amount;
      } else {
        dataByMonth[monthYear].expense += t.amount;
      }
    });

    let cumulativeSavings = 0;
    
    return Object.entries(dataByMonth)
      .map(([month, data]) => ({ date: month, income: data.income, expense: data.expense, timestamp: data.timestamp }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(data => {
        const net = data.income - data.expense;
        cumulativeSavings += net;
        return {
          ...data,
          net,
          cumulativeSavings,
        };
      });
  }, [transactions]);

  // 2. Radar Data for Spending Categories
  const radarData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const byCategory: Record<string, number> = {};

    expenses.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

    return Object.entries(byCategory).map(([category, amount]) => ({
      category,
      amount,
      fullMark: Math.max(...Object.values(byCategory)) * 1.2 // dynamic max for radar scaling
    }));
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* Settings Trend Area Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-white mb-2">Net Savings Trend</h3>
        <p className="text-sm text-zinc-400 mb-6">Track your month-over-month accumulated savings.</p>
        <div className="h-80">
          {timeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Cumulative Savings']}
                />
                <Area type="monotone" dataKey="cumulativeSavings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">No data available</div>
          )}
        </div>
      </div>

      {/* Cashflow Breakdowns */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Monthly Cashflow Dynamics</h3>
        <p className="text-sm text-zinc-400 mb-6">Income vs Expenses overlaid with Net flow.</p>
        <div className="h-80">
          {timeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#a1a1aa', fontSize: '12px' }} />
                <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="Expense" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="net" name="Net Flow" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#18181b' }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-zinc-500">No data available</div>
          )}
        </div>
      </div>

      {/* Radar Chart for Spending Distribution */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative">
        <h3 className="text-lg font-semibold text-white mb-2">Expense DNA</h3>
        <p className="text-sm text-zinc-400 mb-6">A structural breakdown of your typical spending categories.</p>
        <div className="h-80">
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar name="Spending" dataKey="amount" stroke="#ef4444" strokeWidth={2} fill="#ef4444" fillOpacity={0.3} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Spent']}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
