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
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function LandingMobile() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative w-full overflow-y-auto landing-mobile">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-4 w-48 h-48 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-4 w-48 h-48 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-8 w-48 h-48 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Mobile Header */}
      <header className="relative border-b border-green-500/20 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center shadow-lg">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">FinanceAI</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-green-500/20 border-green-500/20 p-2 h-8 w-8" 
              onClick={handleLoginClick}
            >
              <LogIn className="w-4 h-4" />
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-xs px-3 py-1 h-8" 
              onClick={handleRegisterClick}
            >
              Começar
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-green-500/20 p-2 h-8 w-8" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-b border-green-500/20">
            <div className="px-4 py-4 space-y-3">
              <a 
                href="#features" 
                className="block text-gray-300 hover:text-green-400 transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Funcionalidades
              </a>
              <a 
                href="#pricing" 
                className="block text-gray-300 hover:text-green-400 transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </a>
              <a 
                href="#about" 
                className="block text-gray-300 hover:text-green-400 transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </a>
              <button 
                onClick={handleContactClick}
                className="block w-full text-left text-gray-300 hover:text-green-400 transition-colors duration-300 py-2 bg-transparent border-none cursor-pointer"
              >
                Contato
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-8 text-center">
        <div className="max-w-sm mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-3 h-3 text-green-400" />
            <span className="text-white/90 text-xs font-medium">💰 Revolucione suas finanças</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-6 leading-tight px-2">
            Gerencie suas{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              finanças
            </span>{" "}
            com inteligência
          </h1>
          
          <p className="text-sm text-gray-300 mb-8 leading-relaxed px-2">
            O sistema mais inteligente de gestão financeira. 
            Dashboard em tempo real, relatórios avançados e insights baseados em IA para 
            transformar sua relação com o dinheiro.
          </p>
          
          <div className="flex flex-col gap-3 mb-8 px-2">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-sm px-6 py-3" 
              onClick={handleRegisterClick}
            >
              Começar Grátis
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-green-500/20 text-white hover:bg-green-500/10 text-sm px-6 py-3" 
              onClick={handleRegisterClick}
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">10K+</div>
              <div className="text-gray-300 text-xs">Usuários ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">99.9%</div>
              <div className="text-gray-300 text-xs">Uptime garantido</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-1">24/7</div>
              <div className="text-gray-300 text-xs">Suporte disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-12 bg-black/40 backdrop-blur-sm">
        <div className="px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-4 py-2 mb-4">
              <Target className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-medium">Funcionalidades</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 px-2">
              Poderoso e Intuitivo
            </h2>
            <p className="text-sm text-gray-300 px-4">
              Tudo que você precisa para dominar suas finanças com tecnologia de ponta
            </p>
          </div>

          <div className="space-y-4">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Dashboard Inteligente</CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  Visualize suas finanças em tempo real com gráficos interativos e insights baseados em IA
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Controle de Entradas</CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  Registre e acompanhe todas as suas receitas com categorização inteligente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center mb-3">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Gestão de Saídas</CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  Monitore suas despesas e mantenha o controle total dos gastos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Gestão de Clientes</CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  Organize seus clientes e acompanhe todas as transações relacionadas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mb-3">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Cobranças Inteligentes</CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  Crie e gerencie cobranças com lembretes automáticos e acompanhamento
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-green-600 rounded-lg flex items-center justify-center mb-3">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Relatórios Avançados</CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  Exporte relatórios detalhados em PDF, Excel e JSON com análises completas
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12">
        <div className="px-4 text-center">
          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 px-2">
              Pronto para transformar suas finanças?
            </h2>
            <p className="text-sm text-gray-300 mb-8 px-4">
              Junte-se a milhares de usuários que já revolucionaram sua gestão financeira
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-sm px-8 py-3" 
              onClick={handleRegisterClick}
            >
              Começar Agora
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-green-500/20 bg-black/40 backdrop-blur-sm py-8">
        <div className="px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
              <DollarSign className="w-3 h-3 text-white" />
            </div>
            <span className="text-base font-bold text-white">FinanceAI</span>
          </div>
          <p className="text-gray-400 mb-4 text-xs">
            © 2024 FinanceAI. Todos os direitos reservados.
          </p>
          <div className="flex flex-col gap-2 text-xs text-gray-400">
            <a href="#" className="hover:text-green-400 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-green-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-green-400 transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 