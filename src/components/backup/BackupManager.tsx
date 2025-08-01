import { useState, useEffect } from "react";
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Trash2,
  Eye,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useBackup } from "@/hooks/useBackup";
import { useToast } from "@/hooks/use-toast";

interface BackupManagerProps {
  className?: string;
}

export function BackupManager({ className }: BackupManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backupConfig, setBackupConfig] = useState({
    automatico: false,
    frequencia: "diario",
    hora: "02:00",
    manterBackups: 10,
    notificar: true
  });

  const { toast } = useToast();
  const { 
    isBackingUp, 
    isRestoring, 
    lastBackup, 
    backupHistory, 
    criarBackup, 
    restaurarBackup, 
    exportarBackup, 
    importarBackup, 
    agendarBackupAutomatico 
  } = useBackup();

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

  const obterStatusBackup = () => {
    if (!lastBackup) return "Nunca realizado";
    
    const ultimoBackup = new Date(lastBackup);
    const agora = new Date();
    const diffDias = Math.floor((agora.getTime() - ultimoBackup.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) return "Hoje";
    if (diffDias === 1) return "Ontem";
    if (diffDias < 7) return `${diffDias} dias atrás`;
    if (diffDias < 30) return `${Math.floor(diffDias / 7)} semanas atrás`;
    return `${Math.floor(diffDias / 30)} meses atrás`;
  };

  const obterCorStatus = (status: string) => {
    if (status === "Hoje") return "text-green-600";
    if (status === "Ontem") return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Status do Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Status do Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Último backup:</span>
              <span className={`text-sm font-medium ${obterCorStatus(obterStatusBackup())}`}>
                {obterStatusBackup()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Total de backups:</span>
              <Badge variant="secondary">{backupHistory.length}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Backup automático:</span>
              <Switch 
                checked={backupConfig.automatico}
                onCheckedChange={(checked) => {
                  setBackupConfig(prev => ({ ...prev, automatico: checked }));
                  if (checked) {
                    agendarBackupAutomatico();
                  }
                }}
              />
            </div>
            
            <Button 
              onClick={criarBackup} 
              disabled={isBackingUp}
              className="w-full"
            >
              {isBackingUp ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Criar Backup
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequência</label>
              <Select 
                value={backupConfig.frequencia} 
                onValueChange={(value) => setBackupConfig(prev => ({ ...prev, frequencia: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora do backup</label>
              <Input
                type="time"
                value={backupConfig.hora}
                onChange={(e) => setBackupConfig(prev => ({ ...prev, hora: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Manter backups</label>
              <Select 
                value={backupConfig.manterBackups.toString()} 
                onValueChange={(value) => setBackupConfig(prev => ({ ...prev, manterBackups: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 backups</SelectItem>
                  <SelectItem value="10">10 backups</SelectItem>
                  <SelectItem value="20">20 backups</SelectItem>
                  <SelectItem value="50">50 backups</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Notificações</span>
              <Switch 
                checked={backupConfig.notificar}
                onCheckedChange={(checked) => setBackupConfig(prev => ({ ...prev, notificar: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Ações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              onClick={exportarBackup}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Backup
            </Button>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Backup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importar Backup</DialogTitle>
                  <DialogDescription>
                    Selecione um arquivo de backup para restaurar
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                  />
                  
                  {selectedFile && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatarTamanho(selectedFile.size)}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleImportarBackup} disabled={!selectedFile}>
                      Importar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={agendarBackupAutomatico}
              className="w-full"
            >
              <Clock className="w-4 h-4 mr-2" />
              Agendar Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Backups */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Histórico de Backups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {backupHistory.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum backup encontrado</p>
              <p className="text-sm text-muted-foreground">
                Crie seu primeiro backup para começar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {backupHistory.map((backup) => (
                <div 
                  key={backup.id} 
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Database className="w-4 h-4 text-primary" />
                    </div>
                    
                    <div>
                      <p className="font-medium">
                        Backup de {formatarData(backup.timestamp)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{backup.totalRecords} registros</span>
                        <span>{formatarTamanho(backup.size)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestaurarBackup(backup.id)}
                      disabled={isRestoring}
                    >
                      {isRestoring ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Implementar visualização detalhada
                        toast({
                          title: "Visualizar Backup",
                          description: "Funcionalidade em desenvolvimento",
                        });
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 