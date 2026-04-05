'use client';

import { useAppSelector } from '@/store/hooks';
import { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Bar, Line, Legend
} from 'recharts';

const COLORS = ['#22c55e', '#f9661dff', '#eab308', '#3b82f6', '#9d0505ff', '#a855f7'];

export function AdvancedInsights() {
  const [mounted, setMounted] = useState(false);
  const [delayedMount, setDelayedMount] = useState(false);
  const transactions = useAppSelector((state) => state.finance.transactions);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setDelayedMount(true), 250);
    return () => clearTimeout(timer);
  }, []);

  // 1. Time-series data for AreaChart (Savings) and ComposedChart (Cashflow)
  const timeData = useMemo(() => {
    const dataByMonth: Record<string, { income: number; expense: number; timestamp: number }> = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short' });

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
      fullMark: Math.max(...Object.values(byCategory)) * 1.2
    }));
  }, [transactions]);

  if (!mounted) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 lg:col-span-2 h-[400px] animate-pulse" />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 h-[400px] animate-pulse" />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 h-[400px] animate-pulse" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* Settings Trend Area Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 lg:col-span-2 transition-[transform,box-shadow,border-color,background-color] duration-300 transform transform-gpu hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/10 hover:border-blue-500/30 group min-w-0">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 transition-colors duration-300">Net Savings Trend</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 transition-colors duration-300">Track your month-over-month accumulated savings.</p>
        <div className="h-80 w-full relative min-h-[320px]">
          {delayedMount && timeData.length > 0 ? (
            <ResponsiveContainer width="99.9%" height="100%">
              <AreaChart data={timeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} minTickGap={5} padding={{ left: 10, right: 10 }} />
                <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px', padding: '8px', fontSize: '10px' }}
                  formatter={(value: any) => [`$${Number(value).toFixed(0)}`, 'Savings']}
                />
                <Area type="monotone" dataKey="cumulativeSavings" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500 animate-pulse">
               {delayedMount ? 'No data available' : 'Loading analytics...'}
            </div>
          )}
        </div>
      </div>

      {/* Cashflow Breakdowns */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-6 transition-[transform,box-shadow,border-color,background-color] duration-300 transform transform-gpu hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-500/10 hover:border-purple-500/30 group min-w-0">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1 transition-colors duration-300">Cashflow Dynamics</h3>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 transition-colors duration-300">Income vs Expenses overlaid with Net flow.</p>
        <div className="h-72 sm:h-80 w-full relative min-h-[288px]">
          {delayedMount && timeData.length > 0 ? (
            <ResponsiveContainer width="99.9%" height="100%">
              <ComposedChart data={timeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} minTickGap={5} padding={{ left: 10, right: 10 }} />
                <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px', padding: '8px', fontSize: '10px' }}
                  formatter={(value: any, name: any) => [`$${Number(value).toFixed(0)}`, name]}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#a1a1aa', fontSize: '11px' }} />
                <Bar dataKey="income" name="Income" fill="#22c55e" radius={[3, 3, 0, 0]} barSize={14} isAnimationActive={true} />
                <Bar dataKey="expense" name="Expense" fill="#f97316" radius={[3, 3, 0, 0]} barSize={14} isAnimationActive={true} />
                <Line type="monotone" dataKey="net" name="Net Flow" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: '#a855f7', strokeWidth: 1.5, stroke: '#18181b' }} isAnimationActive={true} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-zinc-500 animate-pulse">
               {delayedMount ? 'No data available' : 'Loading cashflow...'}
             </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-8 relative transition-[transform,box-shadow,border-color,background-color] duration-300 transform transform-gpu hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/10 hover:border-emerald-500/30 group min-w-0 h-full flex flex-col">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 transition-colors">Expense DNA</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 transition-colors">Structural breakdown of your spending patterns.</p>
        <div className="flex-1 w-full relative min-h-[300px]">
          {delayedMount && radarData.length > 0 ? (
            <ResponsiveContainer width="99.9%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <defs>
                  <linearGradient id="colorRadar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="#52525b" strokeOpacity={0.3} gridType="polygon" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 'fullMark']} 
                  tick={false} 
                  axisLine={false} 
                />
                <Radar 
                  name="Expenses" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fill="url(#colorRadar)" 
                  fillOpacity={1} 
                  isAnimationActive={true}
                  animationDuration={1500}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  formatter={(value: any, name: any) => [`$${value}`, "Amount"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-zinc-500 animate-pulse">
               {delayedMount ? 'No data available' : 'Mapping DNA...'}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
