import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, TrendingUp, Percent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgetUsed: number;
  currentMonthExpenses: number;
  totalBudget: number;
}

export function DashboardSummary() {
  const { data: summary, isLoading } = useQuery<SummaryData>({
    queryKey: ["/api/analytics/summary"],
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Financial Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Expenses Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(summary?.totalExpenses || 0)}
                </p>
                <p className="text-sm text-red-600">This period</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                <ArrowDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Income Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(summary?.totalIncome || 0)}
                </p>
                <p className="text-sm text-green-600">This period</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <ArrowUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Balance</p>
                <p className={`text-2xl font-bold ${
                  (summary?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(summary?.balance || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Available funds</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Status Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Used</p>
                <p className={`text-2xl font-bold ${
                  (summary?.budgetUsed || 0) > 100 ? 'text-red-600' : 
                  (summary?.budgetUsed || 0) > 80 ? 'text-orange-600' : 'text-foreground'
                }`}>
                  {summary?.budgetUsed || 0}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(summary?.currentMonthExpenses || 0)} of {formatCurrency(summary?.totalBudget || 0)}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                <Percent className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
