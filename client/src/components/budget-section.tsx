import { useQuery } from "@tanstack/react-query";
import { Settings, Utensils, Car, Gamepad, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Budget, Transaction } from "@shared/schema";

const categoryIcons: Record<string, any> = {
  "Food & Dining": Utensils,
  "Transportation": Car,
  "Entertainment": Gamepad,
  "Utilities": Zap,
};

const categoryColors: Record<string, string> = {
  "Food & Dining": "hsl(217, 91%, 60%)",
  "Transportation": "hsl(142, 71%, 45%)",
  "Entertainment": "hsl(38, 92%, 50%)",
  "Utilities": "hsl(0, 84%, 60%)",
};

export function BudgetSection() {
  const { data: budgets = [] } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  // Calculate current month spending per category
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= monthStart && 
           transactionDate <= monthEnd && 
           t.type === 'expense';
  });

  const spendingByCategory = currentMonthTransactions.reduce((acc, transaction) => {
    const amount = parseFloat(transaction.amount);
    acc[transaction.category] = (acc[transaction.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBudgetData = () => {
    return budgets.map(budget => {
      const spent = spendingByCategory[budget.category] || 0;
      const budgetAmount = parseFloat(budget.amount);
      const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
      
      return {
        category: budget.category,
        spent,
        budget: budgetAmount,
        percentage: Math.min(percentage, 100),
        isOverBudget: percentage > 100,
      };
    });
  };

  const budgetData = getBudgetData();

  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Budget vs Actual</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Settings className="w-4 h-4 mr-1" />
              Manage Budgets
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {budgetData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No budgets set up yet.</p>
              <p className="text-sm">Create budgets to track your spending goals.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {budgetData.map((item) => {
                const IconComponent = categoryIcons[item.category] || Utensils;
                const color = categoryColors[item.category] || "hsl(217, 91%, 60%)";
                
                return (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <IconComponent 
                        className="w-5 h-5 mr-3 flex-shrink-0" 
                        style={{ color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.category}
                        </p>
                        <div className="w-full mt-2">
                          <Progress 
                            value={item.percentage} 
                            className="h-2"
                            style={{
                              '--progress-foreground': item.isOverBudget ? 'hsl(0, 84%, 60%)' : color,
                            } as any}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className={`text-sm font-semibold ${
                        item.isOverBudget ? 'text-red-600' : 'text-foreground'
                      }`}>
                        {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                      </p>
                      <p className={`text-xs ${
                        item.isOverBudget ? 'text-red-600' : 'text-muted-foreground'
                      }`}>
                        {item.isOverBudget 
                          ? `${Math.round(item.percentage - 100)}% over budget`
                          : `${Math.round(item.percentage)}% used`
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
