import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";

export interface Entrada {
  id: string;
  valor: number;
  descricao: string;
  categoria: string;
  data: string;
  status?: string;
  cliente_id?: string | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

// Dados mock para desenvolvimento
const mockEntradas: Entrada[] = [
  {
    id: "1",
    valor: 2500,
    descricao: "Venda de Produto A",
    categoria: "Vendas",
    data: new Date().toISOString(),
    status: "pago",
    user_id: "mock-user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    valor: 3000,
    descricao: "Serviço de Consultoria",
    categoria: "Serviços",
    data: new Date(Date.now() - 86400000).toISOString(),
    status: "pendente",
    user_id: "mock-user",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "3",
    valor: 1500,
    descricao: "Freelance Design",
    categoria: "Freelance",
    data: new Date(Date.now() - 172800000).toISOString(),
    status: "pago",
    user_id: "mock-user",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  }
];

export function useEntradas() {
  const { sessionRestored, isAuthenticated } = useAuthContext();
  
  return useQuery({
    queryKey: ["entradas"],
    enabled: sessionRestored && isAuthenticated, // Só executar quando a sessão estiver restaurada e o usuário autenticado
    queryFn: async () => {
      try {
        console.log("Iniciando busca de entradas...");
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        // Se não há usuário autenticado e estamos em desenvolvimento, retornar dados mock
        if (!user && import.meta.env.DEV) {
          console.log("Modo de desenvolvimento - usando dados de exemplo para entradas");
          return mockEntradas;
        }
        
        if (userError) {
          console.error("Erro ao obter usuário:", userError);
          throw new Error(`Erro de autenticação: ${userError.message}`);
        }
        
        if (!user) {
          console.error("Usuário não autenticado");
          throw new Error("Usuário não autenticado");
        }

        console.log("Usuário autenticado:", user.email);

        const { data, error } = await supabase
          .from("entradas")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Erro ao buscar entradas:", error);
          throw error;
        }
        
        console.log("Entradas encontradas:", data?.length || 0);
        return data as Entrada[];
      } catch (error) {
        console.error("Erro geral em useEntradas:", error);
        // Em desenvolvimento, retornar dados mock em caso de erro
        if (import.meta.env.DEV) {
          console.log("Erro no carregamento - usando dados de exemplo para entradas");
          return mockEntradas;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: (failureCount, error) => {
      console.log(`Tentativa ${failureCount + 1} de buscar entradas. Erro:`, error);
      return failureCount < 2; // Tentar apenas 2 vezes
    },
  });
}

export const useCreateEntrada = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Função para criar cobrança automaticamente a partir de entrada pendente
  const createCobrancaFromEntrada = async (entrada: Entrada) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const cobrancaData = {
        cliente_id: entrada.cliente_id!,
        descricao: entrada.descricao,
        valor: entrada.valor,
        data_vencimento: entrada.data, // Usar a data da entrada como vencimento
        status: "pendente"
      };

      const { error } = await supabase
        .from("cobrancas")
        .insert({
          ...cobrancaData,
          user_id: user.id
        });

      if (!error) {
        console.log("✅ Cobrança criada automaticamente a partir da entrada pendente");
        // Invalidar queries de cobranças para atualizar a lista
        queryClient.invalidateQueries({ queryKey: ["cobrancas"] });
      }
    } catch (error) {
      console.error("Erro ao criar cobrança automática:", error);
    }
  };

