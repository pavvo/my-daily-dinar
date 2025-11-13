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
import { Settings, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryManagementDialogProps {
  categories: string[];
  onSaveCategories: (categories: string[]) => void;
}

export const CategoryManagementDialog = ({ categories, onSaveCategories }: CategoryManagementDialogProps) => {
  const [open, setOpen] = useState(false);
  const [editedCategories, setEditedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (open) {
      setEditedCategories([...categories]);
    }
  }, [open, categories]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !editedCategories.includes(newCategory.trim())) {
      setEditedCategories([...editedCategories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setEditedCategories(editedCategories.filter(c => c !== category));
  };

  const handleSave = () => {
    if (editedCategories.length > 0) {
      onSaveCategories(editedCategories);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Uredi kategorije
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upravljanje kategorijama</DialogTitle>
          <DialogDescription>
            Dodajte ili uklonite kategorije za vaše transakcije.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="newCategory">Nova kategorija</Label>
            <div className="flex gap-2">
              <Input
                id="newCategory"
                placeholder="Unesi ime kategorije"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button type="button" onClick={handleAddCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Trenutne kategorije</Label>
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-2 border rounded-md">
              {editedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="text-sm py-1 px-3">
                  {category}
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {editedCategories.length === 0 && (
                <p className="text-sm text-muted-foreground">Nema kategorija</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Otkaži
            </Button>
            <Button onClick={handleSave} disabled={editedCategories.length === 0}>
              Sačuvaj
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};