import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, DollarSign, LogIn, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular envio
    setTimeout(() => {
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
            <Link to="/sobre" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
              Sobre
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

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full px-4 md:px-6 py-2 mb-6 md:mb-8">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-white/90 text-xs md:text-sm font-medium">Entre em Contato</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight px-2">
              Fale{" "}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Conosco
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Estamos aqui para ajudar. Envie sua mensagem que responderemos em breve.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl">Enviar Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-white">Nome *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      placeholder="Seu nome completo"
                      className="bg-black/40 border-green-500/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="seu@email.com"
                      className="bg-black/40 border-green-500/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assunto" className="text-white">Assunto *</Label>
                    <Input
                      id="assunto"
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      required
                      placeholder="Assunto da mensagem"
                      className="bg-black/40 border-green-500/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensagem" className="text-white">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      required
                      placeholder="Descreva sua dúvida ou sugestão..."
                      rows={6}
                      className="bg-black/40 border-green-500/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                    disabled={isLoading}
                  >
                    <Send className="w-4 h-4" />
                    {isLoading ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Email</p>
                      <p className="text-sm text-gray-300">contato@financeai.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Telefone</p>
                      <p className="text-sm text-gray-300">(11) 9999-9999</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Endereço</p>
                      <p className="text-sm text-gray-300">
                        São Paulo, SP<br />
                        Brasil
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Horário de Atendimento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Segunda - Sexta:</span>
                    <span>9h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span>9h às 12h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span>Fechado</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

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
            <Link to="/sobre" className="hover:text-green-400 transition-colors">Sobre</Link>
            <a href="#" className="hover:text-green-400 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-green-400 transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}