import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  user_id: string;
}

export function useClientes() {
  const { sessionRestored, isAuthenticated } = useAuthContext();
  
  return useQuery({
    queryKey: ["clientes"],
    enabled: sessionRestored && isAuthenticated, // Só executar quando a sessão estiver restaurada e o usuário autenticado
    queryFn: async () => {
      console.log("🔍 useClientes: Iniciando busca de dados...");
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log("👤 useClientes: Usuário atual:", user?.email);
      
      if (!user) {
        console.error("❌ useClientes: Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("📊 useClientes: Buscando clientes para user_id:", user.id);
      
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("user_id", user.id)
        .order("nome");
      
      if (error) {
        console.error("❌ useClientes: Erro ao buscar dados:", error);
        throw error;
      }
      
      console.log("✅ useClientes: Dados carregados com sucesso:", data?.length || 0, "registros");
      return data as Cliente[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cliente: Omit<Cliente, "id" | "user_id">) => {
      console.log("🔄 Criando cliente:", cliente);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Erro ao obter usuário:", userError);
        throw userError;
      }
      
      if (!user) {
        console.error("❌ Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      const clienteData = {
        ...cliente,
        user_id: user.id,
      };

      console.log("📝 Dados completos do cliente:", clienteData);

      const { data, error } = await supabase
        .from("clientes")
        .insert(clienteData)
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao inserir cliente:", error);
        throw error;
      }

      console.log("✅ Cliente criado com sucesso:", data);
      console.log("👤 Nome do cliente criado:", data.nome);
      console.log("👤 User ID do cliente criado:", data.user_id);
      return data;
    },
    onMutate: async (newCliente) => {
      console.log("🔄 Iniciando mutação de cliente...");
      await queryClient.cancelQueries({ queryKey: ["clientes"] });
      const previousClientes = queryClient.getQueryData(["clientes"]);

      // Otimisticamente adicionar o novo cliente
      queryClient.setQueryData(["clientes"], (old: Cliente[] | undefined) => {
        const newClienteWithId = {
          id: "temp-" + Date.now(),
          ...newCliente,
          user_id: "temp-user-id"
        };
        return old ? [newClienteWithId, ...old] : [newClienteWithId];
      });

      return { previousClientes };
    },
    onError: (err, newCliente, context) => {
      console.error("❌ Erro na mutação de cliente:", err);
      if (context?.previousClientes) {
        queryClient.setQueryData(["clientes"], context.previousClientes);
      }
      
      toast({
        title: "Erro ao criar cliente",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: async () => {
      console.log("🔄 Invalidando queries após criar cliente...");
      // Invalidar queries em paralelo para melhor performance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["clientes"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      ]);
      console.log("✅ Queries invalidadas com sucesso");
    },
    onSuccess: (data) => {
      console.log("✅ Sucesso na criação do cliente:", data);
      toast({
        title: "Cliente criado!",
        description: "O cliente foi cadastrado com sucesso.",
      });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clienteId: string) => {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", clienteId);

      if (error) throw error;
      return clienteId;
    },
    onMutate: async (clienteId) => {
      await queryClient.cancelQueries({ queryKey: ["clientes"] });
      const previousClientes = queryClient.getQueryData(["clientes"]);

      queryClient.setQueryData(["clientes"], (old: Cliente[] | undefined) => {
        if (!old) return [];
        return old.filter(cliente => cliente.id !== clienteId);
      });

      return { previousClientes };
    },
    onError: (err, clienteId, context) => {
      if (context?.previousClientes) {
        queryClient.setQueryData(["clientes"], context.previousClientes);
      }
      
      toast({
        title: "Erro ao excluir cliente",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onSuccess: () => {
      toast({
        title: "Cliente excluído!",
        description: "O cliente foi removido com sucesso.",
      });
    },
  });
}