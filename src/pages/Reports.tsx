import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProjectProgressChart } from "@/components/dashboard/ProjectProgressChart";
import { ProjectStatusChart } from "@/components/dashboard/ProjectStatusChart";
import { BudgetTrendChart } from "@/components/dashboard/BudgetTrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

const Reports = () => {
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
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2">
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

        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Avg. Project Duration</p>
                <p className="text-2xl font-bold text-foreground mt-1">14.5 months</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Budget Utilization</p>
                <p className="text-2xl font-bold text-foreground mt-1">87.3%</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                <p className="text-2xl font-bold text-success mt-1">92%</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                <p className="text-2xl font-bold text-primary mt-1">4.8/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
