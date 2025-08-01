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
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Finance AI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Preços
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sobre
            </a>
            <button 
              onClick={handleContactClick}
              className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
              style={{ textDecoration: 'none', zIndex: 10, position: 'relative' }}
            >
              Contato
            </button>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white" onClick={handleLoginClick} style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
              <LogIn className="mr-2 w-4 h-4" />
              Login
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={handleRegisterClick} style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Gerencie suas{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              finanças
            </span>{" "}
            com inteligência
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            O sistema mais completo de gestão financeira para empresas e profissionais. 
            Dashboard intuitivo, relatórios avançados e backup automático.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={handleRegisterClick} style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
              Começar Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleRegisterClick} style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
              Ver Demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Usuários ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime garantido</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Suporte disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades que transformam
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar suas finanças de forma profissional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Dashboard Intuitivo</CardTitle>
                <CardDescription>
                  Visualize suas finanças em tempo real com gráficos interativos e métricas importantes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Relatórios Avançados</CardTitle>
                <CardDescription>
                  Exporte relatórios em PDF, Excel e JSON com filtros personalizados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Backup Automático</CardTitle>
                <CardDescription>
                  Seus dados são protegidos com backup automático e criptografia
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Calendário Integrado</CardTitle>
                <CardDescription>
                  Sincronize cobranças e eventos com seu calendário pessoal
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Segurança Total</CardTitle>
                <CardDescription>
                  Dados criptografados e autenticação de dois fatores
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Performance Otimizada</CardTitle>
                <CardDescription>
                  Interface rápida e responsiva que funciona em qualquer dispositivo
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos que se adaptam ao seu negócio
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plano Gratuito */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Gratuito</CardTitle>
                <div className="text-4xl font-bold text-gray-900">R$ 0</div>
                <CardDescription>Para começar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Até 100 transações/mês</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Dashboard básico</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Relatórios básicos</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Suporte por email</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={handleRegisterClick} style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Plano Profissional */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Profissional</CardTitle>
                <div className="text-4xl font-bold text-gray-900">R$ 29</div>
                <CardDescription>Por mês</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Transações ilimitadas</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Dashboard completo</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Relatórios avançados</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Backup automático</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Calendário integrado</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Suporte prioritário</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={handleRegisterClick} style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
                  Começar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Plano Empresarial */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Empresarial</CardTitle>
                <div className="text-4xl font-bold text-gray-900">R$ 99</div>
                <CardDescription>Por mês</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Tudo do Profissional</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Múltiplos usuários</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>API personalizada</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Integrações avançadas</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Suporte dedicado</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={handleContactClick} style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
                  Falar com Vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "O Finance AI revolucionou a forma como gerencio minhas finanças. 
                  Interface intuitiva e relatórios detalhados."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold">João Silva</div>
                    <div className="text-sm text-gray-500">Consultor Financeiro</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Backup automático e sincronização com calendário são diferenciais 
                  que não encontrei em outros sistemas."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold">Maria Santos</div>
                    <div className="text-sm text-gray-500">Empresária</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Suporte excelente e funcionalidades que realmente fazem diferença 
                  no dia a dia da empresa."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold">Carlos Oliveira</div>
                    <div className="text-sm text-gray-500">Diretor Financeiro</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Comece a gerenciar suas finanças hoje
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já confiam no Finance AI 
            para gerenciar suas finanças de forma inteligente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={handleRegisterClick} style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
              Começar Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" onClick={handleContactClick} style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}>
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold">Finance AI</span>
              </div>
              <p className="text-gray-400">
                Sistema de gestão financeira inteligente para empresas e profissionais.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Preços</a></li>
                <li><button onClick={handleRegisterClick} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-gray-400" style={{ textDecoration: 'none', zIndex: 10, position: 'relative' }}>Cadastro</button></li>
                <li><button onClick={handleLoginClick} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-gray-400" style={{ textDecoration: 'none', zIndex: 10, position: 'relative' }}>Login</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={handleContactClick} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-gray-400" style={{ textDecoration: 'none' }}>Contato</button></li>
                <li><button onClick={() => navigate('/sobre')} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-gray-400" style={{ textDecoration: 'none' }}>Sobre</button></li>
                <li><button onClick={() => navigate('/politica-privacidade')} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-gray-400" style={{ textDecoration: 'none' }}>Privacidade</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Imprensa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parceiros</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Finance AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 