import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Document {
  id: string;
  user_id: string;
  project_id: string | null;
  name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

export const useDocuments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: documents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Document[];
    },
    enabled: !!user,
  });

  const uploadDocument = useMutation({
    mutationFn: async ({
      file,
      projectId,
    }: {
      file: File;
      projectId?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get file type category
      const fileType = getFileType(file.name);

      // Save metadata to documents table
      const { data, error: dbError } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          project_id: projectId || null,
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: fileType,
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document uploaded successfully");
    },
    onError: (error) => {
      toast.error(`Failed to upload document: ${error.message}`);
    },
  });

  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (error: any) {
      toast.error(`Failed to download: ${error.message}`);
    }
  };

  const deleteDocument = useMutation({
    mutationFn: async (document: Document) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", document.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });

  return {
    documents,
    isLoading,
    error,
    uploadDocument,
    downloadDocument,
    deleteDocument,
  };
};

function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext || "")) return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || ""))
    return "image";
  if (["doc", "docx"].includes(ext || "")) return "document";
  if (["xls", "xlsx"].includes(ext || "")) return "spreadsheet";
  if (["zip", "rar", "7z"].includes(ext || "")) return "archive";
  return "file";
}
