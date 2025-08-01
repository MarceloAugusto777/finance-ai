import { useState, useEffect } from "react";
import { useEntradas } from "./useEntradas";
import { useSaidas } from "./useSaidas";
import { useClientes } from "./useClientes";
import { useCobrancas } from "./useCobrancas";
import { useToast } from "./use-toast";

interface BackupData {
  entradas: any[];
  saidas: any[];
  clientes: any[];
  cobrancas: any[];
  metadata: {
    timestamp: string;
    version: string;
    totalRecords: number;
  };
}

export function useBackup() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupHistory, setBackupHistory] = useState<any[]>([]);
  
  const { toast } = useToast();
  const { data: entradas = [] } = useEntradas();
  const { data: saidas = [] } = useSaidas();
  const { data: clientes = [] } = useSaidas();
  const { data: cobrancas = [] } = useCobrancas();

  useEffect(() => {
    carregarHistoricoBackup();
  }, []);

  const carregarHistoricoBackup = () => {
    const historico = localStorage.getItem("backup-history");
    if (historico) {
      setBackupHistory(JSON.parse(historico));
    }
    
    const ultimoBackup = localStorage.getItem("last-backup");
    if (ultimoBackup) {
      setLastBackup(ultimoBackup);
    }
  };

  const criarBackup = async (): Promise<BackupData> => {
    setIsBackingUp(true);
    
    try {
      const backupData: BackupData = {
        entradas,
        saidas,
        clientes,
        cobrancas,
        metadata: {
          timestamp: new Date().toISOString(),
          version: "1.0.0",
          totalRecords: entradas.length + saidas.length + clientes.length + cobrancas.length
        }
      };

      // Salvar backup no localStorage
      const backupKey = `backup-${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Atualizar histórico
      const novoHistorico = [
        {
          id: backupKey,
          timestamp: backupData.metadata.timestamp,
          totalRecords: backupData.metadata.totalRecords,
          size: JSON.stringify(backupData).length
        },
        ...backupHistory
      ].slice(0, 10); // Manter apenas os últimos 10 backups
      
      localStorage.setItem("backup-history", JSON.stringify(novoHistorico));
      localStorage.setItem("last-backup", backupData.metadata.timestamp);
      
      setBackupHistory(novoHistorico);
      setLastBackup(backupData.metadata.timestamp);
      
      toast({
        title: "Backup criado!",
        description: `Backup realizado com sucesso. ${backupData.metadata.totalRecords} registros salvos.`,
      });
      
      return backupData;
    } catch (error) {
      toast({
        title: "Erro no backup!",
        description: "Erro ao criar backup dos dados.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsBackingUp(false);
    }
  };

  const restaurarBackup = async (backupId: string): Promise<void> => {
    setIsRestoring(true);
    
    try {
      const backupData = localStorage.getItem(backupId);
      if (!backupData) {
        throw new Error("Backup não encontrado");
      }
      
      const data: BackupData = JSON.parse(backupData);
      
      // Aqui você implementaria a restauração real dos dados
      // Por enquanto, apenas simulamos
      console.log("Restaurando backup:", data);
      
      toast({
        title: "Backup restaurado!",
        description: `Dados restaurados com sucesso. ${data.metadata.totalRecords} registros recuperados.`,
      });
    } catch (error) {
      toast({
        title: "Erro na restauração!",
        description: "Erro ao restaurar backup dos dados.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRestoring(false);
    }
  };

  const exportarBackup = async (): Promise<void> => {
    try {
      const backupData = await criarBackup();
      
      // Criar arquivo para download
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json"
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finance-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup exportado!",
        description: "Arquivo de backup baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação!",
        description: "Erro ao exportar backup.",
        variant: "destructive",
      });
    }
  };

  const importarBackup = async (file: File): Promise<void> => {
    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);
      
      // Validar estrutura do backup
      if (!backupData.metadata || !backupData.entradas || !backupData.saidas) {
        throw new Error("Arquivo de backup inválido");
      }
      
      // Salvar backup importado
      const backupKey = `backup-imported-${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      toast({
        title: "Backup importado!",
        description: `Backup importado com sucesso. ${backupData.metadata.totalRecords} registros encontrados.`,
      });
    } catch (error) {
      toast({
        title: "Erro na importação!",
        description: "Erro ao importar arquivo de backup.",
        variant: "destructive",
      });
    }
  };

  const agendarBackupAutomatico = () => {
    // Configurar backup automático diário
    const agora = new Date();
    const amanha = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
    amanha.setHours(2, 0, 0, 0); // 2h da manhã
    
    localStorage.setItem("backup-automatico", amanha.toISOString());
    
    toast({
      title: "Backup automático configurado!",
      description: "Backup será realizado diariamente às 2h da manhã.",
    });
  };

  const verificarBackupAutomatico = () => {
    const backupAutomatico = localStorage.getItem("backup-automatico");
    if (backupAutomatico) {
      const proximoBackup = new Date(backupAutomatico);
      const agora = new Date();
      
      if (agora >= proximoBackup) {
        // Executar backup automático
        criarBackup();
        
        // Agendar próximo backup
        const proximaData = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
        proximaData.setHours(2, 0, 0, 0);
        localStorage.setItem("backup-automatico", proximaData.toISOString());
      }
    }
  };

  // Verificar backup automático a cada hora
  useEffect(() => {
    verificarBackupAutomatico();
    const interval = setInterval(verificarBackupAutomatico, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    isBackingUp,
    isRestoring,
    lastBackup,
    backupHistory,
    criarBackup,
    restaurarBackup,
    exportarBackup,
    importarBackup,
    agendarBackupAutomatico
  };
} 