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

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  if (!isVisible) return null;

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
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 ${
      isOpen ? 'bg-zinc-900/30 dark:bg-black/60 backdrop-blur-sm pointer-events-auto' : 'bg-transparent backdrop-blur-0 pointer-events-none'
    }`}>
      <div 
        className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl transition-all duration-300 transform-gpu ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white transition-colors">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Expense' })}
                className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  formData.type === 'Expense' 
                    ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Income' })}
                className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  formData.type === 'Income' 
                    ? 'bg-white dark:bg-zinc-800 text-green-600 dark:text-green-400 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Amount</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors font-semibold">$</span>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium text-lg"
                placeholder="0.00"
              />
            </div>
          </div>

          <div ref={dropdownRef} className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Category</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-zinc-50 dark:bg-black border rounded-xl px-4 py-3 text-left transition-all flex justify-between items-center group ${
                  isDropdownOpen ? 'border-green-500 ring-4 ring-green-500/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {formData.category ? (
                  <span className="text-zinc-900 dark:text-white font-medium transition-colors">{formData.category}</span>
                ) : (
                  <span className="text-zinc-400">Select a category</span>
                )}
                <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute z-20 w-full mt-2 bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform-gpu origin-top ${
                isDropdownOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
              }`}>
                <ul className="overflow-y-auto max-h-48 p-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {(formData.type === 'Expense' 
                    ? ['Groceries', 'Utilities', 'Entertainment', 'Transport', 'Shopping', 'Dining'] 
                    : ['Salary', 'Freelance', 'Investments', 'Other']
                  ).map((option) => {
                    const isSelected = formData.category === option;
                    const hoverColor = formData.type === 'Expense' ? 'hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400' : 'hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400';
                    const activeColor = formData.type === 'Expense' ? 'bg-orange-500 dark:bg-orange-600 text-white dark:text-black font-bold' : 'bg-green-500 dark:bg-green-600 text-white dark:text-black font-bold';

                    return (
                      <li
                        key={option}
                        onClick={() => {
                          setFormData({ ...formData, category: option });
                          setIsDropdownOpen(false);
                        }}
                        className={`px-3 py-2.5 text-sm cursor-pointer rounded-lg transition-all m-0.5 ${
                          isSelected ? activeColor : 'text-zinc-600 dark:text-zinc-400 ' + hoverColor
                        }`}
                      >
                        {option}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div ref={datePickerRef} className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Date</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className={`w-full bg-zinc-50 dark:bg-black border rounded-xl px-4 py-3 text-left transition-all flex justify-between items-center ${
                  isDatePickerOpen ? 'border-green-500 ring-4 ring-green-500/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <span className="text-zinc-900 dark:text-white font-medium transition-colors">{formData.date}</span>
                <CalendarIcon size={16} className="text-zinc-400" />
              </button>

              <div className={`absolute z-20 w-72 mt-2 p-4 bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl -top-80 sm:-top-auto right-0 sm:right-auto transition-all duration-300 transform-gpu origin-top-right ${
                isDatePickerOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"><ChevronLeft size={18}/></button>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide transition-colors">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"><ChevronRight size={18}/></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{d}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {generateCalendarDays.map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} className="p-1.5" />;
                    
                    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const tzOffset = d.getTimezoneOffset() * 60000;
                    const iso = new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
                    const isSelected = formData.date === iso;
                    
                    const themeColor = formData.type === 'Expense' ? 'bg-orange-500 text-white font-bold' : 'bg-green-500 text-white font-bold';
                    const hoverColor = formData.type === 'Expense' ? 'hover:bg-orange-500/10 hover:text-orange-600' : 'hover:bg-green-500/10 hover:text-green-600';

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleSelectDate(day)}
                        className={`p-1.5 rounded-lg transition-all focus:outline-none text-xs ${
                          isSelected ? themeColor : `text-zinc-600 dark:text-zinc-400 ${hoverColor}`
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 text-white dark:text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                formData.type === 'Expense' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
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
