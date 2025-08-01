import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  PiggyBank, 
  Trophy, 
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Loader2,
  BarChart3,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loading } from "@/components/ui/loading";

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "economia" | "receita" | "investimento" | "reducao_despesa";
  valor_meta: number;
  valor_atual: number;
  data_inicio: string;
  data_fim: string;
  status: "ativa" | "concluida" | "atrasada";
  categoria: string;
  prioridade: "baixa" | "media" | "alta";
  lembretes: boolean;
  created_at: string;
}

const mockMetas: Meta[] = [
  {
    id: "1",
    titulo: "Reserva de Emergência",
    descricao: "Criar uma reserva de emergência de 6 meses de despesas",
    tipo: "economia",
    valor_meta: 15000,
    valor_atual: 8500,
    data_inicio: "2024-01-01",
    data_fim: "2024-12-31",
    status: "ativa",
    categoria: "Segurança Financeira",
    prioridade: "alta",
    lembretes: true,
    created_at: "2024-01-01"
  },
  {
    id: "2",
    titulo: "Investimento em Ações",
    descricao: "Aplicar R$ 500 por mês em ações",
    tipo: "investimento",
    valor_meta: 6000,
    valor_atual: 3000,
    data_inicio: "2024-01-01",
    data_fim: "2024-12-31",
    status: "ativa",
    categoria: "Investimentos",
    prioridade: "media",
    lembretes: true,
    created_at: "2024-01-01"
  },
  {
    id: "3",
    titulo: "Reduzir Gastos com Delivery",
    descricao: "Diminuir gastos com delivery em 50%",
    tipo: "reducao_despesa",
    valor_meta: 2000,
    valor_atual: 1200,
    data_inicio: "2024-01-01",
    data_fim: "2024-06-30",
    status: "ativa",
    categoria: "Economia",
    prioridade: "baixa",
    lembretes: false,
    created_at: "2024-01-01"
  }
];

