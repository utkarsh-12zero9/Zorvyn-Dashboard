import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export type Role = 'Viewer' | 'Admin';

interface FinanceState {
  transactions: Transaction[];
  role: Role;
}

// Deterministic pseudo-random number generator to prevent React Hydration errors
let currentSeed = 12345;
const random = () => {
  const x = Math.sin(currentSeed++) * 10000;
  return x - Math.floor(x);
};

// Generate vast consistent mock data
const generateMockData = (): Transaction[] => {
  currentSeed = 12345; // Reset seed on invoke to guarantee identical results
  const data: Transaction[] = [];
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transport', 'Shopping', 'Dining'];
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Generate data for the last 6 months
  for (let m = 0; m < 6; m++) {
    const monthBase = new Date(year, month - m, 1);
    
    // 1 Salary per month
    data.push({
      id: `sal-${m}`,
      date: new Date(monthBase.getFullYear(), monthBase.getMonth(), 5).toISOString().split('T')[0],
      amount: 4500,
      category: 'Salary',
      type: 'Income'
    });

    // 15-20 expenses per month
    const expenseCount = 15 + Math.floor(random() * 6);
    for (let i = 0; i < expenseCount; i++) {
      const day = Math.floor(random() * 28) + 1;
      const cat = categories[Math.floor(random() * categories.length)];
      
      let amount = 0;
      if (cat === 'Groceries') amount = 50 + random() * 100;
      else if (cat === 'Utilities') amount = 100 + random() * 150;
      else if (cat === 'Shopping') amount = 20 + random() * 300;
      else amount = 15 + random() * 80;

      data.push({
        id: `exp-${m}-${i}`,
        date: new Date(monthBase.getFullYear(), monthBase.getMonth(), day).toISOString().split('T')[0],
        amount: parseFloat(amount.toFixed(2)),
        category: cat,
        type: 'Expense'
      });
    }

    // Occasional freelance income
    if (random() > 0.5) {
      data.push({
        id: `free-${m}`,
        date: new Date(monthBase.getFullYear(), monthBase.getMonth(), 15).toISOString().split('T')[0],
        amount: 300 + random() * 500,
        category: 'Freelance',
        type: 'Income'
      });
    }
  }
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const initialTransactions: Transaction[] = generateMockData();

const initialState: FinanceState = {
  transactions: initialTransactions,
  role: 'Viewer',
};

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
    editTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload);
    },
  },
});

export const { setRole, addTransaction, editTransaction, deleteTransaction } = financeSlice.actions;

export default financeSlice.reducer;
