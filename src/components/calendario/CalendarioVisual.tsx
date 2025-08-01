import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus, Bell, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCalendario } from "@/hooks/useCalendario";
import { useToast } from "@/hooks/use-toast";

interface CalendarioVisualProps {
  className?: string;
}

export function CalendarioVisual({ className }: CalendarioVisualProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    descricao: "",
    data: "",
    hora: "",
    tipo: "lembrete" as const,
    prioridade: "media" as const
  });

  const { toast } = useToast();
  const { 
    eventos, 
    lembretes, 
    adicionarEvento, 
    obterEventosPorData,
    obterLembretesPendentes 
  } = useCalendario();

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const obterDiasMes = (data: Date) => {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const primeiroDiaSemana = primeiroDia.getDay();

    const dias = [];
    
    // Adicionar dias vazios do início
    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push(null);
    }
    
    // Adicionar dias do mês
    for (let i = 1; i <= diasNoMes; i++) {
      dias.push(new Date(ano, mes, i));
    }
    
    return dias;
  };

  const obterEventosDia = (data: Date) => {
    const dataString = data.toISOString().split('T')[0];
    return obterEventosPorData(dataString);
  };

  const obterCorEvento = (tipo: string) => {
    switch (tipo) {
      case "cobranca": return "bg-red-500";
      case "lembrete": return "bg-yellow-500";
      case "meta": return "bg-blue-500";
      case "transacao": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const obterCorPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "border-red-500";
      case "media": return "border-yellow-500";
      case "baixa": return "border-green-500";
      default: return "border-gray-500";
    }
  };

  const mesAnterior = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const proximoMes = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const hoje = new Date();
  const dias = obterDiasMes(currentDate);
  const lembretesPendentes = obterLembretesPendentes();

  const handleAdicionarEvento = () => {
    if (!novoEvento.titulo || !novoEvento.data) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e a data do evento.",
        variant: "destructive",
      });
      return;
    }

    adicionarEvento({
      titulo: novoEvento.titulo,
      descricao: novoEvento.descricao,
      data: novoEvento.data,
      hora: novoEvento.hora,
      tipo: novoEvento.tipo,
      cor: obterCorEvento(novoEvento.tipo),
      prioridade: novoEvento.prioridade,
      ativo: true
    });

    setNovoEvento({
      titulo: "",
      descricao: "",
      data: "",
      hora: "",
      tipo: "lembrete",
      prioridade: "media"
    });
    setIsModalOpen(false);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendário Financeiro
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {lembretesPendentes.length > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  {lembretesPendentes.length}
                </Badge>
              )}
              
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Evento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Evento</DialogTitle>
                    <DialogDescription>
                      Crie um novo evento no calendário
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Título</label>
                      <Input
                        value={novoEvento.titulo}
                        onChange={(e) => setNovoEvento(prev => ({ ...prev, titulo: e.target.value }))}
                        placeholder="Título do evento"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descrição</label>
                      <Textarea
                        value={novoEvento.descricao}
                        onChange={(e) => setNovoEvento(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Descrição do evento"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data</label>
                        <Input
                          type="date"
                          value={novoEvento.data}
                          onChange={(e) => setNovoEvento(prev => ({ ...prev, data: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Hora</label>
                        <Input
                          type="time"
                          value={novoEvento.hora}
                          onChange={(e) => setNovoEvento(prev => ({ ...prev, hora: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo</label>
                        <Select value={novoEvento.tipo} onValueChange={(value: any) => setNovoEvento(prev => ({ ...prev, tipo: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lembrete">Lembrete</SelectItem>
                            <SelectItem value="cobranca">Cobrança</SelectItem>
                            <SelectItem value="meta">Meta</SelectItem>
                            <SelectItem value="transacao">Transação</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Prioridade</label>
                        <Select value={novoEvento.prioridade} onValueChange={(value: any) => setNovoEvento(prev => ({ ...prev, prioridade: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAdicionarEvento}>
                        Adicionar Evento
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Navegação do Calendário */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={mesAnterior}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="text-lg font-semibold">
              {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <Button variant="outline" size="sm" onClick={proximoMes}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {diasSemana.map((dia) => (
              <div key={dia} className="text-center text-sm font-medium text-muted-foreground p-2">
                {dia}
              </div>
            ))}
          </div>

          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {dias.map((dia, index) => {
              if (!dia) {
                return <div key={index} className="h-20 bg-muted/20 rounded-lg" />;
              }

              const eventosDia = obterEventosDia(dia);
              const isHoje = dia.toDateString() === hoje.toDateString();
              const isSelected = selectedDate && dia.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={index}
                  className={`
                    h-20 p-1 rounded-lg border cursor-pointer transition-all
                    ${isHoje ? 'bg-primary/10 border-primary' : ''}
                    ${isSelected ? 'bg-accent border-accent-foreground' : ''}
                    ${!isHoje && !isSelected ? 'hover:bg-accent/50' : ''}
                  `}
                  onClick={() => setSelectedDate(dia)}
                >
                  <div className="text-sm font-medium mb-1">
                    {dia.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {eventosDia.slice(0, 2).map((evento) => (
                      <div
                        key={evento.id}
                        className={`
                          text-xs p-1 rounded border-l-2 ${obterCorPrioridade(evento.prioridade)}
                          bg-background/80 backdrop-blur-sm
                        `}
                        title={evento.titulo}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${obterCorEvento(evento.tipo)}`} />
                          <span className="truncate">{evento.titulo}</span>
                        </div>
                      </div>
                    ))}
                    
                    {eventosDia.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{eventosDia.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Eventos do dia selecionado */}
          {selectedDate && (
            <div className="mt-4 p-4 bg-muted/20 rounded-lg">
              <h3 className="font-medium mb-2">
                Eventos de {selectedDate.toLocaleDateString('pt-BR')}
              </h3>
              
              {obterEventosDia(selectedDate).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum evento para este dia
                </p>
              ) : (
                <div className="space-y-2">
                  {obterEventosDia(selectedDate).map((evento) => (
                    <div
                      key={evento.id}
                      className="flex items-center justify-between p-2 bg-background rounded border"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${obterCorEvento(evento.tipo)}`} />
                        <div>
                          <p className="text-sm font-medium">{evento.titulo}</p>
                          <p className="text-xs text-muted-foreground">{evento.descricao}</p>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className={obterCorPrioridade(evento.prioridade)}>
                        {evento.prioridade}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 