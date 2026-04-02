'use client';

import { useState } from 'react';
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { Transaction } from '@/store/slices/financeSlice';
import { useAppSelector } from '@/store/hooks';
import { Plus } from 'lucide-react';

export default function TransactionsPage() {
  const role = useAppSelector((state) => state.finance.role);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center">Transactions</h2>
          <p className="text-zinc-400">Manage and view all your financial transactions.</p>
        </div>
        {role === 'Admin' && (
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        )}
      </div>
      
      <TransactionsTable onEdit={handleEdit} />
      
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transaction={transactionToEdit}
      />
    </div>
  );
}
