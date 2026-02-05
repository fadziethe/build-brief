import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberInsert {
  name: string;
  role: string;
  email: string;
  phone?: string;
  status?: string;
}

export const useTeamMembers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: teamMembers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TeamMember[];
    },
    enabled: !!user,
  });

  const createTeamMember = useMutation({
    mutationFn: async (member: TeamMemberInsert) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("team_members")
        .insert({
          ...member,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
      toast.success("Team member added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add team member: ${error.message}`);
    },
  });

  const updateTeamMember = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<TeamMember> & { id: string }) => {
      const { data, error } = await supabase
        .from("team_members")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
      toast.success("Team member updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update team member: ${error.message}`);
    },
  });

  const deleteTeamMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
      toast.success("Team member removed successfully");
    },
    onError: (error) => {
      toast.error(`Failed to remove team member: ${error.message}`);
    },
  });

  return {
    teamMembers,
    isLoading,
    error,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
};
