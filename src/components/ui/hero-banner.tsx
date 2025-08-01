import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Sparkles } from "lucide-react";
import heroImage from "@/assets/dashboard-hero.jpg";

interface HeroBannerProps {
  onDismiss?: () => void;
}

export function HeroBanner({ onDismiss }: HeroBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <Card className="relative overflow-hidden finance-card border-primary/20 bg-gradient-to-r from-primary/10 to-info/10 mb-6">
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="Financial Dashboard" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  {greeting()}! Bem-vindo ao FinanceAI
                </h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Seu dashboard financeiro inteligente está pronto para te ajudar a 
                gerenciar suas finanças de forma eficiente e moderna. 
                Explore as funcionalidades e mantenha suas finanças organizadas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="default" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Explorar Recursos
              </Button>
              <Button variant="outline">
                Ver Tutorial
              </Button>
            </div>
          </div>

          <div className="hidden lg:block text-right text-sm text-muted-foreground">
            <div className="space-y-1">
              <p>{currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className="text-lg font-mono">
                {currentTime.toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}