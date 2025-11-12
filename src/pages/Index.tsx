import { useState } from "react";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { EditTransactionDialog } from "@/components/EditTransactionDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { TransactionList } from "@/components/TransactionList";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { Transaction, CATEGORIES, TransactionCategory } from "@/components/TransactionCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | "All">("All");

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const handleEditTransaction = (id: string, updatedTransaction: Omit<Transaction, "id">) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updatedTransaction, id } : t))
    );
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = () => {
    if (deletingId) {
      setTransactions((prev) => prev.filter((t) => t.id !== deletingId));
      setDeletingId(null);
    }
  };

  const filteredTransactions = categoryFilter === "All"
    ? transactions
    : transactions.filter((t) => t.category === categoryFilter);

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === "income" 
      ? acc + transaction.amount 
      : acc - transaction.amount;
  }, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Budget Tracker</h1>
              <p className="text-muted-foreground">Manage your finances</p>
            </div>
          </div>
          <AddTransactionDialog onAddTransaction={handleAddTransaction} />
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <p className="text-sm opacity-90 mb-1">Total Balance</p>
            <p className="text-3xl font-bold">
              {balance.toLocaleString()} RSD
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-success to-success/80 text-success-foreground">
            <p className="text-sm opacity-90 mb-1">Income</p>
            <p className="text-3xl font-bold">
              +{totalIncome.toLocaleString()} RSD
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground">
            <p className="text-sm opacity-90 mb-1">Expenses</p>
            <p className="text-3xl font-bold">
              -{totalExpenses.toLocaleString()} RSD
            </p>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="mb-8">
          <CategoryBreakdown transactions={transactions} />
        </div>

        {/* Transactions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {categoryFilter === "All" ? "All Categories" : categoryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as TransactionCategory | "All")}>
                  <DropdownMenuRadioItem value="All">All Categories</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  {CATEGORIES.map((category) => (
                    <DropdownMenuRadioItem key={category} value={category}>
                      {category}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <TransactionList 
            transactions={filteredTransactions}
            onEdit={setEditingTransaction}
            onDelete={setDeletingId}
          />
        </div>

        {/* Dialogs */}
        <EditTransactionDialog
          transaction={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          onEditTransaction={handleEditTransaction}
        />
        <DeleteConfirmDialog
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
          onConfirm={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default Index;
