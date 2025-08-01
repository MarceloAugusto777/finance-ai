import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, BarChart3, Users } from "lucide-react";

const Sobre = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Análise Avançada",
      description: "Gráficos e relatórios detalhados para tomada de decisão"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Seus dados protegidos com criptografia de ponta"
    },
    {
      icon: Zap,
      title: "Interface Moderna",
      description: "Design intuitivo e responsivo para melhor experiência"
    },
    {
      icon: Users,
      title: "Gestão de Clientes",
      description: "Controle completo de clientes e cobranças"
    }
  ];

  return (
    <Layout title="Sobre">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Section */}
        <Card className="finance-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/20">
                <BarChart3 className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl">FinanceAI</CardTitle>
            <p className="text-lg text-muted-foreground">
              Sua solução completa para gestão financeira inteligente
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Versão 1.0
              </Badge>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                O FinanceAI é uma plataforma moderna e segura que permite controlar suas finanças
                de forma inteligente, com recursos avançados de análise e gestão de dados financeiros.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="text-xl">Principais Funcionalidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg bg-background/60 border border-border/20">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="text-xl">Nossa Missão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Acreditamos que a gestão financeira deve ser simples, segura e inteligente.
              Nossa missão é democratizar o acesso a ferramentas de análise financeira
              avançadas, permitindo que pessoas e empresas tomem decisões mais assertivas.
            </p>
            <p>
              Com tecnologia de ponta e foco na experiência do usuário, o FinanceAI
              transforma dados complexos em insights claros e acionáveis.
            </p>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="text-xl">Tecnologia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Desenvolvido com as mais modernas tecnologias web, incluindo React, TypeScript,
              Tailwind CSS e Supabase, garantindo performance, segurança e escalabilidade.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["React", "TypeScript", "Tailwind CSS", "Supabase", "Recharts"].map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sobre;