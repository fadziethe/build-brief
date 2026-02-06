import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { teamMemberSchema, formatZodError } from "@/lib/validations";

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

      // Validate input before database operation
      const validationResult = teamMemberSchema.safeParse(member);
      if (!validationResult.success) {
        throw new Error(formatZodError(validationResult.error));
      }

      const validatedData = validationResult.data;

      const { data, error } = await supabase
        .from("team_members")
        .insert({
          name: validatedData.name,
          role: validatedData.role,
          email: validatedData.email,
          phone: validatedData.phone || null,
          status: validatedData.status,
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
      // Validate input before database operation (partial validation for updates)
      const updateData: Record<string, unknown> = {};
      
      if (updates.name !== undefined) {
        const nameResult = teamMemberSchema.shape.name.safeParse(updates.name);
        if (!nameResult.success) throw new Error(formatZodError(nameResult.error));
        updateData.name = nameResult.data;
      }
      if (updates.role !== undefined) {
        const roleResult = teamMemberSchema.shape.role.safeParse(updates.role);
        if (!roleResult.success) throw new Error(formatZodError(roleResult.error));
        updateData.role = roleResult.data;
      }
      if (updates.email !== undefined) {
        const emailResult = teamMemberSchema.shape.email.safeParse(updates.email);
        if (!emailResult.success) throw new Error(formatZodError(emailResult.error));
        updateData.email = emailResult.data;
      }
      if (updates.phone !== undefined) {
        const phoneResult = teamMemberSchema.shape.phone.safeParse(updates.phone);
        if (!phoneResult.success) throw new Error(formatZodError(phoneResult.error));
        updateData.phone = phoneResult.data || null;
      }
      if (updates.status !== undefined) {
        const statusResult = teamMemberSchema.shape.status.safeParse(updates.status);
        if (!statusResult.success) throw new Error(formatZodError(statusResult.error));
        updateData.status = statusResult.data;
      }

      const { data, error } = await supabase
        .from("team_members")
        .update(updateData)
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
