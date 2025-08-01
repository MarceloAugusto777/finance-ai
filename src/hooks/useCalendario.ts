import { useState, useEffect } from "react";
import { useCobrancas } from "./useCobrancas";
import { useEntradas } from "./useEntradas";
import { useSaidas } from "./useSaidas";
import { useToast } from "./use-toast";

interface EventoCalendario {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora?: string;
  tipo: "cobranca" | "lembrete" | "meta" | "transacao";
  cor: string;
  prioridade: "baixa" | "media" | "alta";
  repeticao?: "diaria" | "semanal" | "mensal" | "anual";
  ativo: boolean;
}

interface Lembrete {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  tipo: "cobranca" | "pagamento" | "meta" | "relatorio";
  ativo: boolean;
  notificado: boolean;
}

export function useCalendario() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { data: cobrancas = [] } = useCobrancas();
  const { data: entradas = [] } = useEntradas();
  const { data: saidas = [] } = useSaidas();

  useEffect(() => {
    carregarEventos();
    carregarLembretes();
  }, []);

  useEffect(() => {
    sincronizarCobrancasComCalendario();
  }, [cobrancas]);

  const carregarEventos = () => {
    const eventosSalvos = localStorage.getItem("calendario-eventos");
    if (eventosSalvos) {
      setEventos(JSON.parse(eventosSalvos));
    }
  };

  const carregarLembretes = () => {
    const lembretesSalvos = localStorage.getItem("calendario-lembretes");
    if (lembretesSalvos) {
      setLembretes(JSON.parse(lembretesSalvos));
    }
  };

  const sincronizarCobrancasComCalendario = () => {
    const novosEventos: EventoCalendario[] = [];
    
    cobrancas.forEach(cobranca => {
      // Criar evento para vencimento
      const eventoVencimento: EventoCalendario = {
        id: `cobranca-vencimento-${cobranca.id}`,
        titulo: `Vencimento: ${cobranca.descricao}`,
        descricao: `Cobrança de R$ ${Number(cobranca.valor).toFixed(2)} vence hoje`,
        data: cobranca.data_vencimento,
        tipo: "cobranca",
        cor: cobranca.status === "pendente" ? "#ef4444" : "#10b981",
        prioridade: "alta",
        ativo: true
      };
      
      // Criar evento para lembrete (3 dias antes)
      const dataLembrete = new Date(cobranca.data_vencimento);
      dataLembrete.setDate(dataLembrete.getDate() - 3);
      
      const eventoLembrete: EventoCalendario = {
        id: `cobranca-lembrete-${cobranca.id}`,
        titulo: `Lembrete: ${cobranca.descricao}`,
        descricao: `Cobrança vence em 3 dias`,
        data: dataLembrete.toISOString().split('T')[0],
        tipo: "lembrete",
        cor: "#f59e0b",
        prioridade: "media",
        ativo: true
      };
      
      novosEventos.push(eventoVencimento, eventoLembrete);
    });
    
    // Mesclar com eventos existentes
    const eventosExistentes = eventos.filter(e => !e.id.startsWith('cobranca-'));
    setEventos([...eventosExistentes, ...novosEventos]);
    
    // Salvar no localStorage
    localStorage.setItem("calendario-eventos", JSON.stringify([...eventosExistentes, ...novosEventos]));
  };

  const adicionarEvento = (evento: Omit<EventoCalendario, "id">) => {
    const novoEvento: EventoCalendario = {
      ...evento,
      id: Date.now().toString()
    };
    
    const eventosAtualizados = [...eventos, novoEvento];
    setEventos(eventosAtualizados);
    localStorage.setItem("calendario-eventos", JSON.stringify(eventosAtualizados));
    
    toast({
      title: "Evento adicionado!",
      description: "Evento adicionado ao calendário com sucesso.",
    });
  };

  const editarEvento = (id: string, dadosAtualizados: Partial<EventoCalendario>) => {
    const eventosAtualizados = eventos.map(evento => 
      evento.id === id ? { ...evento, ...dadosAtualizados } : evento
    );
    
    setEventos(eventosAtualizados);
    localStorage.setItem("calendario-eventos", JSON.stringify(eventosAtualizados));
    
    toast({
      title: "Evento atualizado!",
      description: "Evento atualizado com sucesso.",
    });
  };

  const removerEvento = (id: string) => {
    const eventosAtualizados = eventos.filter(evento => evento.id !== id);
    setEventos(eventosAtualizados);
    localStorage.setItem("calendario-eventos", JSON.stringify(eventosAtualizados));
    
    toast({
      title: "Evento removido!",
      description: "Evento removido do calendário.",
    });
  };

  const adicionarLembrete = (lembrete: Omit<Lembrete, "id" | "notificado">) => {
    const novoLembrete: Lembrete = {
      ...lembrete,
      id: Date.now().toString(),
      notificado: false
    };
    
    const lembretesAtualizados = [...lembretes, novoLembrete];
    setLembretes(lembretesAtualizados);
    localStorage.setItem("calendario-lembretes", JSON.stringify(lembretesAtualizados));
    
    toast({
      title: "Lembrete criado!",
      description: "Lembrete adicionado com sucesso.",
    });
  };

  const marcarLembreteComoNotificado = (id: string) => {
    const lembretesAtualizados = lembretes.map(lembrete => 
      lembrete.id === id ? { ...lembrete, notificado: true } : lembrete
    );
    
    setLembretes(lembretesAtualizados);
    localStorage.setItem("calendario-lembretes", JSON.stringify(lembretesAtualizados));
  };

  const obterEventosPorData = (data: string): EventoCalendario[] => {
    return eventos.filter(evento => evento.data === data && evento.ativo);
  };

  const obterEventosPorMes = (mes: number, ano: number): EventoCalendario[] => {
    return eventos.filter(evento => {
      const dataEvento = new Date(evento.data);
      return dataEvento.getMonth() === mes && 
             dataEvento.getFullYear() === ano && 
             evento.ativo;
    });
  };

  const obterLembretesPendentes = (): Lembrete[] => {
    const agora = new Date();
    return lembretes.filter(lembrete => {
      const dataLembrete = new Date(`${lembrete.data}T${lembrete.hora}`);
      return dataLembrete <= agora && !lembrete.notificado && lembrete.ativo;
    });
  };

  const verificarLembretes = () => {
    const lembretesPendentes = obterLembretesPendentes();
    
    lembretesPendentes.forEach(lembrete => {
      // Mostrar notificação
      toast({
        title: lembrete.titulo,
        description: lembrete.descricao,
        duration: 10000,
      });
      
      // Marcar como notificado
      marcarLembreteComoNotificado(lembrete.id);
    });
  };

  const gerarLembretesAutomaticos = () => {
    const lembretesAutomaticos: Lembrete[] = [];
    
    // Lembrete de backup semanal
    lembretesAutomaticos.push({
      id: "backup-semanal",
      titulo: "Backup Semanal",
      descricao: "Realize o backup dos seus dados financeiros",
      data: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: "10:00",
      tipo: "relatorio",
      ativo: true,
      notificado: false
    });
    
    // Lembrete de revisão mensal
    lembretesAutomaticos.push({
      id: "revisao-mensal",
      titulo: "Revisão Mensal",
      descricao: "Revise suas metas e planejamento financeiro",
      data: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: "14:00",
      tipo: "meta",
      ativo: true,
      notificado: false
    });
    
    setLembretes(prev => [...prev, ...lembretesAutomaticos]);
  };

  const exportarCalendario = (formato: "ics" | "json") => {
    try {
      let conteudo: string;
      let nomeArquivo: string;
      
      if (formato === "ics") {
        // Gerar arquivo ICS (formato de calendário)
        conteudo = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//FinanceAI//Calendario//PT",
          ...eventos.map(evento => [
            "BEGIN:VEVENT",
            `UID:${evento.id}`,
            `DTSTART:${evento.data.replace(/-/g, '')}`,
            `SUMMARY:${evento.titulo}`,
            `DESCRIPTION:${evento.descricao}`,
            `PRIORITY:${evento.prioridade === 'alta' ? '1' : evento.prioridade === 'media' ? '5' : '9'}`,
            "END:VEVENT"
          ].join("\r\n")),
          "END:VCALENDAR"
        ].join("\r\n");
        
        nomeArquivo = `calendario-financeiro-${new Date().toISOString().split('T')[0]}.ics`;
      } else {
        // Gerar arquivo JSON
        conteudo = JSON.stringify({ eventos, lembretes }, null, 2);
        nomeArquivo = `calendario-financeiro-${new Date().toISOString().split('T')[0]}.json`;
      }
      
      // Criar arquivo para download
      const blob = new Blob([conteudo], { 
        type: formato === "ics" ? "text/calendar" : "application/json" 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Calendário exportado!",
        description: `Calendário exportado em formato ${formato.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação!",
        description: "Erro ao exportar calendário.",
        variant: "destructive",
      });
    }
  };

  // Verificar lembretes a cada minuto
  useEffect(() => {
    verificarLembretes();
    const interval = setInterval(verificarLembretes, 60 * 1000);
    return () => clearInterval(interval);
  }, [lembretes]);

  return {
    eventos,
    lembretes,
    isLoading,
    adicionarEvento,
    editarEvento,
    removerEvento,
    adicionarLembrete,
    obterEventosPorData,
    obterEventosPorMes,
    obterLembretesPendentes,
    gerarLembretesAutomaticos,
    exportarCalendario,
    sincronizarCobrancasComCalendario
  };
} 