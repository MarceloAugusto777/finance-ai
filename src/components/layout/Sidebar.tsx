import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  Receipt,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Menu,
  X,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Entradas", href: "/entradas", icon: TrendingUp },
  { name: "Saídas", href: "/saidas", icon: TrendingDown },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Cobranças", href: "/cobrancas", icon: Receipt },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Metas", href: "/metas", icon: Target },
];

export function Sidebar({ className, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuthContext();
  const isMobile = useIsMobile();

  const handleNavigation = (href: string) => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        // Redirecionar para a landing page após logout
        navigate("/", { replace: true });
        if (isMobile && onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isMobile ? "w-full" : isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">FinanceAI</h1>
              <p className="text-xs text-sidebar-foreground/60">Dashboard Financeiro</p>
            </div>
          </div>
        )}
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        )}
        
        {isMobile && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                  : "text-sidebar-foreground/80"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <NavLink
          to="/configuracoes"
          onClick={() => handleNavigation("/configuracoes")}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
          )}
        >
          <Settings className="w-5 h-5" />
          {(!isCollapsed || isMobile) && <span className="truncate">Configurações</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
          )}
        >
          <LogOut className="w-5 h-5" />
          {(!isCollapsed || isMobile) && <span className="truncate">Sair</span>}
        </button>
      </div>
    </div>
  );
}