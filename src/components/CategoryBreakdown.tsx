import { Card } from "@/components/ui/card";
import { Transaction, TransactionCategory } from "./TransactionCard";
import { AlertCircle } from "lucide-react";

interface CategoryBreakdownProps {
  categories: string[];
  transactions: Transaction[];
  budgets: Record<TransactionCategory, number>;
}

export const CategoryBreakdown = ({ categories, transactions, budgets }: CategoryBreakdownProps) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  
  const categoryTotals = categories.map((category) => {
    const total = expenses
      .filter((t) => t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
    const budget = budgets[category] || 0;
    const percentage = budget > 0 ? (total / budget) * 100 : 0;
    const isOverBudget = budget > 0 && total > budget;
    return { category, total, budget, percentage, isOverBudget };
  }).filter((item) => item.total > 0 || item.budget > 0);

  const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);

  if (categoryTotals.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Potrošnja po kategorijama</h3>
        <p className="text-muted-foreground text-sm">Još nema rashoda</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Potrošnja po kategorijama</h3>
      <div className="space-y-4">
        {categoryTotals.map(({ category, total, budget, percentage, isOverBudget }) => {
          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{category}</span>
                  {isOverBudget && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <span className="text-muted-foreground">
                  {total.toLocaleString()} RSD
                  {budget > 0 && ` / ${budget.toLocaleString()} RSD`}
                </span>
              </div>
              {budget > 0 ? (
                <>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget ? "bg-destructive" : "bg-success"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% iskorišćeno</span>
                    {budget > total && (
                      <span>{(budget - total).toLocaleString()} RSD preostalo</span>
                    )}
                    {isOverBudget && (
                      <span className="text-destructive font-medium">
                        {(total - budget).toLocaleString()} RSD preko budžeta
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">Budžet nije postavljen</div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
