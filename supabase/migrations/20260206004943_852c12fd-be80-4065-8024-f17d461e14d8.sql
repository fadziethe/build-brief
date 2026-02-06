-- Fix UPDATE policies to include WITH CHECK clause to prevent user_id modification

-- Fix team_members UPDATE policy
DROP POLICY IF EXISTS "Users can update own team members" ON public.team_members;

CREATE POLICY "Users can update own team members" 
ON public.team_members 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix projects UPDATE policy (same issue)
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;

CREATE POLICY "Users can update own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);