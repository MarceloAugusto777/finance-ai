import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loading } from "@/components/ui/loading";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro na autenticação:", error);
          navigate("/auth/login");
          return;
        }

        if (data.session) {
          // Autenticação bem-sucedida
          navigate("/dashboard");
        } else {
          // Sem sessão, redirecionar para login
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Erro ao processar callback:", error);
        navigate("/auth/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <Loading />
        <p className="mt-4 text-gray-600">Processando autenticação...</p>
      </div>
    </div>
  );
} 