import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Plus, Trash2 } from "lucide-react";
import { Transaction } from "./TransactionCard";
import { Card } from "@/components/ui/card";

interface Template {
  id: string;
  name: string;
  description?: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

interface TemplatesDialogProps {
  categories: string[];
  onAddFromTemplate: (template: Omit<Transaction, "id" | "date">) => void;
}

export const TemplatesDialog = ({ categories, onAddFromTemplate }: TemplatesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<string>(categories[0] || "Ostalo");

  useEffect(() => {
    const saved = localStorage.getItem("transactionTemplates");
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactionTemplates", JSON.stringify(templates));
  }, [templates]);

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    const newTemplate: Template = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      amount: parseFloat(amount),
      type,
      category,
    };

    setTemplates([...templates, newTemplate]);
    resetForm();
    setShowAddForm(false);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory(categories[0] || "Ostalo");
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleUseTemplate = (template: Template) => {
    onAddFromTemplate({
      name: template.name,
      description: template.description,
      amount: template.amount,
      type: template.type,
      category: template.category,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Šabloni
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Šabloni transakcija</DialogTitle>
          <DialogDescription>
            Sačuvajte ponavljajuće transakcije kao šablone za brzo dodavanje.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj novi šablon
            </Button>
          )}

          {showAddForm && (
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold">Novi šablon</h3>
              <form onSubmit={handleAddTemplate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-type">Tip</Label>
                  <RadioGroup value={type} onValueChange={(value: "income" | "expense") => setType(value)}>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expense" id="template-expense" />
                        <Label htmlFor="template-expense" className="cursor-pointer">Rashod</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="income" id="template-income" />
                        <Label htmlFor="template-income" className="cursor-pointer">Prihod</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-name">Naziv *</Label>
                  <Input
                    id="template-name"
                    placeholder="npr. Mesečna kirija"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-amount">Iznos (RSD) *</Label>
                  <Input
                    id="template-amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-category">Kategorija</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="template-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Opis</Label>
                  <Textarea
                    id="template-description"
                    placeholder="Dodatne informacije..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => { resetForm(); setShowAddForm(false); }} className="flex-1">
                    Otkaži
                  </Button>
                  <Button type="submit" className="flex-1">
                    Sačuvaj šablon
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Sačuvani šabloni</h3>
            {templates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nemate sačuvanih šablona
              </p>
            ) : (
              <div className="space-y-2">
                {templates.map((template) => (
                  <Card key={template.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.category} • {template.amount.toLocaleString()} RSD
                        </p>
                        {template.description && (
                          <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};