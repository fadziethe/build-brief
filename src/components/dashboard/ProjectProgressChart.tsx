import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useProjects } from "@/hooks/useProjects";
import { Loader2 } from "lucide-react";

const getProgressColor = (status: string) => {
  switch (status) {
    case "completed":
      return "hsl(var(--chart-3))";
    case "in-progress":
      return "hsl(var(--chart-1))";
    case "on-hold":
      return "hsl(var(--chart-4))";
    default:
      return "hsl(var(--chart-2))";
  }
};

export function ProjectProgressChart() {
  const { data: projects = [], isLoading } = useProjects();

  const progressData = projects.map((p) => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    progress: p.progress,
    fill: getProgressColor(p.status),
  }));

  if (isLoading) {
    return (
      <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "200ms" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Project Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (progressData.length === 0) {
    return (
      <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "200ms" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Project Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No projects to display
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "200ms" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={progressData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                formatter={(value: number) => [`${value}%`, "Progress"]}
              />
              <Bar dataKey="progress" radius={[0, 6, 6, 0]} barSize={24}>
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
