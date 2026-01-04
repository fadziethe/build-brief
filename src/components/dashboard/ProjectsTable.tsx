import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusStyles = {
  "in-progress": "bg-primary/10 text-primary border-primary/20",
  planning: "bg-accent/10 text-accent border-accent/20",
  "on-hold": "bg-warning/10 text-warning border-warning/20",
  completed: "bg-success/10 text-success border-success/20",
};

const statusLabels = {
  "in-progress": "In Progress",
  planning: "Planning",
  "on-hold": "On Hold",
  completed: "Completed",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export function ProjectsTable() {
  return (
    <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "500ms" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Active Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Project</TableHead>
                <TableHead className="text-muted-foreground font-medium">Client</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Progress</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Budget</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Spent</TableHead>
                <TableHead className="text-muted-foreground font-medium">Manager</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.client}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("font-medium", statusStyles[project.status])}
                    >
                      {statusLabels[project.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <Progress value={project.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium text-muted-foreground w-10">
                        {project.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(project.budget)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "font-medium",
                        project.spent > project.budget * (project.progress / 100) * 1.1
                          ? "text-destructive"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatCurrency(project.spent)}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.manager}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
