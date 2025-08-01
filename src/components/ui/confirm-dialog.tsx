import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "destructive" | "warning" | "info";
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  variant = "destructive",
  icon
}: ConfirmDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          icon: <Trash2 className="w-6 h-6 text-red-600" />,
          button: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200 dark:border-red-800"
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          button: "bg-yellow-600 hover:bg-yellow-700 text-white",
          border: "border-yellow-200 dark:border-yellow-800"
        };
      case "info":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          border: "border-blue-200 dark:border-blue-800"
        };
      default:
        return {
          icon: <Trash2 className="w-6 h-6 text-red-600" />,
          button: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200 dark:border-red-800"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] animate-in fade-in-0 zoom-in-95 duration-200">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-3 rounded-full bg-opacity-10",
              variant === "destructive" && "bg-red-100 dark:bg-red-900/20",
              variant === "warning" && "bg-yellow-100 dark:bg-yellow-900/20",
              variant === "info" && "bg-blue-100 dark:bg-blue-900/20"
            )}>
              {icon || styles.icon}
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel asChild>
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none"
            >
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              className={cn("flex-1 sm:flex-none", styles.button)}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 