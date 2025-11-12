import { Card } from "@/components/ui/card";
import { Transaction, CATEGORIES } from "./TransactionCard";

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export const CategoryBreakdown = ({ transactions }: CategoryBreakdownProps) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  
  const categoryTotals = CATEGORIES.map((category) => {
    const total = expenses
      .filter((t) => t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
    return { category, total };
  }).filter((item) => item.total > 0);

  const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);

  if (categoryTotals.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <p className="text-muted-foreground text-sm">No expenses yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
      <div className="space-y-3">
        {categoryTotals.map(({ category, total }) => {
          const percentage = (total / totalExpenses) * 100;
          return (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{category}</span>
                <span className="text-muted-foreground">
                  {total.toLocaleString()} RSD ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
