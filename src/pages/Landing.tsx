import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Check, 
  Star, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  BarChart3,
  Calendar,
  Download,
  Database,
  LogIn,
  Sparkles,
  Target,
  Globe,
  Smartphone,
  DollarSign,
  TrendingDown,
  Receipt,
  Bot,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMobileDetect } from "@/hooks/useMobileDetect";
import LandingMobile from "./LandingMobile";

export default function Landing() {
  const navigate = useNavigate();
  const isMobile = useMobileDetect();

  const handleRegisterClick = () => {
    console.log('Register button clicked');
    navigate('/auth/register');
  };

  const handleLoginClick = () => {
    console.log('Login button clicked');
    navigate('/auth/login');
  };

  const handleContactClick = () => {
    console.log('Contact button clicked');
    navigate('/contato');
  };

  // Renderizar versão mobile se for dispositivo móvel
  if (isMobile) {
    return <LandingMobile />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative w-full no-double-scroll">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="relative border-b border-green-500/20 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FinanceAI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
              Preços
            </a>
            <a href="#about" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
              Sobre
            </a>
            <button 
              onClick={handleContactClick}
              className="text-gray-300 hover:text-green-400 transition-colors duration-300 bg-transparent border-none cursor-pointer"
            >
              Contato
            </button>
          </nav>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-green-500/20 border-green-500/20 hidden sm:flex" 
              onClick={handleLoginClick}
            >
              <LogIn className="mr-2 w-4 h-4" />
              Login
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-sm md:text-base px-3 md:px-4" 
              onClick={handleRegisterClick}
            >
              <span className="hidden sm:inline">Começar Grátis</span>
              <span className="sm:hidden">Começar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-16 md:py-32 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full px-4 md:px-6 py-2 mb-6 md:mb-8">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-white/90 text-xs md:text-sm font-medium">💰 Revolucione suas finanças</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight px-2">
            Gerencie suas{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              finanças
            </span>{" "}
            com inteligência
          </h1>
          
          <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            O sistema mais inteligente de gestão financeira. 
            Dashboard em tempo real, relatórios avançados e insights baseados em IA para 
            transformar sua relação com o dinheiro.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-base md:text-lg px-6 md:px-8 py-4 md:py-6" 
              onClick={handleRegisterClick}
            >
              Começar Grátis
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-green-500/20 text-white hover:bg-green-500/10 text-base md:text-lg px-6 md:px-8 py-4 md:py-6" 
              onClick={handleRegisterClick}
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-gray-300 text-sm md:text-base">Usuários ativos</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className="text-gray-300 text-sm md:text-base">Uptime garantido</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-gray-300 text-sm md:text-base">Suporte disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 md:py-32 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6">
              <Target className="w-4 h-4 text-white" />
              <span className="text-white text-xs md:text-sm font-medium">Funcionalidades</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
              Poderoso e Intuitivo
            </h2>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Tudo que você precisa para dominar suas finanças com tecnologia de ponta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Dashboard Inteligente</CardTitle>
                <CardDescription className="text-gray-300">
                  Visualize suas finanças em tempo real com gráficos interativos e insights baseados em IA
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Controle de Entradas</CardTitle>
                <CardDescription className="text-gray-300">
                  Registre e acompanhe todas as suas receitas com categorização inteligente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Gestão de Saídas</CardTitle>
                <CardDescription className="text-gray-300">
                  Monitore suas despesas e mantenha o controle total dos gastos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Gestão de Clientes</CardTitle>
                <CardDescription className="text-gray-300">
                  Organize seus clientes e acompanhe todas as transações relacionadas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Receipt className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Cobranças Automáticas</CardTitle>
                <CardDescription className="text-gray-300">
                  Crie e gerencie cobranças com lembretes automáticos diretamente para o seu cliente e acompanhamento pelo dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-r from-teal-600 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Zapinho</CardTitle>
                <CardDescription className="text-gray-300">
                  Controle tudo diretamente do seu WhatsApp com o Zapinho, o seu assistente financeiro que está totalmente vinculado ao seu dashboard
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-16 md:py-32 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6">
              <DollarSign className="w-4 h-4 text-white" />
              <span className="text-white text-xs md:text-sm font-medium">Preços</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
              Escolha seu Plano
            </h2>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Planos flexíveis para todos os tipos de negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            {/* Free Trial */}
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300 group relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  GRÁTIS
                </div>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-white text-2xl mb-2">Free Trial</CardTitle>
                <div className="text-4xl font-bold text-white mb-2">
                  R$ 0
                  <span className="text-lg text-gray-400 font-normal">/mês</span>
                </div>
                <CardDescription className="text-gray-300">
                  Perfeito para começar e testar todas as funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Dashboard completo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Gestão de entradas e saídas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Relatórios básicos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Suporte por email</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                  onClick={handleRegisterClick}
                >
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300 group relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  PRO
                </div>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-white text-2xl mb-2">Pro</CardTitle>
                <div className="text-4xl font-bold text-white mb-2 opacity-50">
                  EM BREVE
                </div>
                <CardDescription className="text-gray-300">
                  Funcionalidades avançadas para negócios em crescimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Tudo do plano Free</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Cobranças automáticas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Zapinho integrado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Relatórios avançados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Suporte prioritário</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gray-600 hover:bg-gray-700 cursor-not-allowed" 
                  disabled
                >
                  Em Breve
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 px-4">
              Pronto para transformar suas finanças?
            </h2>
            <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              Junte-se a milhares de usuários que já revolucionaram sua gestão financeira
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-base md:text-lg px-8 md:px-12 py-4 md:py-6" 
              onClick={handleRegisterClick}
            >
              Começar Agora
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-green-500/20 bg-black/40 backdrop-blur-sm py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">FinanceAI</span>
          </div>
          <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
            © 2024 FinanceAI. Todos os direitos reservados.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400">
            <a href="#" className="hover:text-green-400 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-green-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-green-400 transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 