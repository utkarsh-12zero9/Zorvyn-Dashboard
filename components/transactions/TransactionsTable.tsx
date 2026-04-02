'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Filter, Trash2, Edit } from 'lucide-react';
import { deleteTransaction, Transaction } from '@/store/slices/financeSlice';

export function TransactionsTable({ onEdit }: { onEdit: (t: Transaction) => void }) {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.finance.transactions);
  const role = useAppSelector((state) => state.finance.role);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);

  // Formatting currency
  const formatAmount = (amount: number, type: string) => {
    const formatted = `$${Math.abs(amount).toLocaleString()}`;
    return type === 'Income' ? `+${formatted}` : `-${formatted}`;
  };

  // Filter and Sort Logic
  const processedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter (by category)
    if (search.trim()) {
      filtered = filtered.filter((t) =>
        t.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'All') {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort by date descending
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return filtered;
  }, [transactions, search, filterType, sortConfig]);

  const handleSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col mt-6">
      {/* Table Header / Controls */}
      <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-black/20 rounded-t-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search by category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Filter size={18} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
            <tr>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-green-400 transition-colors" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-2">Date <ArrowUpDown size={14} /></div>
              </th>
              <th scope="col" className="px-6 py-4">Category</th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-green-400 transition-colors" onClick={() => handleSort('type')}>
                <div className="flex items-center gap-2">Type <ArrowUpDown size={14} /></div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-green-400 transition-colors" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-2">Amount <ArrowUpDown size={14} /></div>
              </th>
              {role === 'Admin' && (
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {processedTransactions.length > 0 ? (
              processedTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{tx.date}</td>
                  <td className="px-6 py-4 text-white font-medium">{tx.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      tx.type === 'Income' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-semibold ${tx.type === 'Income' ? 'text-green-400' : 'text-zinc-200'}`}>
                    {formatAmount(tx.amount, tx.type)}
                  </td>
                  {role === 'Admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-zinc-500 hover:text-blue-400 transition-colors" title="Edit" onClick={() => onEdit(tx)}>
                          <Edit size={18} />
                        </button>
                        <button 
                          className="text-zinc-500 hover:text-red-400 transition-colors" 
                          title="Delete"
                          onClick={() => dispatch(deleteTransaction(tx.id))}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'Admin' ? 5 : 4} className="px-6 py-12 text-center text-zinc-500">
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
