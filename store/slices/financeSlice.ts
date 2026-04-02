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

// Initial mock data
const initialTransactions: Transaction[] = [
  { id: '1', date: '2023-10-01', amount: 5000, category: 'Salary', type: 'Income' },
  { id: '2', date: '2023-10-05', amount: 150, category: 'Groceries', type: 'Expense' },
  { id: '3', date: '2023-10-10', amount: 200, category: 'Utilities', type: 'Expense' },
  { id: '4', date: '2023-10-15', amount: 300, category: 'Entertainment', type: 'Expense' },
  { id: '5', date: '2023-10-20', amount: 1000, category: 'Freelance', type: 'Income' },
];

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
