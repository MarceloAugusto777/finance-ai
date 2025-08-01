import { useState } from "react";
import { 
  Settings, 
  Download, 
  Upload, 
  Calendar, 
  Bell, 
  Shield, 
  Database,
  FileText,
  Clock,
  Save,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Eye
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useBackup } from "@/hooks/useBackup";
import { useExportacao } from "@/hooks/useExportacao";
import { useCalendario } from "@/hooks/useCalendario";
import { useToast } from "@/hooks/use-toast";
import { Loading } from "@/components/ui/loading";
import { BackupManager } from "@/components/backup/BackupManager";
import RelatorioExporter from "@/components/exportacao/RelatorioExporter";
import { CalendarioVisual } from "@/components/calendario/CalendarioVisual";
import { UserProfile } from "@/components/auth/UserProfile";
import { DebugConnection } from "@/components/DebugConnection";

const Configuracoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { toast } = useToast();
  const { 
    isBackingUp, 
    lastBackup, 
    backupHistory, 
    criarBackup, 
    restaurarBackup, 
    exportarBackup, 
    importarBackup, 
    agendarBackupAutomatico 
  } = useBackup();
  
  const { 
    exportarPDF, 
    exportarExcel, 
    exportarJSON, 
    exportarRelatorioMensal, 
    exportarRelatorioAnual 
  } = useExportacao();
  
  const { 
    eventos, 
    lembretes, 
    exportarCalendario, 
    gerarLembretesAutomaticos 
  } = useCalendario();

  // Estados para configurações
  const [configuracoes, setConfiguracoes] = useState({
    backupAutomatico: false,
    notificacoes: true,
    tema: "system",
    idioma: "pt-BR",
    timezone: "America/Sao_Paulo",
    formatoMoeda: "BRL",
    formatoData: "dd/MM/yyyy"
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImportarBackup = async () => {
    if (selectedFile) {
      await importarBackup(selectedFile);
      setIsModalOpen(false);
      setSelectedFile(null);
    }
  };

  const handleExportarRelatorio = async (tipo: "pdf" | "excel" | "json") => {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    switch (tipo) {
      case "pdf":
        await exportarPDF(inicioMes.toISOString().split('T')[0], fimMes.toISOString().split('T')[0]);
        break;
      case "excel":
        await exportarExcel(inicioMes.toISOString().split('T')[0], fimMes.toISOString().split('T')[0]);
        break;
      case "json":
        await exportarJSON(inicioMes.toISOString().split('T')[0], fimMes.toISOString().split('T')[0]);
        break;
    }
  };

  const handleRestaurarBackup = async (backupId: string) => {
    if (confirm("Tem certeza que deseja restaurar este backup? Os dados atuais serão substituídos.")) {
      await restaurarBackup(backupId);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const formatarTamanho = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Layout title="Configurações">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas preferências e funcionalidades avançadas
            </p>
          </div>
        </div>

        <Tabs defaultValue="perfil" className="space-y-4">
          <TabsList>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restauração</TabsTrigger>
            <TabsTrigger value="exportacao">Exportação</TabsTrigger>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
            <TabsTrigger value="geral">Geral</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="space-y-4">
            <UserProfile />
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <BackupManager />
          </TabsContent>

          <TabsContent value="exportacao" className="space-y-4">
            <RelatorioExporter />
          </TabsContent>

          <TabsContent value="calendario" className="space-y-4">
            <CalendarioVisual />
          </TabsContent>

          <TabsContent value="debug" className="space-y-4">
            <DebugConnection />
          </TabsContent>

          <TabsContent value="geral" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Configurações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configurações Gerais
                  </CardTitle>
                  <CardDescription>
                    Preferências do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tema</label>
                    <Select value={configuracoes.tema} onValueChange={(value) => setConfiguracoes(prev => ({ ...prev, tema: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Idioma</label>
                    <Select value={configuracoes.idioma} onValueChange={(value) => setConfiguracoes(prev => ({ ...prev, idioma: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fuso Horário</label>
                    <Select value={configuracoes.timezone} onValueChange={(value) => setConfiguracoes(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notificações */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificações
                  </CardTitle>
                  <CardDescription>
                    Configure suas notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notificações gerais</span>
                    <Switch 
                      checked={configuracoes.notificacoes}
                      onCheckedChange={(checked) => setConfiguracoes(prev => ({ ...prev, notificacoes: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alertas de cobrança</span>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lembretes de backup</span>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Relatórios semanais</span>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Segurança */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Segurança
                  </CardTitle>
                  <CardDescription>
                    Configurações de segurança
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Alterar Senha
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Autenticação 2FA
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Histórico de Login
                  </Button>
                </CardContent>
              </Card>

              {/* Limpeza de Dados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Limpeza de Dados
                  </CardTitle>
                  <CardDescription>
                    Gerencie o armazenamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Cache
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Histórico
                  </Button>
                  
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Conta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Configuracoes; 