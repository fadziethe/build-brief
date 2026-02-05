import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useProjects } from "@/hooks/useProjects";
import { Loader2 } from "lucide-react";

const statusConfig = {
  "in-progress": { label: "In Progress", fill: "hsl(var(--chart-1))" },
  planning: { label: "Planning", fill: "hsl(var(--chart-2))" },
  "on-hold": { label: "On Hold", fill: "hsl(var(--chart-4))" },
  completed: { label: "Completed", fill: "hsl(var(--chart-3))" },
};

export function ProjectStatusChart() {
  const { data: projects = [], isLoading } = useProjects();

  // Calculate status distribution from real data
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status: statusConfig[status as keyof typeof statusConfig]?.label || status,
    count,
    fill: statusConfig[status as keyof typeof statusConfig]?.fill || "hsl(var(--chart-5))",
  }));

  if (isLoading) {
    return (
      <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "300ms" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (statusData.length === 0) {
    return (
      <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "300ms" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No projects to display
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "300ms" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="count"
                nameKey="status"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number, name: string) => [
                  `${value} project${value > 1 ? "s" : ""}`,
                  name,
                ]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
