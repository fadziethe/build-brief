-- Create expense category enum
CREATE TYPE public.expense_category AS ENUM (
  'labor',
  'materials',
  'equipment',
  'permits',
  'subcontractors',
  'transport',
  'utilities',
  'other'
);

-- Create project status enum
CREATE TYPE public.project_status AS ENUM (
  'planning',
  'in-progress',
  'on-hold',
  'completed'
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'planning',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  initial_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  budget DECIMAL(15, 2) NOT NULL DEFAULT 0,
  spent DECIMAL(15, 2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  manager TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  category expense_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects (allow all authenticated users for now)
CREATE POLICY "Authenticated users can view all projects"
ON public.projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (true);

-- Create RLS policies for expenses
CREATE POLICY "Authenticated users can view all expenses"
ON public.expenses FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert expenses"
ON public.expenses FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update expenses"
ON public.expenses FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete expenses"
ON public.expenses FOR DELETE
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on projects
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_expenses_project_id ON public.expenses(project_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_projects_status ON public.projects(status);