import { useState, useEffect } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

interface SignUpData {
  email: string;
  password: string;
  nome: string;
  contato?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface ResetPasswordData {
  email: string;
}

interface UpdateProfileData {
  nome?: string;
  contato?: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  const { toast } = useToast();

  // Verificar sessão inicial
  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          if (mounted) {
            toast({
              title: "Erro de autenticação",
              description: "Erro ao verificar sessão atual.",
              variant: "destructive",
            });
          }
        }

        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Erro ao obter sessão:", error);
        if (mounted) {
          setAuthState({
            user: null,
            session: null,
            loading: false,
          });
        }
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state change:", event, session?.user?.email);

        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
        });

        // Criar perfil do usuário após signup
        if (event === "SIGNED_IN" && session?.user) {
          await createUserProfile(session.user);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  // Criar perfil do usuário
  const createUserProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email || "",
          nome: user.user_metadata?.nome || user.email?.split("@")[0] || "Usuário",
          contato: user.user_metadata?.contato || "",
        })
        .single();

      if (error && error.code !== '23505') { // Ignorar erro de duplicata
        console.error("Erro ao criar perfil:", error);
      }
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
    }
  };

  // Cadastro
  const signUp = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nome: data.nome,
            contato: data.contato,
          },
        },
      });

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      if (authData.user && !authData.session) {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  // Verificar se usuário existe
  const checkUserExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
    try {
      // Tentar fazer login para verificar se o usuário existe
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: "temp_password_for_check",
      });

      // Se não há erro de credenciais inválidas, o usuário existe
      if (error && error.message.includes("Invalid login credentials")) {
        return { exists: true };
      }

      // Se não há erro, o usuário existe e a senha está correta
      if (!error && data.user) {
        // Fazer logout imediatamente
        await supabase.auth.signOut();
        return { exists: true };
      }

      return { exists: false };
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      return { exists: false, error: "Erro ao verificar usuário" };
    }
  };

  // Login
  const signIn = async (data: SignInData): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Tentando login com:", data.email);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Erro no login:", error);
        
        // Se o erro for de usuário não encontrado, sugerir cadastro
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Usuário não encontrado",
            description: "Este email não está cadastrado. Deseja criar uma conta?",
            variant: "destructive",
          });
          return { success: false, error: "Usuário não encontrado. Deseja criar uma conta?" };
        }
        
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      if (authData.user) {
        console.log("Login bem-sucedido:", authData.user.email);
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta!",
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  // Login com Google
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const signOut = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast({
          title: "Erro no logout",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Logout realizado!",
        description: "Até logo!",
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro no logout",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  // Recuperar senha
  const resetPassword = async (data: ResetPasswordData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao enviar email",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  // Atualizar senha
  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: "Erro ao atualizar senha",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi alterada com sucesso.",
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao atualizar senha",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  // Atualizar perfil
  const updateProfile = async (data: UpdateProfileData): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!authState.user) {
        return { success: false, error: "Usuário não autenticado" };
      }

      const { error } = await supabase
        .from("users")
        .update({
          nome: data.nome,
          contato: data.contato,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authState.user.id);

      if (error) {
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao atualizar perfil",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  // Obter perfil do usuário
  const getUserProfile = async () => {
    try {
      if (!authState.user) return null;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authState.user.id)
        .single();

      if (error) {
        console.error("Erro ao obter perfil:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erro ao obter perfil:", error);
      return null;
    }
  };

  // Verificar se o email foi confirmado
  const isEmailConfirmed = () => {
    return authState.user?.email_confirmed_at !== null;
  };

  return {
    // Estado
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    isAuthenticated: !!authState.user,
    isEmailConfirmed: isEmailConfirmed(),

    // Métodos
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    getUserProfile,
    checkUserExists,
  };
} 