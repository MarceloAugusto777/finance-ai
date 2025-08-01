import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Calendar,
  Eye,
  EyeOff,
  Key,
  Settings,
  Bell,
  CreditCard,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserProfileData {
  nome: string;
  email: string;
  contato: string;
}

export function UserProfile() {
  const [formData, setFormData] = useState<UserProfileData>({
    nome: "",
    email: "",
    contato: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<UserProfileData>({
    nome: "",
    email: "",
    contato: "",
  });

  const { user, updateProfile, getUserProfile } = useAuthContext();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getUserProfile();
        if (profile) {
          const newData = {
            nome: profile.nome || "",
            email: profile.email || user?.email || "",
            contato: profile.contato || "",
          };
          setFormData(newData);
          setOriginalData(newData);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar suas informações.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user, getUserProfile, toast]);

  // Verificar mudanças
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [formData, originalData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateProfile({
        nome: formData.nome,
        contato: formData.contato || undefined,
      });

      if (result.success) {
        setOriginalData(formData);
        setHasChanges(false);
        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao atualizar",
          description: result.error || "Não foi possível salvar as alterações.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Avatar */}
      <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border">
        <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
          <AvatarImage src="" alt={formData.nome} />
          <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
            {getInitials(formData.nome || user?.email || "U")}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {formData.nome || "Usuário"}
          </h1>
          <p className="text-muted-foreground">{formData.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={user?.email_confirmed_at ? "default" : "secondary"}>
              {user?.email_confirmed_at ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Email Confirmado
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Email Pendente
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Formulário Principal */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-background to-muted/20">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Atualize suas informações de contato e preferências
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <label htmlFor="nome" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome completo
              </label>
              <div className="relative group">
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <div className="relative group">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  className="pl-10 bg-muted/50 cursor-not-allowed"
                  disabled
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                O email não pode ser alterado. Entre em contato com o suporte se necessário.
              </p>
            </div>

            {/* Contato */}
            <div className="space-y-2">
              <label htmlFor="contato" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contato
              </label>
              <div className="relative group">
                <Input
                  id="contato"
                  name="contato"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.contato}
                  onChange={handleInputChange}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {/* Botão de Salvar */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Salvando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    {hasChanges ? "Salvar Alterações" : "Nenhuma alteração"}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Informações da Conta
          </CardTitle>
          <CardDescription>
            Detalhes técnicos da sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  ID do usuário
                </span>
                <span className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                  {user?.id}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Membro desde
                </span>
                <span className="text-sm">
                  {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Status do email
                </span>
                <Badge variant={user?.email_confirmed_at ? "default" : "secondary"}>
                  {user?.email_confirmed_at ? "Confirmado" : "Pendente"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notificações
                </span>
                <Badge variant="outline">Ativas</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesse funcionalidades importantes da sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" className="h-12 justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
            
            <Button variant="outline" className="h-12 justify-start">
              <Bell className="w-4 h-4 mr-2" />
              Configurar Notificações
            </Button>
            
            <Button variant="outline" className="h-12 justify-start">
              <Eye className="w-4 h-4 mr-2" />
              Histórico de Login
            </Button>
            
            <Button variant="outline" className="h-12 justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Preferências
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 