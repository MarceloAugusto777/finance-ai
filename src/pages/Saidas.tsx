import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download, TrendingDown, Trash2, Edit, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { TransactionModal } from "@/components/forms/TransactionModal";
import { useSaidas, useDeleteSaida, useUpdateSaida } from "@/hooks/useSaidas";
import { Loading } from "@/components/ui/loading";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";

const statusOptions = [
  { value: "agendado", label: "Agendado", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
  { value: "pago", label: "Pago", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" }
];

const Saidas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saidaToDelete, setSaidaToDelete] = useState<any>(null);
  const [selectedSaida, setSelectedSaida] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    categoria: "",
    data: "",
    status: "pago"
  });
  
  const { data: saidas = [], isLoading } = useSaidas();
  const deleteSaida = useDeleteSaida();
  const updateSaida = useUpdateSaida();
  const { toast } = useToast();

  // Filtrar saídas baseado no termo de busca e status
  const filteredSaidas = saidas.filter(saida => {
    const matchesSearch = saida.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saida.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || saida.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calcular totais
  const totalMes = saidas.reduce((acc, saida) => acc + Number(saida.valor), 0);
  const mediaDiaria = totalMes / 30; // Simplificado
  const saidasAgendadas = saidas.filter(s => s.status === "agendado").length;
  const saidasPagas = saidas.filter(s => s.status === "pago").length;

  const handleDelete = (saida: any) => {
    setSaidaToDelete(saida);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (saidaToDelete) {
      await deleteSaida.mutateAsync(saidaToDelete.id);
      setDeleteDialogOpen(false);
      setSaidaToDelete(null);
    }
  };

  const handleStatusChange = async (saidaId: string, newStatus: string) => {
    try {
      await updateSaida.mutateAsync({ id: saidaId, status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalMode === "edit" && selectedSaida) {
        await updateSaida.mutateAsync({
          id: selectedSaida.id,
          descricao: formData.descricao,
          valor: Number(formData.valor),
          categoria: formData.categoria,
          data: formData.data,
          status: formData.status
        });
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao processar saída:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pago":
        return <CheckCircle className="w-4 h-4" />;
      case "agendado":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800";
      case "agendado":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Layout title="Saídas">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout title="Saídas">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar saídas..."
                className="pl-10 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <TransactionModal type="saida" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="finance-card border-danger/20 bg-danger/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-danger" />
                <CardTitle className="text-lg">Total do Mês</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(totalMes)}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>

          <Card className="finance-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Média Diária</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(mediaDiaria)}
              </div>
              <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card className="finance-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Agendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {saidasAgendadas}
              </div>
              <p className="text-sm text-muted-foreground">Pagamentos futuros</p>
            </CardContent>
          </Card>

          <Card className="finance-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pagas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {saidasPagas}
              </div>
              <p className="text-sm text-muted-foreground">Já realizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Saídas List */}
        <div className="space-y-4">
          {filteredSaidas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma saída encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "todos" 
                      ? "Tente ajustar os filtros de busca" 
                      : "Comece registrando sua primeira saída"}
                  </p>
                  {!searchTerm && statusFilter === "todos" && (
                    <TransactionModal type="saida" />
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredSaidas.map((saida) => (
              <Card key={saida.id} className="finance-card hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                         <div className="flex items-center gap-4 min-w-0 flex-1">
                       <div className={`p-2 rounded-lg ${getStatusColor(saida.status)} flex-shrink-0`}>
                         {getStatusIcon(saida.status)}
                       </div>
                       <div className="min-w-0 flex-1">
                         <h3 className="font-medium text-mobile">{saida.descricao}</h3>
                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                           <span className="text-mobile">{saida.categoria}</span>
                           <span className="text-mobile">{new Date(saida.data).toLocaleDateString('pt-BR')}</span>
                         </div>
                       </div>
                     </div>
                    
                                         <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-medium text-lg text-red-600">
                          - {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          }).format(Number(saida.valor))}
                        </p>
                        <Badge className={getStatusColor(saida.status)}>
                          {statusOptions.find(s => s.value === saida.status)?.label}
                        </Badge>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Abrir menu</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedSaida(saida);
                            setModalMode("view");
                            setFormData({
                              descricao: saida.descricao,
                              valor: saida.valor.toString(),
                              categoria: saida.categoria,
                              data: saida.data,
                              status: saida.status || "agendado"
                            });
                            setIsModalOpen(true);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedSaida(saida);
                            setModalMode("edit");
                            setFormData({
                              descricao: saida.descricao,
                              valor: saida.valor.toString(),
                              categoria: saida.categoria,
                              data: saida.data,
                              status: saida.status || "agendado"
                            });
                            setIsModalOpen(true);
                          }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {saida.status === "agendado" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(saida.id, "pago")}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar como Pago
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(saida)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "edit" ? "Editar Saída" : "Detalhes da Saída"}
            </DialogTitle>
            <DialogDescription>
              {modalMode === "edit" ? "Edite os dados da saída" : "Visualize os detalhes da saída"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Input
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Descrição da saída"
                disabled={modalMode === "view"}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor</label>
              <Input
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                placeholder="0,00"
                step="0.01"
                disabled={modalMode === "view"}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Input
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                placeholder="Categoria"
                disabled={modalMode === "view"}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                disabled={modalMode === "view"}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
                disabled={modalMode === "view"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {modalMode !== "view" && (
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Saída"
        description={`Tem certeza que deseja excluir a saída "${saidaToDelete?.descricao}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </Layout>
  );
};

export default Saidas;