import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: ReactNode;
  requireEmailConfirmation?: boolean;
}

export function ProtectedRoute({ children, requireEmailConfirmation = false }: ProtectedRouteProps) {
  const { isAuthenticated, loading, isEmailConfirmed } = useAuthContext();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <Loading />;
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Se requer confirmação de email e não foi confirmado
  if (requireEmailConfirmation && !isEmailConfirmed) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // Se está autenticado e tudo ok, mostrar o conteúdo
  return <>{children}</>;
} 