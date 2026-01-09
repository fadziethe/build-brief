import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, DollarSign, Wallet, TrendingDown, PiggyBank, Plus, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProject } from "@/hooks/useProjects";
import { useExpenses, useCreateExpense, useDeleteExpense, ExpenseCategory } from "@/hooks/useExpenses";
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
  const { data: project, isLoading: projectLoading } = useProject(id || "");
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses(id || "");
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const totalExpenses = useMemo(() => 
    expenses.reduce((sum, e) => sum + Number(e.amount), 0), 
    [expenses]
  );

  if (projectLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

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

  const totalSpent = Number(project.spent) + totalExpenses;
  const remainingFromInitial = Number(project.initial_amount) - totalSpent;
  const remainingBudget = Number(project.budget) - totalSpent;
  const budgetUsedPercent = (totalSpent / Number(project.budget)) * 100;

  const handleAddExpense = (expense: { date: string; description: string; amount: number; category: ExpenseCategory }) => {
    createExpense.mutate({
      project_id: project.id,
      ...expense,
    }, {
      onSuccess: () => setShowExpenseForm(false),
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpense.mutate({ id: expenseId, projectId: project.id });
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
                {formatCurrency(Number(project.initial_amount))}
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
              <div className="text-2xl font-bold">{formatCurrency(Number(project.budget))}</div>
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
                {formatCurrency(totalSpent)}
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
                  {formatCurrency(totalSpent)} / {formatCurrency(Number(project.budget))}
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
                isLoading={createExpense.isPending}
              />
            )}
            {expensesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ExpenseList 
                expenses={expenses} 
                onDelete={handleDeleteExpense} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
