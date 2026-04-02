'use client';

import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#22c55e', '#f97316', '#eab308', '#3b82f6', '#ef4444', '#a855f7'];

export function DashboardCharts() {
  const transactions = useAppSelector((state) => state.finance.transactions);

  // Time-based data (Income vs Expense by date)
  const barData = useMemo(() => {
    const dataByDate: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach(t => {
      if (!dataByDate[t.date]) {
        dataByDate[t.date] = { income: 0, expense: 0 };
      }
      if (t.type === 'Income') dataByDate[t.date].income += t.amount;
      else dataByDate[t.date].expense += t.amount;
    });

    return Object.entries(dataByDate)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);

  // Categorical data (Expenses breakdown)
  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const byCategory: Record<string, number> = {};
    
    expenses.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

    return Object.entries(byCategory).map(([name, value]) => ({ 
      name, 
      value 
    }));
  }, [transactions]);

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    
    // Position it exactly on the outer edge edge
    const x = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + outerRadius * Math.sin(-midAngle * RADIAN);
  
    if (percent < 0.02) return null; // hide very tiny percentages
  
    return (
      <g>
        <circle cx={x} cy={y} r={18} fill="#27272a" stroke="none" />
        <text x={x} y={y} fill="#f4f4f5" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Income vs Expenses</h3>
        <div className="h-72">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-zinc-500">
              No transactions recorded
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Spending by Category</h3>
        <div className="h-72">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={24} fontWeight={600}>
                  100%
                </text>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any, name: any) => [`$${value}`, name]}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#a1a1aa', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">
              No expenses recorded
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