const Metas = () => {
  const [metas, setMetas] = useState<Meta[]>(mockMetas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState<Meta | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "economia" as Meta["tipo"],
    valor_meta: "",
    data_inicio: "",
    data_fim: "",
    categoria: "",
    prioridade: "media" as Meta["prioridade"],
    lembretes: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const novaMeta: Meta = {
        id: Date.now().toString(),
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        valor_meta: Number(formData.valor_meta),
        valor_atual: 0,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        status: "ativa",
        categoria: formData.categoria,
        prioridade: formData.prioridade,
        lembretes: formData.lembretes,
        created_at: new Date().toISOString()
      };

      if (modalMode === "create") {
        setMetas(prev => [...prev, novaMeta]);
        toast({
          title: "Meta criada!",
          description: "Sua nova meta foi criada com sucesso.",
        });
      } else {
        setMetas(prev => prev.map(meta => 
          meta.id === selectedMeta?.id ? { ...meta, ...novaMeta } : meta
        ));
        toast({
          title: "Meta atualizada!",
          description: "Sua meta foi atualizada com sucesso.",
        });
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Erro ao processar meta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      tipo: "economia",
      valor_meta: "",
      data_inicio: "",
      data_fim: "",
      categoria: "",
      prioridade: "media",
      lembretes: false
    });
    setSelectedMeta(null);
    setModalMode("create");
  };

  const openCreateModal = () => {
    setModalMode("create");
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (meta: Meta) => {
    setModalMode("edit");
    setSelectedMeta(meta);
    setFormData({
      titulo: meta.titulo,
      descricao: meta.descricao,
      tipo: meta.tipo,
      valor_meta: meta.valor_meta.toString(),
      data_inicio: meta.data_inicio,
      data_fim: meta.data_fim,
      categoria: meta.categoria,
      prioridade: meta.prioridade,
      lembretes: meta.lembretes
    });
    setIsModalOpen(true);
  };

  const calcularProgresso = (meta: Meta) => {
    return Math.min((meta.valor_atual / meta.valor_meta) * 100, 100);
  };

  const getStatusInfo = (meta: Meta) => {
    const progresso = calcularProgresso(meta);
    const hoje = new Date();
    const dataFim = new Date(meta.data_fim);
    const diasRestantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (progresso >= 100) {
      return { status: "concluida", icon: CheckCircle, color: "text-green-600", text: "Concluída" };
    } else if (diasRestantes < 0) {
      return { status: "atrasada", icon: AlertCircle, color: "text-red-600", text: "Atrasada" };
    } else {
      return { status: "ativa", icon: Clock, color: "text-blue-600", text: "Em andamento" };
    }
  };

  const getTipoInfo = (tipo: Meta["tipo"]) => {
    const tipos = {
      economia: { icon: PiggyBank, color: "text-green-600", label: "Economia" },
      receita: { icon: TrendingUp, color: "text-blue-600", label: "Receita" },
      investimento: { icon: BarChart3, color: "text-purple-600", label: "Investimento" },
      reducao_despesa: { icon: Zap, color: "text-orange-600", label: "Redução de Despesa" }
    };
    return tipos[tipo];
  };

  const getPrioridadeInfo = (prioridade: Meta["prioridade"]) => {
    const prioridades = {
      baixa: { color: "bg-green-100 text-green-800", label: "Baixa" },
      media: { color: "bg-yellow-100 text-yellow-800", label: "Média" },
      alta: { color: "bg-red-100 text-red-800", label: "Alta" }
    };
    return prioridades[prioridade];
  };

  const metasAtivas = metas.filter(meta => meta.status === "ativa");
  const metasConcluidas = metas.filter(meta => meta.status === "concluida");
  const progressoGeral = metas.length > 0 
    ? metas.reduce((acc, meta) => acc + calcularProgresso(meta), 0) / metas.length 
    : 0;

  return (
    <Layout title="Metas Financeiras">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-bold">Metas Financeiras</h1>
            <p className="text-muted-foreground">
              Defina e acompanhe suas metas financeiras
            </p>
          </div>
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Meta
          </Button>
        </div>

        {/* Resumo Geral */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Total de Metas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metas.length}</div>
              <p className="text-sm text-muted-foreground">Metas criadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Em Andamento</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metasAtivas.length}</div>
              <p className="text-sm text-muted-foreground">Metas ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <CardTitle className="text-lg">Concluídas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metasConcluidas.length}</div>
              <p className="text-sm text-muted-foreground">Metas finalizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Progresso Geral</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{Math.round(progressoGeral)}%</div>
              <Progress value={progressoGeral} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Lista de Metas */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {metas.map((meta) => {
            const progresso = calcularProgresso(meta);
            const statusInfo = getStatusInfo(meta);
            const tipoInfo = getTipoInfo(meta.tipo);
            const prioridadeInfo = getPrioridadeInfo(meta.prioridade);
            const StatusIcon = statusInfo.icon;
            const TipoIcon = tipoInfo.icon;

            return (
              <Card key={meta.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                                     <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TipoIcon className={`w-5 h-5 ${tipoInfo.color}`} />
                      <Badge variant="outline" className={prioridadeInfo.color}>
                        {prioridadeInfo.label}
                      </Badge>
                    </div>
                                         <div className="flex items-center gap-1 flex-shrink-0">
                       <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                       <span className={`text-xs ${statusInfo.color} text-mobile`}>
                         {statusInfo.text}
                       </span>
                     </div>
                  </div>
                                     <CardTitle className="text-lg text-mobile">{meta.titulo}</CardTitle>
                   <CardDescription className="text-mobile">{meta.descricao}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progresso */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(progresso)}%
                      </span>
                    </div>
                    <Progress value={progresso} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>R$ {meta.valor_atual.toLocaleString()}</span>
                      <span>R$ {meta.valor_meta.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Vence em {new Date(meta.data_fim).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {meta.categoria}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditModal(meta)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {metas.length === 0 && (
          <Card className="text-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma meta criada</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua primeira meta financeira
            </p>
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Meta
            </Button>
          </Card>
        )}

        {/* Modal de Criar/Editar Meta */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {modalMode === "create" ? "Nova Meta Financeira" : "Editar Meta"}
              </DialogTitle>
              <DialogDescription>
                {modalMode === "create" 
                  ? "Defina uma nova meta para suas finanças" 
                  : "Atualize as informações da meta"
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Ex: Reserva de emergência"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Meta *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => handleSelectChange("tipo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economia">Economia</SelectItem>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="investimento">Investimento</SelectItem>
                      <SelectItem value="reducao_despesa">Redução de Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva sua meta em detalhes"
                />
              </div>
              
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="valor_meta">Valor da Meta (R$) *</Label>
                  <Input
                    id="valor_meta"
                    name="valor_meta"
                    type="number"
                    value={formData.valor_meta}
                    onChange={handleInputChange}
                    placeholder="0,00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    placeholder="Ex: Segurança Financeira"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="data_inicio">Data de Início *</Label>
                  <Input
                    id="data_inicio"
                    name="data_inicio"
                    type="date"
                    value={formData.data_inicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data_fim">Data de Conclusão *</Label>
                  <Input
                    id="data_fim"
                    name="data_fim"
                    type="date"
                    value={formData.data_fim}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={formData.prioridade}
                    onValueChange={(value) => handleSelectChange("prioridade", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lembretes">Lembretes</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="lembretes"
                      name="lembretes"
                      type="checkbox"
                      checked={formData.lembretes}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <Label htmlFor="lembretes" className="text-sm">
                      Receber lembretes sobre esta meta
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    modalMode === "create" ? "Criar Meta" : "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Metas; 