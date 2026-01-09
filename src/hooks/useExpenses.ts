import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ExpenseCategory = 
  | "labor"
  | "materials"
  | "equipment"
  | "permits"
  | "subcontractors"
  | "transport"
  | "utilities"
  | "other";

export interface Expense {
  id: string;
  project_id: string;
  date: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  created_at: string;
}

export interface CreateExpenseInput {
  project_id: string;
  date: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
}

export const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: "labor", label: "Labor" },
  { value: "materials", label: "Materials" },
  { value: "equipment", label: "Equipment" },
  { value: "permits", label: "Permits & Fees" },
  { value: "subcontractors", label: "Subcontractors" },
  { value: "transport", label: "Transport" },
  { value: "utilities", label: "Utilities" },
  { value: "other", label: "Other" },
];

export const useExpenses = (projectId: string) => {
  return useQuery({
    queryKey: ["expenses", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("project_id", projectId)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!projectId,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expense: CreateExpenseInput) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert(expense)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["expenses", data.project_id] });
      toast.success("Expense added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add expense");
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return { projectId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["expenses", data.projectId] });
      toast.success("Expense deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete expense");
    },
  });
};
