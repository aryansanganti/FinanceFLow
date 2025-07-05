import { 
  transactions, 
  budgets, 
  type Transaction, 
  type InsertTransaction,
  type Budget,
  type InsertBudget 
} from "@shared/schema";

export interface IStorage {
  // Transaction operations
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Budget operations
  getBudgets(): Promise<Budget[]>;
  getBudget(category: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(category: string, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(category: string): Promise<boolean>;
  
  // Analytics
  getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  getTransactionsByCategory(): Promise<{ category: string; total: number; count: number }[]>;
  getMonthlyExpenses(months: number): Promise<{ month: string; total: number }[]>;
}

export class MemStorage implements IStorage {
  private transactions: Map<number, Transaction>;
  private budgets: Map<string, Budget>;
  private currentTransactionId: number;
  private currentBudgetId: number;

  constructor() {
    this.transactions = new Map();
    this.budgets = new Map();
    this.currentTransactionId = 1;
    this.currentBudgetId = 1;
  }

  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      amount: insertTransaction.amount.toString(),
      date: new Date(insertTransaction.date),
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;

    const updated: Transaction = {
      ...existing,
      ...updateData,
      amount: updateData.amount ? updateData.amount.toString() : existing.amount,
      date: updateData.date ? new Date(updateData.date) : existing.date,
    };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Budget operations
  async getBudgets(): Promise<Budget[]> {
    return Array.from(this.budgets.values());
  }

  async getBudget(category: string): Promise<Budget | undefined> {
    return this.budgets.get(category);
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const budget: Budget = {
      ...insertBudget,
      id: this.currentBudgetId++,
      amount: insertBudget.amount.toString(),
      createdAt: new Date(),
    };
    this.budgets.set(insertBudget.category, budget);
    return budget;
  }

  async updateBudget(category: string, updateData: Partial<InsertBudget>): Promise<Budget | undefined> {
    const existing = this.budgets.get(category);
    if (!existing) return undefined;

    const updated: Budget = {
      ...existing,
      ...updateData,
      amount: updateData.amount ? updateData.amount.toString() : existing.amount,
    };
    this.budgets.set(category, updated);
    return updated;
  }

  async deleteBudget(category: string): Promise<boolean> {
    return this.budgets.delete(category);
  }

  // Analytics
  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  async getTransactionsByCategory(): Promise<{ category: string; total: number; count: number }[]> {
    const categoryMap = new Map<string, { total: number; count: number }>();
    
    for (const transaction of this.transactions.values()) {
      if (transaction.type === 'expense') {
        const current = categoryMap.get(transaction.category) || { total: 0, count: 0 };
        categoryMap.set(transaction.category, {
          total: current.total + parseFloat(transaction.amount),
          count: current.count + 1
        });
      }
    }

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data
    }));
  }

  async getMonthlyExpenses(months: number): Promise<{ month: string; total: number }[]> {
    const now = new Date();
    const monthsData: { month: string; total: number }[] = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthTransactions = await this.getTransactionsByDateRange(monthStart, monthEnd);
      const total = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      monthsData.push({ month: monthKey, total });
    }
    
    return monthsData;
  }
}

export const storage = new MemStorage();
