import { useState, useEffect } from "react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Target,
  BarChart3,
  DollarSign,
  Users,
  Receipt,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao Finance AI!",
    description: "Sua plataforma inteligente de gestão financeira. Vamos configurar tudo em poucos passos.",
    icon: <Brain className="w-8 h-8 text-blue-600" />
  },
  {
    id: "dashboard",
    title: "Dashboard Inteligente",
    description: "Visualize seus dados financeiros em tempo real com análises automáticas e insights personalizados.",
    icon: <BarChart3 className="w-8 h-8 text-green-600" />,
    action: {
      label: "Explorar Dashboard",
      href: "/"
    }
  },
  {
    id: "transactions",
    title: "Gestão de Transações",
    description: "Registre entradas e saídas facilmente. Nosso sistema categoriza automaticamente suas transações.",
    icon: <DollarSign className="w-8 h-8 text-yellow-600" />,
    action: {
      label: "Criar Transação",
      href: "/entradas"
    }
  },
  {
    id: "clients",
    title: "Gestão de Clientes",
    description: "Cadastre seus clientes e acompanhe o histórico de transações de cada um.",
    icon: <Users className="w-8 h-8 text-purple-600" />,
    action: {
      label: "Cadastrar Cliente",
      href: "/clientes"
    }
  },
  {
    id: "billing",
    title: "Sistema de Cobranças",
    description: "Crie cobranças, acompanhe vencimentos e receba notificações automáticas.",
    icon: <Receipt className="w-8 h-8 text-red-600" />,
    action: {
      label: "Nova Cobrança",
      href: "/cobrancas"
    }
  },
  {
    id: "goals",
    title: "Metas Financeiras",
    description: "Defina metas inteligentes e acompanhe seu progresso com sugestões personalizadas da IA.",
    icon: <Target className="w-8 h-8 text-indigo-600" />,
    action: {
      label: "Definir Metas",
      href: "/metas"
    }
  },
  {
    id: "reports",
    title: "Relatórios Avançados",
    description: "Acesse relatórios detalhados com análises preditivas e recomendações inteligentes.",
    icon: <Brain className="w-8 h-8 text-pink-600" />,
    action: {
      label: "Ver Relatórios",
      href: "/relatorios"
    }
  }
];

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Onboarding({ isOpen, onClose }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCompletedSteps([]);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding-completed", "true");
    onClose();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleStepAction = (step: OnboardingStep) => {
    if (step.action) {
      window.location.href = step.action.href;
      setCompletedSteps([...completedSteps, step.id]);
    }
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  if (!isOpen) return null;

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              {currentStepData.icon}
              <div>
                <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Passo {currentStep + 1} de {onboardingSteps.length}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="px-6 py-3 bg-muted/20">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Action Button */}
            {currentStepData.action && (
              <div className="text-center mb-6">
                <Button 
                  onClick={() => handleStepAction(currentStepData)}
                  className="px-8"
                >
                  {currentStepData.action.label}
                </Button>
              </div>
            )}

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {onboardingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? "bg-primary"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <Button onClick={handleNext}>
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalizar
                  </>
                ) : (
                  <>
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook para verificar se o onboarding foi completado
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding-completed");
    if (!completed) {
      setShowOnboarding(true);
    }
  }, []);

  return {
    showOnboarding,
    setShowOnboarding
  };
} 