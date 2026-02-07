import { useRef, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Image,
  File,
  Download,
  Upload,
  Trash2,
  FileSpreadsheet,
  Archive,
  FolderOpen,
  FileImage,
  ClipboardList,
  Files,
} from "lucide-react";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DocumentCategory = "all" | "projects" | "blueprints" | "reports" | "general";

const getIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-6 w-6 text-destructive" />;
    case "image":
      return <Image className="h-6 w-6 text-green-500" />;
    case "spreadsheet":
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    case "archive":
      return <Archive className="h-6 w-6 text-amber-500" />;
    case "blueprint":
      return <FileImage className="h-6 w-6 text-sky-500" />;
    default:
      return <File className="h-6 w-6 text-primary" />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Helper to determine document category based on file name and type
const getDocumentCategory = (doc: Document): DocumentCategory => {
  const name = doc.name.toLowerCase();
  const type = doc.file_type.toLowerCase();
  
  // Blueprint detection
  if (
    name.includes("blueprint") ||
    name.includes("floor plan") ||
    name.includes("layout") ||
    name.includes("drawing") ||
    name.includes("cad") ||
    name.includes("dwg")
  ) {
    return "blueprints";
  }
  
  // Report detection
  if (
    name.includes("report") ||
    name.includes("analysis") ||
    name.includes("summary") ||
    name.includes("assessment") ||
    name.includes("audit") ||
    type === "spreadsheet"
  ) {
    return "reports";
  }
  
  // Project files - associated with a project
  if (doc.project_id) {
    return "projects";
  }
  
  return "general";
};

interface DocumentCardProps {
  doc: Document;
  index: number;
  projectName?: string;
  onDownload: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

const DocumentCard = ({ doc, index, projectName, onDownload, onDelete }: DocumentCardProps) => {
  const category = getDocumentCategory(doc);
  const categoryLabels: Record<DocumentCategory, { label: string; color: string }> = {
    all: { label: "All", color: "bg-muted text-muted-foreground" },
    projects: { label: "Project", color: "bg-primary/10 text-primary" },
    blueprints: { label: "Blueprint", color: "bg-blue-500/10 text-blue-500" },
    reports: { label: "Report", color: "bg-amber-500/10 text-amber-500" },
    general: { label: "General", color: "bg-muted text-muted-foreground" },
  };

  return (
    <Card
      className="border-0 shadow-lg animate-slide-up hover:shadow-xl transition-shadow"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            {getIcon(doc.file_type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground truncate">
                {doc.name}
              </h3>
              <Badge variant="secondary" className={categoryLabels[category].color}>
                {categoryLabels[category].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(doc.file_size)} • {formatDate(doc.created_at)}
              {projectName && ` • ${projectName}`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onDownload(doc)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Document</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{doc.name}"? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(doc)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Documents = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<DocumentCategory>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("none");
  const { documents, isLoading, uploadDocument, downloadDocument, deleteDocument } =
    useDocuments();
  const { data: projects = [] } = useProjects();

  // Create a map of project IDs to names
  const projectMap = new Map(projects.map((p) => [p.id, p.name]));

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        await uploadDocument.mutateAsync({
          file,
          projectId: selectedProjectId === "none" ? undefined : selectedProjectId,
        });
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Filter documents based on active tab
  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === "all") return true;
    return getDocumentCategory(doc) === activeTab;
  });

  // Count documents per category
  const categoryCounts = {
    all: documents.length,
    projects: documents.filter((d) => getDocumentCategory(d) === "projects").length,
    blueprints: documents.filter((d) => getDocumentCategory(d) === "blueprints").length,
    reports: documents.filter((d) => getDocumentCategory(d) === "reports").length,
    general: documents.filter((d) => getDocumentCategory(d) === "general").length,
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-10 w-full max-w-lg" />
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Project files, blueprints, and reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Link to project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip,.rar,.dwg,.svg"
            />
            <Button
              className="gap-2"
              onClick={handleUploadClick}
              disabled={uploadDocument.isPending}
            >
              <Upload className="h-4 w-4" />
              {uploadDocument.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DocumentCategory)}>
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="all" className="gap-2">
              <Files className="h-4 w-4" />
              <span className="hidden sm:inline">All</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {categoryCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {categoryCounts.projects}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="blueprints" className="gap-2">
              <FileImage className="h-4 w-4" />
              <span className="hidden sm:inline">Blueprints</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {categoryCounts.blueprints}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {categoryCounts.reports}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2">
              <File className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {categoryCounts.general}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredDocuments.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    {activeTab === "all" && <Files className="h-12 w-12 text-muted-foreground/50" />}
                    {activeTab === "projects" && <FolderOpen className="h-12 w-12 text-muted-foreground/50" />}
                    {activeTab === "blueprints" && <FileImage className="h-12 w-12 text-muted-foreground/50" />}
                    {activeTab === "reports" && <ClipboardList className="h-12 w-12 text-muted-foreground/50" />}
                    {activeTab === "general" && <File className="h-12 w-12 text-muted-foreground/50" />}
                    <p className="text-muted-foreground">
                      {activeTab === "all"
                        ? "No documents uploaded yet. Upload your first document to get started."
                        : `No ${activeTab} found. Upload documents or link them to projects.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {filteredDocuments.map((doc, index) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    index={index}
                    projectName={doc.project_id ? projectMap.get(doc.project_id) : undefined}
                    onDownload={downloadDocument}
                    onDelete={(d) => deleteDocument.mutate(d)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
