import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizes[size], className)} />
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-muted rounded", className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="finance-card animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
      </div>
      <div className="h-8 w-32 mb-4 bg-muted rounded animate-pulse" />
      <div className="h-10 w-full bg-muted rounded animate-pulse" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/20 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
            <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/40 rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }} />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">Carregando...</p>
          <p className="text-sm text-muted-foreground">Preparando seu dashboard</p>
        </div>
      </div>
    </div>
  );
}

export function DashboardLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="finance-card animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mb-4 animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="finance-card animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mb-4 animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="finance-card animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-4 animate-pulse" />
        <TableSkeleton rows={3} />
      </div>
    </div>
  );
}