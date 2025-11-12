import { Transaction, TransactionCard } from "./TransactionCard";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No transactions yet</p>
        <p className="text-muted-foreground text-sm mt-2">
          Add your first transaction to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionCard 
          key={transaction.id} 
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
