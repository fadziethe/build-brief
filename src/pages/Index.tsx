import { Building2, FolderOpen, TrendingUp, DollarSign, CheckCircle, AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { ProjectProgressChart } from "@/components/dashboard/ProjectProgressChart";
import { ProjectStatusChart } from "@/components/dashboard/ProjectStatusChart";
import { BudgetTrendChart } from "@/components/dashboard/BudgetTrendChart";
import { ProjectsTable } from "@/components/dashboard/ProjectsTable";
import { useProjects } from "@/hooks/useProjects";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const Index = () => {
  const { data: projects = [], isLoading } = useProjects();

  // Calculate KPIs from real data
  const kpiData = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === "in-progress").length;
    const totalBudget = projects.reduce((acc, p) => acc + Number(p.budget), 0);
    const totalSpent = projects.reduce((acc, p) => acc + Number(p.spent), 0);
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const completionRate = totalProjects > 0 
      ? Math.round((completedProjects / totalProjects) * 100) 
      : 0;
    const onTrackProjects = projects.filter(
      (p) => Number(p.spent) <= Number(p.budget) * (p.progress / 100) * 1.1
    ).length;

    return {
      totalProjects,
      activeProjects,
      totalBudget,
      totalSpent,
      completionRate,
      onTrackProjects,
    };
  }, [projects]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your construction projects and performance metrics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-lg" />
            ))
          ) : (
            <>
              <KPICard
                title="Total Projects"
                value={kpiData.totalProjects}
                subtitle="All time"
                icon={Building2}
                delay={0}
              />
              <KPICard
                title="Active Projects"
                value={kpiData.activeProjects}
                subtitle="Currently running"
                icon={FolderOpen}
                variant="primary"
                delay={50}
              />
              <KPICard
                title="Total Budget"
                value={formatCurrency(kpiData.totalBudget)}
                subtitle="Allocated funds"
                icon={DollarSign}
                delay={100}
              />
              <KPICard
                title="Total Spent"
                value={formatCurrency(kpiData.totalSpent)}
                subtitle="Across all projects"
                icon={TrendingUp}
                trend={kpiData.totalBudget > 0 ? { 
                  value: Math.round((kpiData.totalSpent / kpiData.totalBudget) * 100) / 10, 
                  isPositive: kpiData.totalSpent <= kpiData.totalBudget 
                } : undefined}
                delay={150}
              />
              <KPICard
                title="Completion Rate"
                value={`${kpiData.completionRate}%`}
                subtitle="Projects finished"
                icon={CheckCircle}
                variant="success"
                delay={200}
              />
              <KPICard
                title="On Track"
                value={kpiData.onTrackProjects}
                subtitle="Within budget"
                icon={AlertTriangle}
                variant="accent"
                delay={250}
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ProjectProgressChart />
          </div>
          <ProjectStatusChart />
        </div>

        {/* Budget Trend */}
        <BudgetTrendChart />

        {/* Projects Table */}
        <ProjectsTable />
      </div>
    </DashboardLayout>
  );
};

export default Index;
