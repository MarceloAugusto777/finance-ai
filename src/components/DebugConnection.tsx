import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export function DebugConnection() {
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "not_authenticated" | "error">("loading");
  const [tablesStatus, setTablesStatus] = useState<"loading" | "success" | "error">("loading");
  const [tables, setTables] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Testar autenticação
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        setErrors(prev => [...prev, `Erro de autenticação: ${authError.message}`]);
        setAuthStatus("error");
      } else if (session) {
        setAuthStatus("authenticated");
      } else {
        setAuthStatus("not_authenticated");
      }

      // Testar acesso às tabelas
      const { data: tablesData, error: tablesError } = await supabase
        .from("entradas")
        .select("count")
        .limit(1);

      if (tablesError) {
        setErrors(prev => [...prev, `Erro ao acessar tabela entradas: ${tablesError.message}`]);
        setTablesStatus("error");
      } else {
        setTablesStatus("success");
        setTables(["entradas"]);
      }

      // Testar outras tabelas
      const testTables = ["saidas", "clientes", "cobrancas"];
      
      for (const table of testTables) {
        try {
          const { error } = await supabase
            .from(table)
            .select("count")
            .limit(1);
          
          if (!error) {
            setTables(prev => [...prev, table]);
          } else {
            setErrors(prev => [...prev, `Erro ao acessar tabela ${table}: ${error.message}`]);
          }
        } catch (error) {
          setErrors(prev => [...prev, `Erro geral ao acessar tabela ${table}: ${error}`]);
        }
      }

    } catch (error) {
      setErrors(prev => [...prev, `Erro geral: ${error}`]);
      setAuthStatus("error");
      setTablesStatus("error");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "authenticated":
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "loading":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "authenticated":
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "loading":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Debug de Conexão
          <Button variant="outline" size="sm" onClick={testConnection}>
            Testar Novamente
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status de Autenticação */}
        <div className="flex items-center justify-between">
          <span>Status de Autenticação:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(authStatus)}
            <Badge className={getStatusColor(authStatus)}>
              {authStatus === "loading" && "Verificando..."}
              {authStatus === "authenticated" && "Autenticado"}
              {authStatus === "not_authenticated" && "Não Autenticado"}
              {authStatus === "error" && "Erro"}
            </Badge>
          </div>
        </div>

        {/* Status das Tabelas */}
        <div className="flex items-center justify-between">
          <span>Status das Tabelas:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(tablesStatus)}
            <Badge className={getStatusColor(tablesStatus)}>
              {tablesStatus === "loading" && "Verificando..."}
              {tablesStatus === "success" && "Acessível"}
              {tablesStatus === "error" && "Erro"}
            </Badge>
          </div>
        </div>

        {/* Tabelas Encontradas */}
        {tables.length > 0 && (
          <div>
            <span className="text-sm font-medium">Tabelas Acessíveis:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {tables.map(table => (
                <Badge key={table} variant="secondary">
                  {table}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Erros */}
        {errors.length > 0 && (
          <div>
            <span className="text-sm font-medium text-red-600">Erros Encontrados:</span>
            <div className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 