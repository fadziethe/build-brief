import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useProjects } from "@/hooks/useProjects";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export function BudgetTrendChart() {
  const { data: projects = [], isLoading } = useProjects();

  // Generate budget trend data from real projects
  const budgetTrends = useMemo(() => {
    if (projects.length === 0) return [];

    // Get the last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        date,
      });
    }

    // Calculate cumulative budget and spent for each month
    const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget), 0);
    const totalSpent = projects.reduce((sum, p) => sum + Number(p.spent), 0);

    // Simulate a trend based on project progress
    return months.map((m, index) => {
      const progressFactor = (index + 1) / 6;
      return {
        month: m.month,
        budget: Math.round(totalBudget * progressFactor),
        actual: Math.round(totalSpent * progressFactor),
      };
    });
  }, [projects]);

  if (isLoading) {
    return (
      <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "400ms" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (budgetTrends.length === 0) {
    return (
      <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "400ms" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No budget data to display
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up border-0 shadow-lg" style={{ animationDelay: "400ms" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={budgetTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [formatCurrency(value)]}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="budget"
                name="Budget"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBudget)"
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorActual)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
