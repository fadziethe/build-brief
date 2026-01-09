import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, DollarSign, Wallet, TrendingDown, PiggyBank, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projects, expenses as initialExpenses, Expense, ExpenseCategory, expenseCategories } from "@/data/mockData";
import { ExpenseForm } from "@/components/projects/ExpenseForm";
import { ExpenseList } from "@/components/projects/ExpenseList";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const statusColors = {
  planning: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "in-progress": "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "on-hold": "bg-chart-4/10 text-chart-4 border-chart-4/20",
  completed: "bg-chart-3/10 text-chart-3 border-chart-3/20",
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);
  
  const [projectExpenses, setProjectExpenses] = useState<Expense[]>(
    initialExpenses.filter((e) => e.projectId === id)
  );
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const totalExpenses = useMemo(() => 
    projectExpenses.reduce((sum, e) => sum + e.amount, 0), 
    [projectExpenses]
  );

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Link to="/projects">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const remainingFromInitial = project.initialAmount - project.spent - totalExpenses;
  const remainingBudget = project.budget - project.spent - totalExpenses;
  const budgetUsedPercent = ((project.spent + totalExpenses) / project.budget) * 100;

  const handleAddExpense = (expense: Omit<Expense, "id" | "projectId">) => {
    const newExpense: Expense = {
      ...expense,
      id: `EXP-${Date.now()}`,
      projectId: project.id,
    };
    setProjectExpenses((prev) => [newExpense, ...prev]);
    setShowExpenseForm(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setProjectExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                <Badge variant="outline" className={statusColors[project.status]}>
                  {project.status.replace("-", " ")}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {project.client} • Managed by {project.manager}
              </p>
            </div>
          </div>
        </div>

        {/* Project Description */}
        {project.description && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Financial Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Initial Amount</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(project.initialAmount)}
              </div>
              <p className="text-xs text-muted-foreground">Amount received for project</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budgeted Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(project.budget)}</div>
              <p className="text-xs text-muted-foreground">Planned project budget</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(project.spent + totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                {budgetUsedPercent.toFixed(1)}% of budget used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remainingFromInitial >= 0 ? "text-chart-3" : "text-destructive"}`}>
                {formatCurrency(remainingFromInitial)}
              </div>
              <p className="text-xs text-muted-foreground">From initial amount</p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent vs Budget</span>
                <span className="font-medium">
                  {formatCurrency(project.spent + totalExpenses)} / {formatCurrency(project.budget)}
                </span>
              </div>
              <Progress 
                value={Math.min(budgetUsedPercent, 100)} 
                className="h-3"
              />
              {remainingBudget < 0 && (
                <p className="text-sm text-destructive">
                  ⚠️ Over budget by {formatCurrency(Math.abs(remainingBudget))}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense Tracker Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expense Tracker</CardTitle>
            <Button onClick={() => setShowExpenseForm(!showExpenseForm)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {showExpenseForm && (
              <ExpenseForm 
                onSubmit={handleAddExpense} 
                onCancel={() => setShowExpenseForm(false)} 
              />
            )}
            <ExpenseList 
              expenses={projectExpenses} 
              onDelete={handleDeleteExpense} 
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