  return useMutation({
    mutationFn: async (entrada: Omit<Entrada, "id" | "user_id">) => {
      console.log("🔄 Criando entrada:", entrada);
      
      // Verificar autenticação primeiro
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Erro ao obter usuário:", userError);
        throw new Error(`Erro de autenticação: ${userError.message}`);
      }
      
      if (!user) {
        console.error("❌ Usuário não autenticado");
        throw new Error("Usuário não autenticado. Faça login para continuar.");
      }

      console.log("✅ Usuário autenticado:", user.id);

      // Garantir que todos os campos obrigatórios estejam presentes
      const entradaData = {
        descricao: entrada.descricao,
        valor: Number(entrada.valor),
        categoria: entrada.categoria,
        data: entrada.data,
        status: entrada.status || "pendente",
        user_id: user.id, // Sempre usar o ID do usuário autenticado
        cliente_id: entrada.cliente_id || null
      };

      console.log("📝 Dados completos da entrada:", entradaData);

      // Verificar se todos os campos obrigatórios estão presentes
      if (!entradaData.descricao || !entradaData.valor || !entradaData.data) {
        throw new Error("Campos obrigatórios não preenchidos: descrição, valor e data são necessários.");
      }

      const { data, error } = await supabase
        .from("entradas")
        .insert(entradaData)
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao inserir entrada:", error);
        throw new Error(`Erro ao inserir entrada: ${error.message}`);
      }

      console.log("✅ Entrada criada com sucesso:", data);
      console.log("💰 Valor da entrada criada:", data.valor, "Tipo:", typeof data.valor);
      console.log("👤 User ID da entrada criada:", data.user_id);
      console.log("📅 Data da entrada criada:", data.data);
      console.log("📝 Descrição da entrada criada:", data.descricao);
      return data;
    },
    onMutate: async (newEntrada) => {
      console.log("🔄 Iniciando mutação de entrada...");
      await queryClient.cancelQueries({ queryKey: ["entradas"] });
      const previousEntradas = queryClient.getQueryData(["entradas"]);

      // Otimisticamente adicionar a nova entrada
      queryClient.setQueryData(["entradas"], (old: Entrada[] | undefined) => {
        const newEntradaWithId = {
          id: "temp-" + Date.now(),
          ...newEntrada,
          user_id: "temp-user-id"
        };
        return old ? [newEntradaWithId, ...old] : [newEntradaWithId];
      });

      return { previousEntradas };
    },
    onError: (err, newEntrada, context) => {
      console.error("❌ Erro na mutação de entrada:", err);
      if (context?.previousEntradas) {
        queryClient.setQueryData(["entradas"], context.previousEntradas);
      }
      
      toast({
        title: "Erro ao criar entrada",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: async () => {
      console.log("🔄 Invalidando queries após criar entrada...");
      // Invalidar queries em paralelo para melhor performance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["entradas"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      ]);
      console.log("✅ Queries invalidadas com sucesso");
    },
    onSuccess: (data) => {
      console.log("✅ Sucesso na criação da entrada:", data);
      toast({
        title: "Entrada criada!",
        description: "A entrada foi registrada com sucesso.",
      });
      
      // Se a entrada for pendente e tiver cliente_id, criar cobrança automaticamente
      if (data.status === "pendente" && data.cliente_id) {
        createCobrancaFromEntrada(data);
      }
    },
  });
};

export function useDeleteEntrada() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (entradaId: string) => {
      try {
        console.log("Excluindo entrada:", entradaId);
        
        const { error } = await supabase
          .from("entradas")
          .delete()
          .eq("id", entradaId);

        if (error) {
          console.error("Erro ao excluir entrada:", error);
          throw error;
        }
        
        console.log("Entrada excluída com sucesso");
        return entradaId;
      } catch (error) {
        console.error("Erro geral ao excluir entrada:", error);
        throw error;
      }
    },
    onMutate: async (entradaId) => {
      await queryClient.cancelQueries({ queryKey: ["entradas"] });
      const previousEntradas = queryClient.getQueryData(["entradas"]);

      queryClient.setQueryData(["entradas"], (old: Entrada[] | undefined) => {
        if (!old) return [];
        return old.filter(entrada => entrada.id !== entradaId);
      });

      return { previousEntradas };
    },
    onError: (err, entradaId, context) => {
      console.error("Erro na mutação de excluir entrada:", err);
      
      if (context?.previousEntradas) {
        queryClient.setQueryData(["entradas"], context.previousEntradas);
      }
      
      toast({
        title: "Erro ao excluir entrada",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: async () => {
      // Invalidar queries em paralelo para melhor performance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["entradas"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      ]);
    },
    onSuccess: () => {
      toast({
        title: "Entrada excluída!",
        description: "A entrada foi removida com sucesso.",
      });
    },
  });
}

export function useUpdateEntrada() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...entrada }: Partial<Entrada> & { id: string }) => {
      try {
        console.log("Atualizando entrada:", id, entrada);
        
        const { data, error } = await supabase
          .from("entradas")
          .update(entrada)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Erro ao atualizar entrada:", error);
          throw error;
        }
        
        console.log("Entrada atualizada com sucesso:", data);
        return data;
      } catch (error) {
        console.error("Erro geral ao atualizar entrada:", error);
        throw error;
      }
    },
    onMutate: async ({ id, ...entrada }) => {
      await queryClient.cancelQueries({ queryKey: ["entradas"] });
      const previousEntradas = queryClient.getQueryData(["entradas"]);

      queryClient.setQueryData(["entradas"], (old: Entrada[] | undefined) => {
        if (!old) return [];
        return old.map(e => e.id === id ? { ...e, ...entrada } : e);
      });

      return { previousEntradas };
    },
    onError: (err, variables, context) => {
      console.error("Erro na mutação de atualizar entrada:", err);
      
      if (context?.previousEntradas) {
        queryClient.setQueryData(["entradas"], context.previousEntradas);
      }
      
      toast({
        title: "Erro ao atualizar entrada",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: async () => {
      // Invalidar queries em paralelo para melhor performance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["entradas"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      ]);
    },
    onSuccess: () => {
      toast({
        title: "Entrada atualizada!",
        description: "A entrada foi atualizada com sucesso.",
      });
    },
  });
}