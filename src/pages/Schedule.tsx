import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/mockData";
import { Calendar, Clock } from "lucide-react";

const Schedule = () => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Project timelines and milestones
          </p>
        </div>

        <div className="grid gap-4">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className="border-0 shadow-lg animate-slide-up hover:shadow-xl transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-foreground">{project.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          project.status === "completed"
                            ? "bg-success/10 text-success border-success/20"
                            : project.status === "in-progress"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : project.status === "on-hold"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-accent/10 text-accent border-accent/20"
                        }
                      >
                        {project.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Start:</span>
                      <span className="font-medium">{formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">End:</span>
                      <span className="font-medium">{formatDate(project.endDate)}</span>
                    </div>
                  </div>

                  <div className="lg:w-48">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
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

export default Schedule;
