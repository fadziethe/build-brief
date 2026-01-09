import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Expense, expenseCategories } from "@/hooks/useExpenses";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const categoryColors: Record<string, string> = {
  labor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  materials: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  equipment: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  permits: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  subcontractors: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  transport: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  utilities: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export const ExpenseList = ({ expenses, onDelete }: ExpenseListProps) => {
  const getCategoryLabel = (category: string) => {
    return expenseCategories.find((c) => c.value === category)?.label || category;
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No expenses recorded yet. Click "Add Expense" to start tracking.
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">
                  {format(new Date(expense.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={categoryColors[expense.category]}>
                    {getCategoryLabel(expense.category)}
                  </Badge>
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(Number(expense.amount))}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>
      </div>
    </div>
  );
};
