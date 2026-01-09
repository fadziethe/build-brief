export interface Expense {
  id: string;
  projectId: string;
  date: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
}

export type ExpenseCategory = 
  | "labor"
  | "materials"
  | "equipment"
  | "permits"
  | "subcontractors"
  | "transport"
  | "utilities"
  | "other";

export const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: "labor", label: "Labor" },
  { value: "materials", label: "Materials" },
  { value: "equipment", label: "Equipment" },
  { value: "permits", label: "Permits & Fees" },
  { value: "subcontractors", label: "Subcontractors" },
  { value: "transport", label: "Transport" },
  { value: "utilities", label: "Utilities" },
  { value: "other", label: "Other" },
];

export interface Project {
  id: string;
  name: string;
  client: string;
  status: "planning" | "in-progress" | "on-hold" | "completed";
  progress: number;
  initialAmount: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  manager: string;
  description?: string;
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
    initialAmount: 5000000,
    budget: 4500000,
    spent: 3060000,
    startDate: "2025-03-15",
    endDate: "2026-08-30",
    manager: "Sarah Chen",
    description: "A 25-story mixed-use development featuring residential units and retail spaces.",
  },
  {
    id: "PRJ-002",
    name: "Harbor Bridge Renovation",
    client: "City Council",
    status: "in-progress",
    progress: 45,
    initialAmount: 9000000,
    budget: 8200000,
    spent: 3690000,
    startDate: "2025-01-10",
    endDate: "2026-12-15",
    manager: "Michael Torres",
    description: "Complete renovation of the historic harbor bridge including structural reinforcement.",
  },
  {
    id: "PRJ-003",
    name: "Green Valley Mall",
    client: "Retail Ventures Ltd",
    status: "planning",
    progress: 12,
    initialAmount: 15000000,
    budget: 12000000,
    spent: 1440000,
    startDate: "2025-06-01",
    endDate: "2027-06-30",
    manager: "Emily Rodriguez",
    description: "Modern shopping complex with sustainable design and green spaces.",
  },
  {
    id: "PRJ-004",
    name: "Metro Station Expansion",
    client: "Transit Authority",
    status: "on-hold",
    progress: 33,
    initialAmount: 7500000,
    budget: 6800000,
    spent: 2244000,
    startDate: "2024-11-20",
    endDate: "2026-05-15",
    manager: "James Wilson",
    description: "Expansion of the central metro station with additional platforms.",
  },
  {
    id: "PRJ-005",
    name: "Riverside Apartments",
    client: "Urban Living Co",
    status: "completed",
    progress: 100,
    initialAmount: 3500000,
    budget: 3200000,
    spent: 3040000,
    startDate: "2024-02-01",
    endDate: "2025-10-30",
    manager: "Lisa Park",
    description: "Luxury waterfront apartment complex with 120 residential units.",
  },
  {
    id: "PRJ-006",
    name: "Industrial Warehouse Hub",
    client: "LogiCorp",
    status: "in-progress",
    progress: 78,
    initialAmount: 2500000,
    budget: 2100000,
    spent: 1638000,
    startDate: "2025-04-10",
    endDate: "2025-12-20",
    manager: "David Kim",
    description: "State-of-the-art logistics warehouse with automated systems.",
  },
];

export const expenses: Expense[] = [
  { id: "EXP-001", projectId: "PRJ-001", date: "2025-12-01", description: "Steel beams delivery", amount: 45000, category: "materials" },
  { id: "EXP-002", projectId: "PRJ-001", date: "2025-12-02", description: "Crane rental - week 1", amount: 12000, category: "equipment" },
  { id: "EXP-003", projectId: "PRJ-001", date: "2025-12-03", description: "Construction crew wages", amount: 28000, category: "labor" },
  { id: "EXP-004", projectId: "PRJ-001", date: "2025-12-04", description: "Electrical subcontractor", amount: 35000, category: "subcontractors" },
  { id: "EXP-005", projectId: "PRJ-001", date: "2025-12-05", description: "Building permit renewal", amount: 5000, category: "permits" },
  { id: "EXP-006", projectId: "PRJ-002", date: "2025-12-01", description: "Concrete mix delivery", amount: 22000, category: "materials" },
  { id: "EXP-007", projectId: "PRJ-002", date: "2025-12-02", description: "Safety equipment", amount: 8500, category: "equipment" },
  { id: "EXP-008", projectId: "PRJ-002", date: "2025-12-03", description: "Bridge inspection team", amount: 15000, category: "labor" },
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
