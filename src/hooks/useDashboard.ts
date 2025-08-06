import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

export interface DashboardStats {
  totalEntradas: number;
  totalSaidas: number;
  saldoAtual: number;
  saldoPendente: number;
  totalClientes: number;
  totalCobrancas: number;
  cobrancasPendentes: number;
  cobrancasVencidas: number;
  transacoesRecentes: any[];
  entradasMes: any[];
  saidasMes: any[];
  entradasPagas: any[];
  entradasPendentes: any[];
  saidasPagas: any[];
  saidasAgendadas: any[];
  cobrancas: any[];
}

// Dados mock removidos - agora o sistema usa dados reais do banco

export function useDashboardStats() {
  const { sessionRestored, isAuthenticated } = useAuthContext();
  
  const queryResult = useQuery({
    queryKey: ["dashboard-stats"],
    enabled: sessionRestored && isAuthenticated, // Só executar quando a sessão estiver restaurada e o usuário autenticado
    queryFn: async () => {
      try {
        console.log("🔄 Iniciando busca de estatísticas do dashboard...");
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("❌ Erro ao obter usuário:", userError);
          throw new Error(`Erro de autenticação: ${userError.message}`);
        }
        
        if (!user) {
          console.error("❌ Usuário não autenticado");
          // Em desenvolvimento, usar dados mock se não há usuário
          if (import.meta.env.DEV) {
            console.log("🔧 Modo de desenvolvimento - usando dados de exemplo");
            return {
              totalEntradas: 0,
              totalSaidas: 0,
              saldoAtual: 0,
              saldoPendente: 0,
              totalClientes: 0,
              totalCobrancas: 0,
              cobrancasPendentes: 0,
              cobrancasVencidas: 0,
              transacoesRecentes: [],
              entradasMes: [],
              saidasMes: [],
              entradasPagas: [],
              entradasPendentes: [],
              saidasPagas: [],
              saidasAgendadas: [],
              cobrancas: []
            };
          }
          throw new Error("Usuário não autenticado");
        }

        console.log("👤 Usuário autenticado:", user.email);
        console.log("👤 User ID:", user.id);

        // Buscar dados diretamente do Supabase
        console.log("📊 Buscando dados das tabelas...");
        
        // Verificar se as tabelas existem e têm dados
        const { data: entradasCount, error: entradasCountError } = await supabase
          .from("entradas")
          .select("count", { count: "exact", head: true })
          .eq("user_id", user.id);
        
        const { data: saidasCount, error: saidasCountError } = await supabase
          .from("saidas")
          .select("count", { count: "exact", head: true })
          .eq("user_id", user.id);
        
        console.log("📊 Contagem de dados:", {
          entradas: entradasCount,
          saidas: saidasCount,
          entradasError: entradasCountError,
          saidasError: saidasCountError
        });

        // Se não há dados, verificar se há dados sem user_id (dados antigos)
        if (!entradasCount && !saidasCount) {
          console.log("⚠️ Nenhum dado encontrado para o usuário - verificando dados sem user_id...");
          
          const { data: entradasSemUserId, error: entradasSemUserIdError } = await supabase
            .from("entradas")
            .select("*")
            .is("user_id", null);
          
          const { data: saidasSemUserId, error: saidasSemUserIdError } = await supabase
            .from("saidas")
            .select("*")
            .is("user_id", null);
          
          console.log("📊 Dados sem user_id:", {
            entradas: entradasSemUserId?.length || 0,
            saidas: saidasSemUserId?.length || 0,
            entradasError: entradasSemUserIdError,
            saidasError: saidasSemUserIdError
          });
          
          // Se há dados sem user_id, associar ao usuário atual
          if (entradasSemUserId && entradasSemUserId.length > 0) {
            console.log("🔄 Associando entradas existentes ao usuário atual...");
            for (const entrada of entradasSemUserId) {
              await supabase
                .from("entradas")
                .update({ user_id: user.id })
                .eq("id", entrada.id);
            }
          }
          
          if (saidasSemUserId && saidasSemUserId.length > 0) {
            console.log("🔄 Associando saídas existentes ao usuário atual...");
            for (const saida of saidasSemUserId) {
              await supabase
                .from("saidas")
                .update({ user_id: user.id })
                .eq("id", saida.id);
            }
          }
        }

        const [entradasResult, saidasResult, clientesResult, cobrancasResult] = await Promise.all([
          supabase.from("entradas").select("*").eq("user_id", user.id),
          supabase.from("saidas").select("*").eq("user_id", user.id),
          supabase.from("clientes").select("*").eq("user_id", user.id),
          supabase.from("cobrancas").select("*").eq("user_id", user.id)
        ]);

        if (entradasResult.error) {
          console.error("❌ Erro ao buscar entradas:", entradasResult.error);
          throw entradasResult.error;
        }
        
        if (saidasResult.error) {
          console.error("❌ Erro ao buscar saídas:", saidasResult.error);
          throw saidasResult.error;
        }
        
        if (clientesResult.error) {
          console.error("❌ Erro ao buscar clientes:", clientesResult.error);
          throw clientesResult.error;
        }

        if (cobrancasResult.error) {
          console.error("❌ Erro ao buscar cobranças:", cobrancasResult.error);
          throw cobrancasResult.error;
        }

        const entradas = entradasResult.data || [];
        const saidas = saidasResult.data || [];
        const clientes = clientesResult.data || [];
        const cobrancas = cobrancasResult.data || [];

        console.log("📈 Dados carregados:", {
          entradas: entradas.length,
          saidas: saidas.length,
          clientes: clientes.length,
          cobrancas: cobrancas.length
        });

        // Log detalhado das saídas
        console.log("📊 Saídas carregadas:", saidas);
        console.log("📊 Entradas carregadas:", entradas);

        // Calcular totais do mês atual
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        console.log("📅 Filtro de data:", { currentMonth, currentYear });

        const entradasMes = entradas.filter((entrada: any) => {
          const data = new Date(entrada.data);
          const isCurrentMonth = data.getMonth() === currentMonth && data.getFullYear() === currentYear;
          console.log(`📅 Entrada ${entrada.id}: ${entrada.data} -> ${data.getMonth()}/${data.getFullYear()} -> ${isCurrentMonth ? 'INCLUÍDA' : 'EXCLUÍDA'}`);
          return isCurrentMonth;
        });

        const saidasMes = saidas.filter((saida: any) => {
          const data = new Date(saida.data);
          const isCurrentMonth = data.getMonth() === currentMonth && data.getFullYear() === currentYear;
          console.log(`📅 Saída ${saida.id}: ${saida.data} -> ${data.getMonth()}/${data.getFullYear()} -> ${isCurrentMonth ? 'INCLUÍDA' : 'EXCLUÍDA'}`);
          console.log(`📅 Detalhes da saída:`, {
            id: saida.id,
            data: saida.data,
            valor: saida.valor,
            descricao: saida.descricao,
            parsedDate: data,
            currentMonth,
            currentYear,
            isCurrentMonth
          });
          return isCurrentMonth;
        });

        console.log("📊 Entradas do mês atual:", entradasMes);
        console.log("📊 Saídas do mês atual:", saidasMes);

        // Separar entradas e saídas por status
        const entradasPagas = entradasMes.filter((e: any) => e.status === "pago");
        const entradasPendentes = entradasMes.filter((e: any) => e.status === "pendente");
        // Saídas não têm campo status, então todas são consideradas "pagas"
        const saidasPagas = saidasMes; // Todas as saídas são consideradas pagas
        const saidasAgendadas = []; // Saídas não têm status agendado

        // Calcular totais - incluir TODAS as transações do mês (pagas e pendentes)
        const totalEntradas = entradasMes.reduce((acc: number, entrada: any) => acc + Number(entrada.valor), 0);
        const totalSaidas = saidasMes.reduce((acc: number, saida: any) => acc + Number(saida.valor), 0);
        const saldoAtual = totalEntradas - totalSaidas;

        console.log("💰 Cálculo dos totais:", {
          entradasMes: entradasMes.length,
          saidasMes: saidasMes.length,
          totalEntradas,
          totalSaidas,
          saldoAtual
        });

        // Calcular saldo pendente (entradas pendentes - saídas agendadas)
        const totalEntradasPendentes = entradasPendentes.reduce((acc: number, entrada: any) => acc + Number(entrada.valor), 0);
        const totalSaidasAgendadas = 0; // Saídas não têm status agendado
        const saldoPendente = totalEntradasPendentes - totalSaidasAgendadas;

        // Calcular estatísticas de cobranças
        const totalCobrancas = cobrancas.length;
        const cobrancasPendentes = cobrancas.filter((c: any) => c.status === "pendente").length;
        const cobrancasVencidas = cobrancas.filter((c: any) => c.status === "vencido").length;

        // Transações recentes (últimas 5)
        const todasTransacoes = [
          ...entradas.map((e: any) => ({ ...e, tipo: 'entrada' })),
          ...saidas.map((s: any) => ({ ...s, tipo: 'saida' }))
        ].sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5);

        const result = {
          totalEntradas,
          totalSaidas,
          saldoAtual,
          saldoPendente,
          totalClientes: clientes.length,
          totalCobrancas,
          cobrancasPendentes,
          cobrancasVencidas,
          transacoesRecentes: todasTransacoes,
          entradasMes,
          saidasMes,
          entradasPagas,
          entradasPendentes,
          saidasPagas,
          saidasAgendadas,
          cobrancas
        };

        console.log("✅ Estatísticas calculadas:", result);
        return result;
        
      } catch (error) {
        console.error("❌ Erro geral em useDashboardStats:", error);
        // Em desenvolvimento, retornar dados mock em caso de erro
        if (import.meta.env.DEV) {
          console.log("🔧 Erro no carregamento - usando dados de exemplo");
          return {
            totalEntradas: 0,
            totalSaidas: 0,
            saldoAtual: 0,
            saldoPendente: 0,
            totalClientes: 0,
            totalCobrancas: 0,
            cobrancasPendentes: 0,
            cobrancasVencidas: 0,
            transacoesRecentes: [],
            entradasMes: [],
            saidasMes: [],
            entradasPagas: [],
            entradasPendentes: [],
            saidasPagas: [],
            saidasAgendadas: [],
            cobrancas: []
          };
        }
        throw error;
      }
    },
    staleTime: 0, // Sempre considerar stale para forçar atualização
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: false, // Desabilitar refetch automático
    refetchOnWindowFocus: true, // Atualizar quando a janela ganha foco
    refetchOnMount: true, // Atualizar quando o componente é montado
    retry: (failureCount, error) => {
      console.log(`🔄 Tentativa ${failureCount + 1} de buscar estatísticas. Erro:`, error);
      return failureCount < 2; // Tentar apenas 2 vezes
    },
  });

  console.log("📊 useDashboardStats - Estado da query:", {
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isStale: queryResult.isStale,
    dataUpdatedAt: queryResult.dataUpdatedAt
  });

  return {
    data: queryResult.data || {
      totalEntradas: 0,
      totalSaidas: 0,
      saldoAtual: 0,
      saldoPendente: 0,
      totalClientes: 0,
      totalCobrancas: 0,
      cobrancasPendentes: 0,
      cobrancasVencidas: 0,
      transacoesRecentes: [],
      entradasMes: [],
      saidasMes: [],
      entradasPagas: [],
      entradasPendentes: [],
      saidasPagas: [],
      saidasAgendadas: [],
      cobrancas: []
    },
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch
  };
}