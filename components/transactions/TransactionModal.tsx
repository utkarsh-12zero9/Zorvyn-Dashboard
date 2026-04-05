'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addTransaction, editTransaction, Transaction, TransactionType } from '@/store/slices/financeSlice';
import { X, Save, ChevronDown, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'Expense' as TransactionType,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date(formData.date));

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const generateCalendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleSelectDate = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const iso = new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
    setFormData({ ...formData, date: iso });
    setIsDatePickerOpen(false);
  };

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        type: 'Expense',
      });
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) return;

    const payload: Transaction = {
      id: transaction?.id || Math.random().toString(36).substr(2, 9),
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
    };

    if (transaction) {
      dispatch(editTransaction(payload));
    } else {
      dispatch(addTransaction(payload));
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/30 dark:bg-black/60 backdrop-blur-sm px-4 transition-colors">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-xl dark:shadow-2xl transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white transition-colors">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 transition-colors">Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Expense' })}
                className={`py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                  formData.type === 'Expense' 
                    ? 'bg-orange-100 dark:bg-orange-500/20 border-orange-500 dark:border-orange-500/50 text-orange-600 dark:text-orange-400' 
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Income' })}
                className={`py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                  formData.type === 'Income' 
                    ? 'bg-green-100 dark:bg-green-500/20 border-green-500 dark:border-green-500/50 text-green-700 dark:text-green-400' 
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 transition-colors">Amount</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
              placeholder="0.00"
            />
          </div>

          <div ref={dropdownRef}>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 transition-colors">Category</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-white dark:bg-black border rounded-lg px-4 py-2 text-left transition-colors flex justify-between items-center ${
                  isDropdownOpen ? 'border-green-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-green-500'
                }`}
              >
                {formData.category ? (
                  <span className="text-zinc-900 dark:text-white transition-colors">{formData.category}</span>
                ) : (
                  <span className="text-zinc-500">Select a category</span>
                )}
                <ChevronDown size={16} className={`text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl dark:shadow-2xl overflow-hidden overflow-y-auto max-h-48 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {(formData.type === 'Expense' 
                    ? ['Groceries', 'Utilities', 'Entertainment', 'Transport', 'Shopping', 'Dining'] 
                    : ['Salary', 'Freelance', 'Investments', 'Other']
                  ).map((option) => {
                    const isSelected = formData.category === option;
                    const hoverColor = formData.type === 'Expense' ? 'hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10' : 'hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10';
                    const activeColor = formData.type === 'Expense' ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10';

                    return (
                      <li
                        key={option}
                        onClick={() => {
                          setFormData({ ...formData, category: option });
                          setIsDropdownOpen(false);
                        }}
                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                          isSelected ? activeColor + ' font-medium' : 'text-zinc-600 dark:text-zinc-300 ' + hoverColor
                        }`}
                      >
                        {option}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div ref={datePickerRef}>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 transition-colors">Date</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className={`w-full bg-white dark:bg-black border rounded-lg px-4 py-2 text-left transition-colors flex justify-between items-center ${
                  isDatePickerOpen ? 'border-green-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-green-500'
                }`}
              >
                <span className="text-zinc-900 dark:text-white transition-colors">{formData.date}</span>
                <CalendarIcon size={16} className="text-zinc-500" />
              </button>

              {isDatePickerOpen && (
                <div className="absolute z-20 w-72 mt-2 p-4 bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl dark:shadow-2xl -top-80 sm:-top-auto right-0 sm:right-auto transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"><ChevronLeft size={18}/></button>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wide transition-colors">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"><ChevronRight size={18}/></button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                      <div key={d} className="text-[10px] font-bold text-zinc-500 uppercase">{d}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {generateCalendarDays.map((day, i) => {
                      if (!day) return <div key={`empty-${i}`} className="p-1.5" />;
                      
                      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      const tzOffset = d.getTimezoneOffset() * 60000;
                      const iso = new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
                      const isSelected = formData.date === iso;
                      
                      const themeColor = formData.type === 'Expense' ? 'bg-orange-500 text-white dark:text-black font-bold' : 'bg-green-500 text-white dark:text-black font-bold';
                      const hoverColor = formData.type === 'Expense' ? 'hover:bg-orange-50 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400' : 'hover:bg-green-50 dark:hover:bg-green-500/20 hover:text-green-600 dark:hover:text-green-400';

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleSelectDate(day)}
                          className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                            isSelected ? themeColor : `text-zinc-700 dark:text-zinc-300 ${hoverColor}`
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 text-white dark:text-black font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${
                formData.type === 'Expense' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              <Save size={18} className="mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
