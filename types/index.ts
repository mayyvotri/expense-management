export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: Date;
  type: 'income' | 'expense';
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFilter {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  type?: 'income' | 'expense';
  period?: 'day' | 'week' | 'month' | 'year';
}

export interface CategoryTotals {
  categoryId: string;
  categoryName: string;
  total: number;
  transactionCount: number;
}

export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
}
