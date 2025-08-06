import { Link } from "react-router-dom";
import { 
  Users, 
  Target, 
  Shield, 
  Zap,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Receipt,
  Bot,
  MessageCircle,
  DollarSign,
  Globe,
  Smartphone,
  CheckCircle,
  Star,
  Award,
  Heart,
  Code,
  Database,
  Lock,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Sobre() {
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
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FinanceAI</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
              Início
            </Link>
            <Link to="/contato" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
              Contato
            </Link>
          </nav>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-green-500/20 border-green-500/20" 
              asChild
            >
              <Link to="/auth/login">
                Login
              </Link>
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300" 
              asChild
            >
              <Link to="/auth/register">
                Começar Grátis
              </Link>
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
            <span className="text-white/90 text-xs md:text-sm font-medium">Sobre o FinanceAI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight px-2">
            Revolucionando a{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              gestão financeira
            </span>{" "}
            com IA
          </h1>
          
          <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            O FinanceAI nasceu da necessidade de simplificar e automatizar a gestão financeira 
            para pequenos e médios negócios, oferecendo uma solução completa e inteligente.
          </p>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="relative py-16 md:py-32 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-2xl">Nossa Missão</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Democratizar o acesso à tecnologia financeira avançada, 
                  permitindo que qualquer pessoa ou empresa tenha controle total 
                  sobre suas finanças de forma simples e inteligente.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-2xl">Nossa Visão</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Ser a plataforma líder em gestão financeira inteligente, 
                  conectando pessoas e negócios através da tecnologia mais 
                  avançada em IA e automação.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="relative py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
              Nossos Valores
            </h2>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Princípios que guiam nossa jornada de inovação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Simplicidade</CardTitle>
                <CardDescription className="text-gray-300">
                  Acreditamos que a melhor tecnologia é aquela que você nem percebe que está usando.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Segurança</CardTitle>
                <CardDescription className="text-gray-300">
                  Sua privacidade e dados estão sempre protegidos com as melhores práticas de segurança.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Inovação</CardTitle>
                <CardDescription className="text-gray-300">
                  Estamos sempre buscando novas formas de melhorar sua experiência financeira.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Comunidade</CardTitle>
                <CardDescription className="text-gray-300">
                  Construímos juntos uma comunidade de usuários que compartilham conhecimento.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Excelência</CardTitle>
                <CardDescription className="text-gray-300">
                  Buscamos a excelência em tudo que fazemos, desde o código até o atendimento.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Disponibilidade</CardTitle>
                <CardDescription className="text-gray-300">
                  Estamos sempre disponíveis para ajudar você a alcançar seus objetivos financeiros.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tecnologia */}
      <section className="relative py-16 md:py-32 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
              Tecnologia de Ponta
            </h2>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Utilizamos as tecnologias mais modernas para garantir performance e segurança
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white">React & TypeScript</CardTitle>
                <CardDescription className="text-gray-300">
                  Interface moderna e responsiva
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white">Supabase</CardTitle>
                <CardDescription className="text-gray-300">
                  Banco de dados em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white">Segurança</CardTitle>
                <CardDescription className="text-gray-300">
                  Criptografia de ponta a ponta
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white">PWA</CardTitle>
                <CardDescription className="text-gray-300">
                  Funciona offline como app nativo
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="relative py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
              Números que Inspiram
            </h2>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Resultados que mostram nosso compromisso com a excelência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-gray-300 text-lg">Usuários Ativos</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className="text-gray-300 text-lg">Uptime</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-gray-300 text-lg">Suporte</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">4.9★</div>
              <div className="text-gray-300 text-lg">Avaliação</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-32 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 px-4">
              Junte-se à Revolução Financeira
            </h2>
            <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              Faça parte da comunidade que está transformando a gestão financeira
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-base md:text-lg px-8 md:px-12 py-4 md:py-6" 
                asChild
              >
                <Link to="/auth/register">
                  Começar Grátis
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-green-500/20 text-white hover:bg-green-500/10 text-base md:text-lg px-8 md:px-12 py-4 md:py-6" 
                asChild
              >
                <Link to="/contato">
                  Falar Conosco
                </Link>
              </Button>
            </div>
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
            <Link to="/" className="hover:text-green-400 transition-colors">Início</Link>
            <Link to="/contato" className="hover:text-green-400 transition-colors">Contato</Link>
            <a href="#" className="hover:text-green-400 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-green-400 transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}