import { useState, forwardRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProjectProgressChart } from "@/components/dashboard/ProjectProgressChart";
import { ProjectStatusChart } from "@/components/dashboard/ProjectStatusChart";
import { BudgetTrendChart } from "@/components/dashboard/BudgetTrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Reports = () => {
  const { data: projects = [], isLoading } = useProjects();
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "planning",
    "in-progress",
    "on-hold",
    "completed",
  ]);

  const filteredProjects = projects.filter((p) =>
    statusFilter.includes(p.status)
  );

  const totalBudget = filteredProjects.reduce((sum, p) => sum + Number(p.budget), 0);
  const totalSpent = filteredProjects.reduce((sum, p) => sum + Number(p.spent), 0);
  const budgetUtilization = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : "0";

  const completedProjects = filteredProjects.filter(
    (p) => p.status === "completed"
  ).length;
  const onTimeDelivery =
    filteredProjects.length > 0
      ? ((completedProjects / filteredProjects.length) * 100).toFixed(0)
      : "0";

  const avgProgress =
    filteredProjects.length > 0
      ? (
          filteredProjects.reduce((sum, p) => sum + p.progress, 0) /
          filteredProjects.length
        ).toFixed(1)
      : "0";

  const handleExport = () => {
    // Generate CSV data
    const headers = [
      "Project Name",
      "Client",
      "Status",
      "Progress",
      "Budget",
      "Spent",
      "Start Date",
      "End Date",
    ];
    const rows = filteredProjects.map((p) => [
      p.name,
      p.client,
      p.status,
      `${p.progress}%`,
      p.budget.toString(),
      p.spent.toString(),
      p.start_date,
      p.end_date,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Report exported successfully");
  };

  const toggleStatus = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Analyze project performance and financial metrics
            </p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("planning")}
                  onCheckedChange={() => toggleStatus("planning")}
                >
                  Planning
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("in-progress")}
                  onCheckedChange={() => toggleStatus("in-progress")}
                >
                  In Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("on-hold")}
                  onCheckedChange={() => toggleStatus("on-hold")}
                >
                  On Hold
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("completed")}
                  onCheckedChange={() => toggleStatus("completed")}
                >
                  Completed
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProjectProgressChart />
          <ProjectStatusChart />
        </div>

        <BudgetTrendChart />

        <Card
          className="border-0 shadow-lg animate-slide-up"
          style={{ animationDelay: "300ms" }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Summary Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {filteredProjects.length}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Budget Utilization
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {budgetUtilization}%
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {completedProjects}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Avg. Progress</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {avgProgress}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
