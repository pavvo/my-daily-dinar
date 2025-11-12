import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from "lucide-react";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Healthcare",
  "Education",
  "Other",
] as const;

export type TransactionCategory = typeof CATEGORIES[number];

export interface Transaction {
  id: string;
  name: string;
  description?: string;
  amount: number;
  date: Date;
  type: "income" | "expense";
  category: TransactionCategory;
}

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionCard = ({ transaction, onEdit, onDelete }: TransactionCardProps) => {
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
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{transaction.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {transaction.category}
              </Badge>
            </div>
            {transaction.description && (
              <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {format(transaction.date, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`font-semibold text-lg ${isIncome ? "text-success" : "text-destructive"}`}>
            {isIncome ? "+" : "-"}{Math.abs(transaction.amount).toLocaleString()} RSD
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(transaction)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(transaction.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
