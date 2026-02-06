import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { projectSchema, projectBaseSchema, formatZodError } from "@/lib/validations";

export type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed";

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  initial_amount: number;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  manager: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  client: string;
  description?: string;
  status?: ProjectStatus;
  progress?: number;
  initial_amount: number;
  budget: number;
  start_date: string;
  end_date: string;
  manager: string;
}

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (project: CreateProjectInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to create a project");
      
      // Validate input before database operation
      const validationResult = projectSchema.safeParse(project);
      if (!validationResult.success) {
        throw new Error(formatZodError(validationResult.error));
      }

      const validatedData = validationResult.data;

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: validatedData.name,
          client: validatedData.client,
          description: validatedData.description || null,
          status: validatedData.status,
          progress: validatedData.progress,
          initial_amount: validatedData.initial_amount,
          budget: validatedData.budget,
          start_date: validatedData.start_date,
          end_date: validatedData.end_date,
          manager: validatedData.manager,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      // Validate input before database operation (partial validation for updates)
      const updateData: Record<string, unknown> = {};
      
      if (updates.name !== undefined) {
        const result = projectBaseSchema.shape.name.safeParse(updates.name);
        if (!result.success) throw new Error(formatZodError(result.error));
        updateData.name = result.data;
      }
      if (updates.client !== undefined) {
        const result = projectBaseSchema.shape.client.safeParse(updates.client);
        if (!result.success) throw new Error(formatZodError(result.error));
        updateData.client = result.data;
      }
      if (updates.description !== undefined) {
        const result = projectBaseSchema.shape.description.safeParse(updates.description);
        if (!result.success) throw new Error(formatZodError(result.error));
        updateData.description = result.data || null;
      }
      if (updates.status !== undefined) {
        const result = projectBaseSchema.shape.status.safeParse(updates.status);
        if (!result.success) throw new Error(formatZodError(result.error));
        updateData.status = result.data;
      }
      if (updates.progress !== undefined) {
        const result = projectBaseSchema.shape.progress.safeParse(updates.progress);
        if (!result.success) throw new Error(formatZodError(result.error));
        updateData.progress = result.data;
      }
      if (updates.initial_amount !== undefined) {
        const result = projectBaseSchema.shape.initial_amount.safeParse(updates.initial_amount);
        if (!result.success) throw new Error(formatZodError(result.error));
        updateData.initial_amount = result.data;
      }
      if (updates.budget !== undefined) {
        const result = projectBaseSchema.shape.budget.safeParse(updates.budget);
        if (!result.success) throw new Error(formatZodError(result.error));
        updateData.budget = result.data;
      }
      if (updates.manager !== undefined) {
        const result = projectBaseSchema.shape.manager.safeParse(updates.manager);
        if (!result.success) throw new Error(formatZodError(result.error));
        updateData.manager = result.data;
      }
      // Handle date validation together if both are being updated
      if (updates.start_date !== undefined) updateData.start_date = updates.start_date;
      if (updates.end_date !== undefined) updateData.end_date = updates.end_date;

      const { data, error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", data.id] });
      toast.success("Project updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update project");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });
};
