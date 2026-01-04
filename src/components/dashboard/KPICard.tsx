import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "success" | "warning";
  delay?: number;
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary text-primary-foreground",
  accent: "gradient-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
};

const iconBgStyles = {
  default: "bg-muted text-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  accent: "bg-accent-foreground/20 text-accent-foreground",
  success: "bg-success-foreground/20 text-success-foreground",
  warning: "bg-warning-foreground/20 text-warning-foreground",
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  delay = 0,
}: KPICardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up border-0",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p
              className={cn(
                "text-sm font-medium",
                variant === "default" ? "text-muted-foreground" : "opacity-90"
              )}
            >
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p
                className={cn(
                  "text-xs",
                  variant === "default" ? "text-muted-foreground" : "opacity-80"
                )}
              >
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-sm">
                <span
                  className={cn(
                    "font-medium",
                    trend.isPositive ? "text-success" : "text-destructive",
                    variant !== "default" && "opacity-90"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
                <span className={variant === "default" ? "text-muted-foreground" : "opacity-70"}>
                  vs last month
                </span>
              </div>
            )}
          </div>
          <div className={cn("rounded-xl p-3", iconBgStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
