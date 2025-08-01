import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { MiniChart } from "@/components/charts/MiniChart";
import { HeroBanner } from "@/components/ui/hero-banner";
import { Loading, DashboardLoading } from "@/components/ui/loading";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useEntradas } from "@/hooks/useEntradas";
import { useSaidas } from "@/hooks/useSaidas";
import { useCobrancas } from "@/hooks/useCobrancas";
import { useClientes } from "@/hooks/useClientes";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Plus, 
  Receipt, 
  Target, 
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Bug,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Dados fictícios para o gráfico
const miniChartData = [
  { value: 12 }, { value: 19 }, { value: 3 }, { value: 5 }, 
  { value: 2 }, { value: 3 }, { value: 7 }, { value: 8 }, 
  { value: 9 }, { value: 10 }, { value: 11 }, { value: 12 }
];

const Index = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  const { data: stats, isLoading, refetch: refetchStats } = useDashboardStats();

  // Dados com fallback para evitar erros
  const statsData = stats || {
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0,
    saldoPendente: 0,
    entradasPagas: 0,
    entradasPendentes: 0,
    saidasPagas: 0,
    saidasAgendadas: 0,
    cobrancasPendentes: 0,
    cobrancasPagas: 0,
    cobrancasVencidas: 0,
    totalClientes: 0,
    ultimasTransacoes: []
  };

  // Calcular valores para exibição
  const totalEntradas = Number(statsData.totalEntradas) || 0;
  const totalSaidas = Number(statsData.totalSaidas) || 0;
  const saldoAtual = Number(statsData.saldo) || 0;
  const saldoPendente = Number(statsData.saldoPendente) || 0;
  const totalClientes = Number(statsData.totalClientes) || 0;
  const dashboardCobrancasPendentes = Number(statsData.cobrancasPendentes) || 0;
  const dashboardCobrancasVencidas = Number(statsData.cobrancasVencidas) || 0;

  console.log("📊 Dashboard - Dados calculados:", {
    totalEntradas,
    totalSaidas,
    saldoAtual,
    saldoPendente,
    totalClientes,
    cobrancasPendentes: dashboardCobrancasPendentes,
    cobrancasVencidas: dashboardCobrancasVencidas
  });

  const { data: entradas = [] } = useEntradas();
  const { data: saidas = [] } = useSaidas();
  const { data: cobrancas = [] } = useCobrancas();
  const { data: clientes = [] } = useClientes();

  // Calcular estatísticas adicionais
  const totalCobrancasCount = cobrancas.length;
  const transacoesRecentes = statsData.ultimasTransacoes || [];
  const cobrancasData = cobrancas || [];
  const saidasMesCount = saidas.length;
  const entradasMesCount = entradas.length;

  // Verificar autenticação no início
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log("🔐 Verificação de autenticação:", { user: !!user, error });
      
      if (!user) {
        console.log("⚠️ Usuário não autenticado - tentando login anônimo...");
        
        // Tentar fazer login anônimo para desenvolvimento
        if (import.meta.env.DEV) {
          try {
            const { data: { user: anonUser }, error: anonError } = await supabase.auth.signInAnonymously();
            if (anonError) {
              console.error("❌ Erro no login anônimo:", anonError);
            } else if (anonUser) {
              console.log("✅ Login anônimo realizado:", anonUser.id);
            }
          } catch (error) {
            console.error("❌ Erro ao tentar login anônimo:", error);
          }
        } else {
          console.log("⚠️ Usuário não autenticado - redirecionando para login");
          navigate("/auth/login");
        }
      } else {
        console.log("✅ Usuário autenticado:", user.email);
      }
    };
    
    checkAuth();
  }, [navigate]);

  console.log("📊 Dashboard - Estados de carregamento:", {
    stats: isLoading
  });

  console.log("📊 Dashboard - Dados carregados:", {
    stats: statsData,
    entradas: entradas.length,
    saidas: saidas.length,
    cobrancas: cobrancas.length,
    clientes: clientes.length
  });

  // Função para atualizar dados
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      console.log("🔄 Atualizando dados do dashboard...");
      
      // Refetch de todas as queries
      await Promise.all([
        refetchStats(),
        queryClient.invalidateQueries({ queryKey: ["entradas"] }),
        queryClient.invalidateQueries({ queryKey: ["saidas"] }),
        queryClient.invalidateQueries({ queryKey: ["clientes"] }),
        queryClient.invalidateQueries({ queryKey: ["cobrancas"] })
      ]);
      
      toast({
        title: "Dados atualizados!",
        description: "O dashboard foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("❌ Erro ao atualizar:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calcular métricas adicionais
  const cobrancasPendentes = dashboardCobrancasPendentes;
  const cobrancasVencidas = dashboardCobrancasVencidas;
  const totalCobrancas = totalCobrancasCount;
  
  // Últimas transações
  const ultimasTransacoes = statsData?.ultimasTransacoes || [];

  // Próximos vencimentos (próximos 7 dias)
  const proximosVencimentos = cobrancasData?.filter((c: any) => {
    const dataVencimento = new Date(c.data_vencimento);
    const hoje = new Date();
    const proximos7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dataVencimento >= hoje && dataVencimento <= proximos7Dias && c.status === "pendente";
  }).slice(0, 3) || [];

  // Calcular estatísticas adicionais
  const totalSaidasMes = saidasMesCount;

  const saidasComStatus = saidasMesCount;
  const saidasSemStatus = saidasMesCount;

  if (isLoading) {
    console.log("🔄 Dashboard - Mostrando loading...");
    return (
      <Layout title="Dashboard">
        <DashboardLoading />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Header com Botão de Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta! Aqui está seu resumo financeiro.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Hero Banner */}
        <HeroBanner />
        
        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total de Entradas"
            value={totalEntradas}
            subtitle="Este mês"
            icon={TrendingUp}
            variant="success"
            formatAsCurrency={true}
          >
            <div className="text-xs text-muted-foreground mt-2">
              {statsData?.entradasPagas?.length || 0} pagas • {statsData?.entradasPendentes?.length || 0} pendentes
            </div>
          </DashboardCard>

          <DashboardCard
            title="Total de Saídas"
            value={totalSaidas}
            subtitle="Este mês"
            icon={TrendingDown}
            variant="danger"
            formatAsCurrency={true}
          >
            <div className="text-xs text-muted-foreground mt-2">
              {statsData?.saidasPagas?.length || 0} pagas • {statsData?.saidasAgendadas?.length || 0} agendadas
            </div>
          </DashboardCard>

          <DashboardCard
            title="Saldo Atual"
            value={saldoAtual}
            subtitle="Entradas - Saídas"
            icon={DollarSign}
            variant={saldoAtual >= 0 ? "success" : "danger"}
            formatAsCurrency={true}
          >
            <div className="text-xs text-muted-foreground mt-2">
              {statsData?.entradasPagas?.length || 0} entradas • {statsData?.saidasPagas?.length || 0} saídas
            </div>
          </DashboardCard>

          <DashboardCard
            title="Saldo Pendente"
            value={saldoPendente}
            subtitle="A receber/pagar"
            icon={Clock}
            variant={saldoPendente >= 0 ? "info" : "warning"}
            formatAsCurrency={true}
          >
            <div className="text-xs text-muted-foreground mt-2">
              {statsData?.entradasPendentes?.length || 0} pendentes • {statsData?.saidasAgendadas?.length || 0} agendadas
            </div>
          </DashboardCard>
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Clientes Ativos"
            value={totalClientes}
            subtitle="Total cadastrados"
            icon={Users}
            variant="default"
            formatAsCurrency={false}
          >
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {totalClientes} total
              </Badge>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Cobranças Pendentes"
            value={cobrancasPendentes}
            subtitle="A receber"
            icon={Receipt}
            variant="warning"
            formatAsCurrency={false}
          />

          <DashboardCard
            title="Cobranças Vencidas"
            value={cobrancasVencidas}
            subtitle="Ação necessária"
            icon={AlertTriangle}
            variant="danger"
            formatAsCurrency={true}
          />
        </div>

        {/* Atalhos Rápidos */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/entradas")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Nova Entrada</h3>
                  <p className="text-sm text-muted-foreground">Registrar receita</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/saidas")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Plus className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium">Nova Saída</h3>
                  <p className="text-sm text-muted-foreground">Registrar despesa</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/cobrancas")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Receipt className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Nova Cobrança</h3>
                  <p className="text-sm text-muted-foreground">Criar fatura</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/clientes")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Novo Cliente</h3>
                  <p className="text-sm text-muted-foreground">Cadastrar cliente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        {ultimasTransacoes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Transações Recentes
              </CardTitle>
              <CardDescription>
                Últimas movimentações financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ultimasTransacoes.map((transacao: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transacao.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transacao.tipo === 'entrada' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transacao.descricao}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transacao.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                      <p className={`font-medium ${transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                          {transacao.tipo === 'entrada' ? '+' : '-'} R$ {Number(transacao.valor).toFixed(2)}
                      </p>
                      <Badge variant={transacao.status === 'pago' ? 'default' : 'secondary'} className="text-xs">
                        {transacao.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Due Dates */}
        {proximosVencimentos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Próximos Vencimentos
              </CardTitle>
              <CardDescription>
                Cobranças que vencem nos próximos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proximosVencimentos.map((cobranca: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{cobranca.descricao}</p>
                        <p className="text-sm text-muted-foreground">
                          Vence em {new Date(cobranca.data_vencimento).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-yellow-600">
                        R$ {Number(cobranca.valor).toFixed(2)}
                      </p>
                                             <Badge variant="secondary" className="text-xs">
                         Pendente
                       </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Relatórios
              </CardTitle>
              <CardDescription>
                Gere relatórios detalhados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/exportacao")} 
                className="w-full gap-2"
                variant="outline"
              >
                <FileText className="w-4 h-4" />
                Gerar Relatório
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Metas
              </CardTitle>
              <CardDescription>
                Acompanhe suas metas financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/metas")} 
                className="w-full gap-2"
                variant="outline"
              >
                <Target className="w-4 h-4" />
                Ver Metas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;