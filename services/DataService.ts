import { Category, Transaction, TransactionFilter } from '../types';

class DataService {
  private categories: Category[] = [
    { id: '1', name: 'Lương', type: 'income', color: '#4CAF50' },
    { id: '2', name: 'Thưởng', type: 'income', color: '#8BC34A' },
    { id: '3', name: 'Đầu tư', type: 'income', color: '#CDDC39' },
    { id: '4', name: 'Ăn uống', type: 'expense', color: '#F44336' },
    { id: '5', name: 'Di chuyển', type: 'expense', color: '#FF9800' },
    { id: '6', name: 'Mua sắm', type: 'expense', color: '#E91E63' },
    { id: '7', name: 'Giải trí', type: 'expense', color: '#9C27B0' },
    { id: '8', name: 'Hóa đơn', type: 'expense', color: '#3F51B5' },
  ];

  private transactions: Transaction[] = [];

  // Categories
  getCategories(type?: 'income' | 'expense'): Category[] {
    if (type) {
      return this.categories.filter(cat => cat.type === type);
    }
    return this.categories;
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(cat => cat.id === id);
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index === -1) return null;
    
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  deleteCategory(id: string): boolean {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    return true;
  }

  // Transactions
  getTransactions(filter?: TransactionFilter): Transaction[] {
    let filteredTransactions = [...this.transactions];

    if (filter) {
      if (filter.type) {
        filteredTransactions = filteredTransactions.filter(t => t.type === filter.type);
      }
      
      if (filter.categoryId) {
        filteredTransactions = filteredTransactions.filter(t => t.categoryId === filter.categoryId);
      }
      
      if (filter.startDate) {
        filteredTransactions = filteredTransactions.filter(t => t.date >= filter.startDate!);
      }
      
      if (filter.endDate) {
        filteredTransactions = filteredTransactions.filter(t => t.date <= filter.endDate!);
      }
      
      if (filter.period) {
        const now = new Date();
        let startDate: Date;
        
        switch (filter.period) {
          case 'day':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            const dayOfWeek = now.getDay();
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }
        
        filteredTransactions = filteredTransactions.filter(t => t.date >= startDate);
      }
    }

    return filteredTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactions.find(t => t.id === id);
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.transactions[index] = { 
      ...this.transactions[index], 
      ...updates,
      updatedAt: new Date(),
    };
    return this.transactions[index];
  }

  deleteTransaction(id: string): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.transactions.splice(index, 1);
    return true;
  }

  getTransactionSummary(filter?: TransactionFilter) {
    const transactions = this.getTransactions(filter);
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    return { income, expense, balance, transactionCount: transactions.length };
  }
}

export default new DataService();
