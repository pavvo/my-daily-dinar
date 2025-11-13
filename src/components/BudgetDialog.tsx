import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { TransactionCategory } from "./TransactionCard";
import { useToast } from "@/hooks/use-toast";

interface BudgetDialogProps {
  categories: string[];
  budgets: Record<TransactionCategory, number>;
  onSaveBudgets: (budgets: Record<TransactionCategory, number>) => void;
}

export const BudgetDialog = ({ categories, budgets, onSaveBudgets }: BudgetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [tempBudgets, setTempBudgets] = useState<Record<TransactionCategory, number>>(budgets);
  const { toast } = useToast();

  const handleSave = () => {
    onSaveBudgets(tempBudgets);
    setOpen(false);
    toast({
      title: "Budžeti sačuvani",
      description: "Vaša mesečna ograničenja budžeta su ažurirana.",
    });
  };

  const handleInputChange = (category: TransactionCategory, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTempBudgets((prev) => ({ ...prev, [category]: numValue }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Postavi budžete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Postavi mesečna ograničenja budžeta</DialogTitle>
          <DialogDescription>
            Postavite limite potrošnje za svaku kategoriju.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {categories.map((category) => (
            <div key={category} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={category} className="col-span-2 text-right">
                {category}
              </Label>
              <Input
                id={category}
                type="number"
                min="0"
                step="100"
                value={tempBudgets[category] || 0}
                onChange={(e) => handleInputChange(category, e.target.value)}
                className="col-span-2"
                placeholder="0"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Otkaži
          </Button>
          <Button onClick={handleSave}>Sačuvaj budžete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
