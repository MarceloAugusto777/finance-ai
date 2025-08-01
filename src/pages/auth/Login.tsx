import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, Shield, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, isAuthenticated, loading } = useAuthContext();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      console.log("Usuário já autenticado, redirecionando para:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Iniciando login...");
      const result = await signIn(formData);
      
      if (result.success) {
        console.log("Login bem-sucedido, redirecionando...");
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        console.log("Login falhou:", result.error);
        
        // Se o erro indica que o usuário não existe, sugerir cadastro
        if (result.error?.includes("não está cadastrado")) {
          // Aguardar um pouco para o usuário ver a mensagem
          setTimeout(() => {
            navigate("/auth/register", { 
              state: { 
                email: formData.email,
                message: "Este email não está cadastrado. Complete seu cadastro abaixo."
              } 
            });
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        // O redirecionamento será feito pelo Supabase
        console.log("Login com Google iniciado");
      } else {
        console.log("Login com Google falhou:", result.error);
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Mostrar loading se ainda está verificando autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25">
            <span className="text-3xl font-bold text-white">F</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Finance AI
          </h1>
          <p className="text-gray-300 text-lg">Sistema de Gestão Financeira Inteligente</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-2xl border-0 bg-gray-800/80 backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-white">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-200">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Entrar
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Separador */}
            <div className="relative">
              <Separator className="bg-gray-600" />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 px-4 text-sm text-gray-400">
                ou continue com
              </span>
            </div>

            {/* Login com Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white transition-all duration-200"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                  Conectando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Chrome className="mr-2 w-4 h-4" />
                  Continuar com Google
                </div>
              )}
            </Button>

            {/* Links de Navegação */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-300">
                Não tem uma conta?{" "}
                <Link
                  to="/auth/register"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Cadastre-se gratuitamente
                </Link>
              </p>
              
              <p className="text-xs text-gray-400">
                Ao continuar, você concorda com nossos{" "}
                <Link to="/termos" className="text-blue-400 hover:text-blue-300">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link to="/privacidade" className="text-blue-400 hover:text-blue-300">
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-6 text-xs">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div className="font-semibold text-gray-200 mb-1">Seguro</div>
              <div className="text-gray-400">Dados criptografados</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="font-semibold text-gray-200 mb-1">Rápido</div>
              <div className="text-gray-400">Interface otimizada</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center justify-center mb-2">
                <Smartphone className="w-5 h-5 text-green-400" />
              </div>
              <div className="font-semibold text-gray-200 mb-1">Responsivo</div>
              <div className="text-gray-400">Funciona em qualquer dispositivo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 