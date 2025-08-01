import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Cobranca {
  id: string;
  cliente_id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  cliente?: {
    id: string;
    nome: string;
    email: string | null;
    telefone: string | null;
  };
}

export interface CreateCobrancaData {
  cliente_id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status?: string;
}

export interface UpdateCobrancaData {
  id: string;
  cliente_id?: string;
  descricao?: string;
  valor?: number;
  data_vencimento?: string;
  data_pagamento?: string | null;
  status?: string;
}

export function useCobrancas() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cobrancas"],
    queryFn: async (): Promise<Cobranca[]> => {
      console.log("🔍 useCobrancas: Iniciando busca de dados...");
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log("👤 useCobrancas: Usuário atual:", user?.email);
      
      if (!user) {
        console.error("❌ useCobrancas: Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("📊 useCobrancas: Buscando cobranças para user_id:", user.id);
      
      // Teste: verificar se a tabela cobrancas existe
      const { data: tabelaCobrancas, error: erroTabelaCobrancas } = await supabase
        .from("cobrancas")
        .select("count")
        .limit(1);
      
      console.log("🧪 Teste - Tabela cobrancas existe:", !erroTabelaCobrancas);
      console.log("🧪 Teste - Erro ao acessar tabela cobrancas:", erroTabelaCobrancas);
      
      const { data, error } = await supabase
        .from("cobrancas")
        .select(`
          *,
          cliente:clientes(id, nome, email, telefone)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ useCobrancas: Erro ao buscar dados:", error);
        throw error;
      }
      
      console.log("✅ useCobrancas: Dados carregados com sucesso:", data?.length || 0, "registros");
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  const createCobranca = useMutation({
    mutationFn: async (cobrancaData: CreateCobrancaData): Promise<Cobranca> => {
      console.log("🔄 Criando nova cobrança:", cobrancaData);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Erro ao obter usuário:", userError);
        throw userError;
      }
      
      if (!user) {
        console.error("❌ Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      const cobrancaCompleta = {
        ...cobrancaData,
        status: cobrancaData.status || "pendente",
        user_id: user.id
      };

      console.log("📝 Dados completos da cobrança:", cobrancaCompleta);

      const { data, error } = await supabase
        .from("cobrancas")
        .insert(cobrancaCompleta)
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao inserir cobrança:", error);
        throw error;
      }

      console.log("✅ Cobrança criada com sucesso:", data);
      console.log("💰 Valor da cobrança criada:", data.valor, "Tipo:", typeof data.valor);
      console.log("👤 User ID da cobrança criada:", data.user_id);
      console.log("📅 Data de vencimento da cobrança criada:", data.data_vencimento);
      console.log("📝 Descrição da cobrança criada:", data.descricao);
      return data;
    },
    onMutate: async (newCobranca) => {
      console.log("🔄 Iniciando mutação de cobrança...");
      await queryClient.cancelQueries({ queryKey: ["cobrancas"] });
      const previousCobrancas = queryClient.getQueryData(["cobrancas"]);

      // Otimisticamente adicionar a nova cobrança
      queryClient.setQueryData(["cobrancas"], (old: Cobranca[] | undefined) => {
        const newCobrancaWithId = {
          id: "temp-" + Date.now(),
          ...newCobranca,
          user_id: "temp-user-id",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return old ? [newCobrancaWithId, ...old] : [newCobrancaWithId];
      });

      return { previousCobrancas };
    },
    onError: (err, newCobranca, context) => {
      console.error("❌ Erro na mutação de cobrança:", err);
      if (context?.previousCobrancas) {
        queryClient.setQueryData(["cobrancas"], context.previousCobrancas);
      }
      
      toast({
        title: "Erro ao criar cobrança",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: async () => {
      console.log("🔄 Invalidando queries após criar cobrança...");
      // Invalidar queries em paralelo para melhor performance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cobrancas"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      ]);
      console.log("✅ Queries invalidadas com sucesso");
    },
    onSuccess: (data) => {
      console.log("✅ Sucesso na criação da cobrança:", data);
      toast({
        title: "Cobrança criada!",
        description: "A cobrança foi registrada com sucesso.",
      });
    },
  });

  const updateCobranca = useMutation({
    mutationFn: async (cobrancaData: UpdateCobrancaData): Promise<Cobranca> => {
      console.log("🔄 Atualizando cobrança:", cobrancaData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      
      const { id, ...updateData } = cobrancaData;
      
      const { data, error } = await supabase
        .from("cobrancas")
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", user.id) // Garantir que só atualiza suas próprias cobranças
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao atualizar cobrança:", error);
        throw error;
      }

      console.log("✅ Cobrança atualizada com sucesso:", data);
      return data;
    },
    onSuccess: () => {
      console.log("🔄 Invalidando queries após atualização");
      queryClient.invalidateQueries({ queryKey: ["cobrancas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({
        title: "Cobrança atualizada!",
        description: "A cobrança foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error("❌ Erro na mutação de atualização:", error);
      toast({
        title: "Erro!",
        description: "Erro ao atualizar cobrança: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCobranca = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log("🗑️ Iniciando exclusão da cobrança:", id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      
      const { error } = await supabase
        .from("cobrancas")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Garantir que só deleta suas próprias cobranças

      if (error) {
        console.error("❌ Erro ao excluir cobrança:", error);
        throw error;
      }
      
      console.log("✅ Cobrança excluída do banco de dados");
    },
    onSuccess: () => {
      console.log("🔄 Invalidando queries após exclusão");
      queryClient.invalidateQueries({ queryKey: ["cobrancas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({
        title: "Cobrança excluída!",
        description: "A cobrança foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      console.error("❌ Erro na mutação de exclusão:", error);
      toast({
        title: "Erro!",
        description: "Erro ao excluir cobrança: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateCobrancaStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }): Promise<Cobranca> => {
      console.log("🔄 Atualizando status da cobrança:", { id, status });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      
      const updateData: any = { status };
      
      // Se o status for "pago", definir a data de pagamento
      if (status === "pago") {
        updateData.data_pagamento = new Date().toISOString();
      } else if (status === "pendente") {
        updateData.data_pagamento = null;
      }

      const { data, error } = await supabase
        .from("cobrancas")
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", user.id) // Garantir que só atualiza suas próprias cobranças
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao atualizar status da cobrança:", error);
        throw error;
      }

      console.log("✅ Status da cobrança atualizado:", data);
      return data;
    },
    onSuccess: () => {
      console.log("🔄 Invalidando queries após atualização de status");
      queryClient.invalidateQueries({ queryKey: ["cobrancas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({
        title: "Status atualizado!",
        description: "O status da cobrança foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("❌ Erro na mutação de atualização de status:", error);
      toast({
        title: "Erro!",
        description: "Erro ao atualizar status: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Função para verificar cobranças vencidas
  const checkVencidas = async () => {
    const hoje = new Date().toISOString().split('T')[0];
    
    const { data: vencidas, error } = await supabase
      .from("cobrancas")
      .select("*")
      .eq("status", "pendente")
      .lt("data_vencimento", hoje);

    if (error) {
      console.error("Erro ao verificar cobranças vencidas:", error);
      return;
    }

    // Atualizar status das cobranças vencidas
    if (vencidas && vencidas.length > 0) {
      for (const cobranca of vencidas) {
        await updateCobrancaStatus.mutateAsync({
          id: cobranca.id,
          status: "vencido"
        });
      }
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    createCobranca: createCobranca.mutateAsync,
    updateCobranca: updateCobranca.mutateAsync,
    deleteCobranca: deleteCobranca.mutateAsync,
    updateCobrancaStatus: updateCobrancaStatus.mutateAsync,
    checkVencidas,
    isCreating: createCobranca.isPending,
    isUpdating: updateCobranca.isPending,
    isDeleting: deleteCobranca.isPending,
    isUpdatingStatus: updateCobrancaStatus.isPending,
  };
} 