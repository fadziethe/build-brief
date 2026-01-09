import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProjectsTable } from "@/components/dashboard/ProjectsTable";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { useCreateProject } from "@/hooks/useProjects";

const Projects = () => {
  const [showForm, setShowForm] = useState(false);
  const createProject = useCreateProject();

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
        </div>
        <ProjectsTable onAddProject={() => setShowForm(true)} />
        <ProjectFormDialog
          open={showForm}
          onOpenChange={setShowForm}
          onSubmit={(project) => {
            createProject.mutate(project, {
              onSuccess: () => setShowForm(false),
            });
          }}
          isLoading={createProject.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default Projects;
