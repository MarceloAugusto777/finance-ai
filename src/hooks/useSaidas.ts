import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Saida {
  id: string;
  valor: number;
  descricao: string;
  categoria: string;
  data: string;
  user_id: string;
  comprovante_url?: string;
}

export const useSaidas = () => {
  return useQuery({
    queryKey: ["saidas"],
    queryFn: async () => {
      console.log("🔍 useSaidas: Iniciando busca de dados...");
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log("👤 useSaidas: Usuário atual:", user?.email);
      
      if (!user) {
        console.error("❌ useSaidas: Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("📊 useSaidas: Buscando saídas para user_id:", user.id);
      
      const { data, error } = await supabase
        .from("saidas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("❌ useSaidas: Erro ao buscar dados:", error);
        throw error;
      }
      
      console.log("✅ useSaidas: Dados carregados com sucesso:", data?.length || 0, "registros");
      console.log("📊 useSaidas: Dados detalhados:", data);
      return data as Saida[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useCreateSaida = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (saida: Omit<Saida, "id" | "user_id">) => {
      console.log("🔄 Criando saída:", saida);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Erro ao obter usuário:", userError);
        throw userError;
      }
      
      if (!user) {
        console.error("❌ Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      const saidaCompleta = {
        ...saida,
        user_id: user.id
        // Removido status pois a tabela saidas não tem essa coluna
      };

      console.log("📝 Dados completos da saída:", saidaCompleta);

      const { data, error } = await supabase
        .from("saidas")
        .insert(saidaCompleta)
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao inserir saída:", error);
        throw error;
      }

      console.log("✅ Saída criada com sucesso:", data);
      console.log("💰 Valor da saída criada:", data.valor, "Tipo:", typeof data.valor);
      console.log("👤 User ID da saída criada:", data.user_id);
      console.log("📅 Data da saída criada:", data.data);
      console.log("📝 Descrição da saída criada:", data.descricao);
      return data;
    },
    onMutate: async (saida) => {
      console.log("🔄 Iniciando mutação de saída...");
      await queryClient.cancelQueries({ queryKey: ["saidas"] });
      const previousSaidas = queryClient.getQueryData(["saidas"]);

      // Otimisticamente adicionar a nova saída
      queryClient.setQueryData(["saidas"], (old: Saida[] | undefined) => {
        const newSaida = {
          id: "temp-" + Date.now(),
          ...saida,
          user_id: "temp-user-id"
        };
        return old ? [newSaida, ...old] : [newSaida];
      });

      return { previousSaidas };
    },
    onError: (err, saida, context) => {
      console.error("❌ Erro na mutação de saída:", err);
      if (context?.previousSaidas) {
        queryClient.setQueryData(["saidas"], context.previousSaidas);
      }
      
      toast({
        title: "Erro ao criar saída",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: async () => {
      console.log("🔄 Invalidando queries após criar saída...");
      // Invalidar queries em paralelo para melhor performance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["saidas"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      ]);
      console.log("✅ Queries invalidadas com sucesso");
    },
    onSuccess: (data) => {
      console.log("✅ Sucesso na criação da saída:", data);
      toast({
        title: "Saída criada!",
        description: "A saída foi registrada com sucesso.",
      });
    },
  });
};

export const useUpdateSaida = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...saida }: Partial<Saida> & { id: string }) => {
      const { data, error } = await supabase
        .from("saidas")
        .update(saida)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, ...saida }) => {
      await queryClient.cancelQueries({ queryKey: ["saidas"] });
      const previousSaidas = queryClient.getQueryData(["saidas"]);

      queryClient.setQueryData(["saidas"], (old: Saida[] | undefined) => {
        if (!old) return [];
        return old.map(s => s.id === id ? { ...s, ...saida } : s);
      });

      return { previousSaidas };
    },
    onError: (err, variables, context) => {
      if (context?.previousSaidas) {
        queryClient.setQueryData(["saidas"], context.previousSaidas);
      }
      
      toast({
        title: "Erro ao atualizar saída",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: async () => {
      // Invalidar queries em paralelo para melhor performance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["saidas"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      ]);
    },
    onSuccess: () => {
      toast({
        title: "Saída atualizada!",
        description: "A saída foi atualizada com sucesso.",
      });
    },
  });
};

export const useDeleteSaida = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (saidaId: string) => {
      const { error } = await supabase
        .from("saidas")
        .delete()
        .eq("id", saidaId);

      if (error) throw error;
      return saidaId;
    },
    onMutate: async (saidaId) => {
      await queryClient.cancelQueries({ queryKey: ["saidas"] });
      const previousSaidas = queryClient.getQueryData(["saidas"]);

      queryClient.setQueryData(["saidas"], (old: Saida[] | undefined) => {
        if (!old) return [];
        return old.filter(saida => saida.id !== saidaId);
      });

      return { previousSaidas };
    },
    onError: (err, saidaId, context) => {
      if (context?.previousSaidas) {
        queryClient.setQueryData(["saidas"], context.previousSaidas);
      }
      
      toast({
        title: "Erro ao excluir saída",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: async () => {
      // Invalidar queries em paralelo para melhor performance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["saidas"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      ]);
    },
    onSuccess: () => {
      toast({
        title: "Saída excluída!",
        description: "A saída foi removida com sucesso.",
      });
    },
  });
}; 