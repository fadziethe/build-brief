import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
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
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
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
