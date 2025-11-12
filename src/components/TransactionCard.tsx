import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export interface Transaction {
  id: string;
  name: string;
  description?: string;
  amount: number;
  date: Date;
  type: "income" | "expense";
}

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isIncome = transaction.type === "income";
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`mt-1 ${isIncome ? "text-success" : "text-destructive"}`}>
            {isIncome ? (
              <ArrowUpCircle className="h-5 w-5" />
            ) : (
              <ArrowDownCircle className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{transaction.name}</h3>
            {transaction.description && (
              <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {format(transaction.date, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
        <div className={`text-right font-semibold text-lg ${isIncome ? "text-success" : "text-destructive"}`}>
          {isIncome ? "+" : "-"}{Math.abs(transaction.amount).toLocaleString()} RSD
        </div>
      </div>
    </Card>
  );
};
