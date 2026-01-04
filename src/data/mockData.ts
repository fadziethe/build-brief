export interface Project {
  id: string;
  name: string;
  client: string;
  status: "planning" | "in-progress" | "on-hold" | "completed";
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  manager: string;
}

export interface BudgetTrend {
  month: string;
  budget: number;
  actual: number;
}

export interface ProjectStatus {
  status: string;
  count: number;
  fill: string;
}

export const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "Sunset Tower Complex",
    client: "Meridian Holdings",
    status: "in-progress",
    progress: 68,
    budget: 4500000,
    spent: 3060000,
    startDate: "2025-03-15",
    endDate: "2026-08-30",
    manager: "Sarah Chen",
  },
  {
    id: "PRJ-002",
    name: "Harbor Bridge Renovation",
    client: "City Council",
    status: "in-progress",
    progress: 45,
    budget: 8200000,
    spent: 3690000,
    startDate: "2025-01-10",
    endDate: "2026-12-15",
    manager: "Michael Torres",
  },
  {
    id: "PRJ-003",
    name: "Green Valley Mall",
    client: "Retail Ventures Ltd",
    status: "planning",
    progress: 12,
    budget: 12000000,
    spent: 1440000,
    startDate: "2025-06-01",
    endDate: "2027-06-30",
    manager: "Emily Rodriguez",
  },
  {
    id: "PRJ-004",
    name: "Metro Station Expansion",
    client: "Transit Authority",
    status: "on-hold",
    progress: 33,
    budget: 6800000,
    spent: 2244000,
    startDate: "2024-11-20",
    endDate: "2026-05-15",
    manager: "James Wilson",
  },
  {
    id: "PRJ-005",
    name: "Riverside Apartments",
    client: "Urban Living Co",
    status: "completed",
    progress: 100,
    budget: 3200000,
    spent: 3040000,
    startDate: "2024-02-01",
    endDate: "2025-10-30",
    manager: "Lisa Park",
  },
  {
    id: "PRJ-006",
    name: "Industrial Warehouse Hub",
    client: "LogiCorp",
    status: "in-progress",
    progress: 78,
    budget: 2100000,
    spent: 1638000,
    startDate: "2025-04-10",
    endDate: "2025-12-20",
    manager: "David Kim",
  },
];

export const budgetTrends: BudgetTrend[] = [
  { month: "Jul", budget: 2800000, actual: 2650000 },
  { month: "Aug", budget: 3200000, actual: 3100000 },
  { month: "Sep", budget: 3500000, actual: 3700000 },
  { month: "Oct", budget: 3800000, actual: 3650000 },
  { month: "Nov", budget: 4200000, actual: 4100000 },
  { month: "Dec", budget: 4500000, actual: 4350000 },
];

export const projectStatusData: ProjectStatus[] = [
  { status: "In Progress", count: 3, fill: "hsl(var(--chart-1))" },
  { status: "Planning", count: 1, fill: "hsl(var(--chart-2))" },
  { status: "On Hold", count: 1, fill: "hsl(var(--chart-4))" },
  { status: "Completed", count: 1, fill: "hsl(var(--chart-3))" },
];

export const projectProgressData = projects.map((p) => ({
  name: p.name.split(" ").slice(0, 2).join(" "),
  progress: p.progress,
  fill: p.status === "completed" 
    ? "hsl(var(--chart-3))" 
    : p.status === "in-progress" 
    ? "hsl(var(--chart-1))" 
    : p.status === "on-hold"
    ? "hsl(var(--chart-4))"
    : "hsl(var(--chart-2))",
}));

export const kpiData = {
  totalProjects: projects.length,
  activeProjects: projects.filter((p) => p.status === "in-progress").length,
  totalBudget: projects.reduce((acc, p) => acc + p.budget, 0),
  totalSpent: projects.reduce((acc, p) => acc + p.spent, 0),
  completionRate: Math.round(
    (projects.filter((p) => p.status === "completed").length / projects.length) * 100
  ),
  onTrackProjects: projects.filter((p) => p.spent <= p.budget * (p.progress / 100) * 1.1).length,
};
