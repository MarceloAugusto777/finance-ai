import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download, TrendingUp, Trash2, Edit, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { TransactionModal } from "@/components/forms/TransactionModal";
import { useEntradas, useDeleteEntrada, useUpdateEntrada } from "@/hooks/useEntradas";
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
  { value: "pendente", label: "Pendente", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
  { value: "pago", label: "Pago", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" }
];

const Entradas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entradaToDelete, setEntradaToDelete] = useState<any>(null);
  const [selectedEntrada, setSelectedEntrada] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    categoria: "",
    data: "",
    status: "pendente"
  });
  
  const { data: entradas = [], isLoading } = useEntradas();
  const deleteEntrada = useDeleteEntrada();
  const updateEntrada = useUpdateEntrada();
  const { toast } = useToast();

  // Filtrar entradas baseado no termo de busca e status
  const filteredEntradas = entradas.filter(entrada => {
    const matchesSearch = entrada.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrada.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || entrada.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calcular totais
  const totalMes = entradas.reduce((acc, entrada) => acc + Number(entrada.valor), 0);
  const mediaDiaria = totalMes / 30; // Simplificado
  const entradasPendentes = entradas.filter(e => e.status === "pendente").length;
  const entradasPagas = entradas.filter(e => e.status === "pago").length;

  const handleDelete = (entrada: any) => {
    setEntradaToDelete(entrada);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (entradaToDelete) {
      await deleteEntrada.mutateAsync(entradaToDelete.id);
      setDeleteDialogOpen(false);
      setEntradaToDelete(null);
    }
  };

  const handleStatusChange = async (entradaId: string, newStatus: string) => {
    try {
      await updateEntrada.mutateAsync({ id: entradaId, status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalMode === "edit" && selectedEntrada) {
        await updateEntrada.mutateAsync({
          id: selectedEntrada.id,
          descricao: formData.descricao,
          valor: Number(formData.valor),
          categoria: formData.categoria,
          data: formData.data,
          status: formData.status
        });
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao processar entrada:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pago":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pendente":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Layout title="Entradas">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout title="Entradas">
      <div className="space-y-6">
        {/* Header Actions */}
                 <div className="flex flex-col sm:flex-row gap-4 justify-between flex-mobile">
                     <div className="flex gap-3 flex-wrap">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
               <Input
                 placeholder="Buscar entradas..."
                 className="pl-10 w-full sm:w-80"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="w-full sm:w-[180px]">
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
          
                     <div className="flex gap-3 flex-wrap">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <TransactionModal type="entrada" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="finance-card border-success/20 bg-success/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <CardTitle className="text-lg">Total do Mês</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
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
              <CardTitle className="text-lg">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {entradasPendentes}
              </div>
              <p className="text-sm text-muted-foreground">A receber</p>
            </CardContent>
          </Card>

          <Card className="finance-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recebidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {entradasPagas}
              </div>
              <p className="text-sm text-muted-foreground">Já recebidas</p>
            </CardContent>
          </Card>
        </div>

        {/* Entradas List */}
        <div className="space-y-4">
          {filteredEntradas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma entrada encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "todos" 
                      ? "Tente ajustar os filtros de busca" 
                      : "Comece registrando sua primeira entrada"}
                  </p>
                  {!searchTerm && statusFilter === "todos" && (
                    <TransactionModal type="entrada" />
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredEntradas.map((entrada) => (
              <Card key={entrada.id} className="finance-card hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                         <div className="flex items-center gap-4 min-w-0 flex-1">
                       <div className={`p-2 rounded-lg ${getStatusColor(entrada.status)} flex-shrink-0`}>
                         {getStatusIcon(entrada.status)}
                       </div>
                       <div className="min-w-0 flex-1">
                         <h3 className="font-medium text-mobile">{entrada.descricao}</h3>
                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                           <span className="text-mobile">{entrada.categoria}</span>
                           <span className="text-mobile">{new Date(entrada.data).toLocaleDateString('pt-BR')}</span>
                         </div>
                       </div>
                     </div>
                    
                                         <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-medium text-lg text-green-600">
                          + {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          }).format(Number(entrada.valor))}
                        </p>
                        <Badge className={getStatusColor(entrada.status)}>
                          {statusOptions.find(s => s.value === entrada.status)?.label}
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
                            setSelectedEntrada(entrada);
                            setModalMode("view");
                            setFormData({
                              descricao: entrada.descricao,
                              valor: entrada.valor.toString(),
                              categoria: entrada.categoria,
                              data: entrada.data,
                              status: entrada.status || "pendente"
                            });
                            setIsModalOpen(true);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedEntrada(entrada);
                            setModalMode("edit");
                            setFormData({
                              descricao: entrada.descricao,
                              valor: entrada.valor.toString(),
                              categoria: entrada.categoria,
                              data: entrada.data,
                              status: entrada.status || "pendente"
                            });
                            setIsModalOpen(true);
                          }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {entrada.status === "pendente" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(entrada.id, "pago")}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar como Pago
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(entrada)}
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
              {modalMode === "edit" ? "Editar Entrada" : "Detalhes da Entrada"}
            </DialogTitle>
            <DialogDescription>
              {modalMode === "edit" ? "Edite os dados da entrada" : "Visualize os detalhes da entrada"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Input
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Descrição da entrada"
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
        title="Excluir Entrada"
        description={`Tem certeza que deseja excluir a entrada "${entradaToDelete?.descricao}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </Layout>
  );
};

export default Entradas; 