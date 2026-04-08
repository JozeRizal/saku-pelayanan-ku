
export type Category = 'Konsumsi' | 'Transport' | 'Sewa' | 'Perlengkapan' | 'Lainnya';

export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  category: Category;
  amount: number;
  description: string;
  receiptImage?: string; // Base64 compressed image
  createdAt: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeTarget: number;
  expenseTarget: number;
  remainingIncomeGoal: number;
  remainingExpenseBudget: number;
}

export interface ReportOptions {
  title?: string;
  period?: string;
  signees: {
    name: string;
    position: string;
  }[];
  includeReceipts: boolean;
}
