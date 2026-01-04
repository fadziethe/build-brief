import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProjectsTable } from "@/components/dashboard/ProjectsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Projects = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your construction projects
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
        <ProjectsTable />
      </div>
    </DashboardLayout>
  );
};

export default Projects;
