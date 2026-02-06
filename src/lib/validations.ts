import { z } from "zod";

// Team Member Validation Schema
export const teamMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  role: z
    .string()
    .trim()
    .min(2, "Role must be at least 2 characters")
    .max(100, "Role must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "on-leave"]).optional().default("active"),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

// Project Base Schema (without refinements, for partial validation)
export const projectBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(200, "Name must be less than 200 characters"),
  client: z
    .string()
    .trim()
    .min(1, "Client name is required")
    .max(200, "Client name must be less than 200 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(["planning", "in-progress", "on-hold", "completed"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  initial_amount: z.number().nonnegative("Initial amount must be positive"),
  budget: z.number().nonnegative("Budget must be positive"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  manager: z
    .string()
    .trim()
    .min(1, "Manager name is required")
    .max(200, "Manager name must be less than 200 characters"),
});

// Project Validation Schema (with date refinement for full validation)
export const projectSchema = projectBaseSchema.refine(
  (data) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return end >= start;
  },
  {
    message: "End date must be on or after start date",
    path: ["end_date"],
  }
);

export type ProjectInput = z.infer<typeof projectSchema>;

// Expense Validation Schema
export const expenseSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  date: z.string().min(1, "Date is required"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  amount: z.number().positive("Amount must be greater than zero"),
  category: z.enum([
    "labor",
    "materials",
    "equipment",
    "permits",
    "subcontractors",
    "transport",
    "utilities",
    "other",
  ]),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

// Auth Validation Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(255, "Email must be less than 255 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(72, "Password must be less than 72 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

// Helper function to format Zod errors
export function formatZodError(error: z.ZodError): string {
  return error.errors.map((e) => e.message).join(", ");
}
