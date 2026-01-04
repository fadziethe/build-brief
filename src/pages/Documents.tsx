import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, File, Download, Upload, MoreVertical } from "lucide-react";

const documents = [
  { name: "Sunset Tower - Blueprint v3.pdf", type: "pdf", size: "12.4 MB", date: "Dec 28, 2025", project: "Sunset Tower Complex" },
  { name: "Harbor Bridge - Structural Analysis.pdf", type: "pdf", size: "8.7 MB", date: "Dec 26, 2025", project: "Harbor Bridge Renovation" },
  { name: "Site Photos - December.zip", type: "image", size: "245 MB", date: "Dec 24, 2025", project: "Green Valley Mall" },
  { name: "Budget Report Q4 2025.xlsx", type: "file", size: "1.2 MB", date: "Dec 22, 2025", project: "All Projects" },
  { name: "Safety Compliance Checklist.pdf", type: "pdf", size: "340 KB", date: "Dec 20, 2025", project: "Metro Station Expansion" },
  { name: "Client Meeting Notes.docx", type: "file", size: "89 KB", date: "Dec 18, 2025", project: "Riverside Apartments" },
];

const getIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-6 w-6 text-destructive" />;
    case "image":
      return <Image className="h-6 w-6 text-success" />;
    default:
      return <File className="h-6 w-6 text-primary" />;
  }
};

const Documents = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Project files, blueprints, and reports
            </p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>

        <div className="grid gap-3">
          {documents.map((doc, index) => (
            <Card
              key={doc.name}
              className="border-0 shadow-lg animate-slide-up hover:shadow-xl transition-shadow"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    {getIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.project}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm text-foreground">{doc.size}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
