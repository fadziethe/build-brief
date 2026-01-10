-- Add user_id column to projects table for ownership tracking
ALTER TABLE public.projects ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Drop the existing overly permissive RLS policies for projects
DROP POLICY IF EXISTS "Authenticated users can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;

-- Create new owner-scoped RLS policies for projects
CREATE POLICY "Users can view own projects" 
ON public.projects FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" 
ON public.projects FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" 
ON public.projects FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" 
ON public.projects FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Drop existing overly permissive RLS policies for expenses
DROP POLICY IF EXISTS "Authenticated users can view all expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can insert expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can update expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can delete expenses" ON public.expenses;

-- Create new RLS policies for expenses that inherit access from the project owner
CREATE POLICY "Users can view expenses for own projects" 
ON public.expenses FOR SELECT 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = expenses.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can create expenses for own projects" 
ON public.expenses FOR INSERT 
TO authenticated 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = expenses.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can update expenses for own projects" 
ON public.expenses FOR UPDATE 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = expenses.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can delete expenses for own projects" 
ON public.expenses FOR DELETE 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = expenses.project_id 
  AND projects.user_id = auth.uid()
));