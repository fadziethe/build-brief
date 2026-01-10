-- Add length constraints for text fields
ALTER TABLE public.projects ADD CONSTRAINT check_name_length CHECK (length(name) <= 200);
ALTER TABLE public.projects ADD CONSTRAINT check_client_length CHECK (length(client) <= 200);
ALTER TABLE public.projects ADD CONSTRAINT check_manager_length CHECK (length(manager) <= 200);
ALTER TABLE public.projects ADD CONSTRAINT check_description_length CHECK (description IS NULL OR length(description) <= 2000);
ALTER TABLE public.expenses ADD CONSTRAINT check_expense_description_length CHECK (length(description) <= 500);

-- Add date validation
ALTER TABLE public.projects ADD CONSTRAINT check_valid_date_range CHECK (end_date >= start_date);

-- Add reasonable amount limits to prevent overflow and ensure positive values
ALTER TABLE public.projects ADD CONSTRAINT check_initial_amount_positive CHECK (initial_amount >= 0);
ALTER TABLE public.projects ADD CONSTRAINT check_budget_positive CHECK (budget >= 0);
ALTER TABLE public.projects ADD CONSTRAINT check_spent_positive CHECK (spent >= 0);