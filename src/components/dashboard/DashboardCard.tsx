import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "danger" | "warning" | "info";
  className?: string;
  children?: ReactNode;
  formatAsCurrency?: boolean;
}

const variantStyles = {
  default: "border-border",
  success: "border-success/20 bg-success/5",
  danger: "border-danger/20 bg-danger/5", 
  warning: "border-warning/20 bg-warning/5",
  info: "border-info/20 bg-info/5"
};

const iconVariantStyles = {
  default: "text-primary",
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning", 
  info: "text-info"
};

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
  children,
  formatAsCurrency = false
}: DashboardCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (formatAsCurrency) {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL"
        }).format(val);
      } else {
        return new Intl.NumberFormat("pt-BR").format(val);
      }
    }
    return val;
  };

  return (
    <div className={cn(
      "finance-card animate-scale-in",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg bg-background/60",
            iconVariantStyles[variant]
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground/70">{subtitle}</p>
            )}
          </div>
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend.isPositive 
              ? "text-success bg-success/10" 
              : "text-danger bg-danger/10"
          )}>
            <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground animate-counter">
          {formatValue(value)}
        </div>
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}