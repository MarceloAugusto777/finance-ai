import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCobrancas } from "@/hooks/useCobrancas";
import { useClientes } from "@/hooks/useClientes";
import { Loading } from "@/components/ui/loading";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const statusOptions = [
  { value: "pendente", label: "Pendente", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
  { value: "pago", label: "Pago", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
  { value: "vencido", label: "Vencido", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
  { value: "cancelado", label: "Cancelado", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" }
];

const Cobrancas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedCobranca, setSelectedCobranca] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cobrancaToDelete, setCobrancaToDelete] = useState<any>(null);
  
  const { toast } = useToast();
  const { 
    data: cobrancas = [], 
    isLoading, 
    refetch,
    createCobranca,
    updateCobranca,
    deleteCobranca,
    updateCobrancaStatus
  } = useCobrancas();
  const { data: clientes = [] } = useClientes();

  // Form state
  const [formData, setFormData] = useState({
    cliente_id: "",
    descricao: "",
    valor: "",
    data_vencimento: "",
    status: "pendente"
  });

  const filteredCobrancas = cobrancas.filter(cobranca => {
    const matchesSearch = cobranca.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cobranca.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || cobranca.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalMode === "create") {
        await createCobranca({
          cliente_id: formData.cliente_id,
          descricao: formData.descricao,
          valor: Number(formData.valor),
          data_vencimento: formData.data_vencimento,
          status: formData.status
        });
      } else if (modalMode === "edit" && selectedCobranca) {
        await updateCobranca({
          id: selectedCobranca.id,
          cliente_id: formData.cliente_id,
          descricao: formData.descricao,
          valor: Number(formData.valor),
          data_vencimento: formData.data_vencimento,
          status: formData.status
        });
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao processar cobrança:", error);
    }
  };

  const handleStatusChange = async (cobrancaId: string, newStatus: string) => {
    try {
      await updateCobrancaStatus({ id: cobrancaId, status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDelete = (cobranca: any) => {
    console.log("🗑️ Tentando excluir cobrança:", cobranca);
    setCobrancaToDelete(cobranca);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    console.log("✅ Confirmando exclusão da cobrança:", cobrancaToDelete);
    if (cobrancaToDelete) {
      try {
        await deleteCobranca(cobrancaToDelete.id);
        console.log("✅ Cobrança excluída com sucesso");
        setDeleteDialogOpen(false);
        setCobrancaToDelete(null);
      } catch (error) {
        console.error("❌ Erro ao excluir cobrança:", error);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pago":
        return <CheckCircle className="w-4 h-4" />;
      case "pendente":
        return <Clock className="w-4 h-4" />;
      case "vencido":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "vencido":
        return "bg-red-100 text-red-800";
      case "cancelado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Layout title="Cobranças">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout title="Cobranças">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cobranças</h1>
            <p className="text-muted-foreground">
              Gerencie suas cobranças e recebimentos
            </p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setModalMode("create");
                setFormData({
                  cliente_id: "",
                  descricao: "",
                  valor: "",
                  data_vencimento: "",
                  status: "pendente"
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Cobrança
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {modalMode === "create" ? "Nova Cobrança" : 
                   modalMode === "edit" ? "Editar Cobrança" : "Detalhes da Cobrança"}
                </DialogTitle>
                <DialogDescription>
                  {modalMode === "create" ? "Crie uma nova cobrança para um cliente" :
                   modalMode === "edit" ? "Edite os dados da cobrança" : "Visualize os detalhes da cobrança"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cliente</label>
                  <Select 
                    value={formData.cliente_id} 
                    onValueChange={(value) => setFormData({...formData, cliente_id: value})}
                    disabled={modalMode === "view"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descrição da cobrança"
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
                  <label className="text-sm font-medium">Data de Vencimento</label>
                  <Input
                    type="date"
                    value={formData.data_vencimento}
                    onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                    disabled={modalMode === "view"}
                  />
                </div>
                
                {modalMode !== "create" && (
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
                )}
                
                {modalMode !== "view" && (
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {modalMode === "create" ? "Criar" : "Salvar"}
                    </Button>
                  </div>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar cobranças..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
          </CardContent>
        </Card>

        {/* Cobranças List */}
        <div className="grid gap-4">
          {filteredCobrancas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma cobrança encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "todos" 
                      ? "Tente ajustar os filtros de busca" 
                      : "Comece criando sua primeira cobrança"}
                  </p>
                  {!searchTerm && statusFilter === "todos" && (
                    <Button onClick={() => setIsModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeira Cobrança
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredCobrancas.map((cobranca) => (
              <Card key={cobranca.id} className="finance-card">
                <CardContent className="pt-6">
                                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(cobranca.status)}`}>
                        {getStatusIcon(cobranca.status)}
                      </div>
                      <div>
                        <h3 className="font-medium">{cobranca.descricao}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {cobranca.cliente?.nome || "Cliente não encontrado"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(cobranca.data_vencimento).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-lg">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          }).format(Number(cobranca.valor))}
                        </p>
                        <Badge className={getStatusColor(cobranca.status)}>
                          {statusOptions.find(s => s.value === cobranca.status)?.label}
                        </Badge>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedCobranca(cobranca);
                            setModalMode("view");
                            setFormData({
                              cliente_id: cobranca.cliente_id,
                              descricao: cobranca.descricao,
                              valor: cobranca.valor.toString(),
                              data_vencimento: cobranca.data_vencimento,
                              status: cobranca.status
                            });
                            setIsModalOpen(true);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedCobranca(cobranca);
                            setModalMode("edit");
                            setFormData({
                              cliente_id: cobranca.cliente_id,
                              descricao: cobranca.descricao,
                              valor: cobranca.valor.toString(),
                              data_vencimento: cobranca.data_vencimento,
                              status: cobranca.status
                            });
                            setIsModalOpen(true);
                          }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {cobranca.status === "pendente" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(cobranca.id, "pago")}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar como Pago
                            </DropdownMenuItem>
                          )}
                                                     <DropdownMenuItem 
                             className="text-red-600"
                             onClick={() => handleDelete(cobranca)}
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

        {/* Stats */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium">Pendentes</span>
              </div>
              <p className="text-2xl font-bold">
                {cobrancas.filter(c => c.status === "pendente").length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Pagas</span>
              </div>
              <p className="text-2xl font-bold">
                {cobrancas.filter(c => c.status === "pago").length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium">Vencidas</span>
              </div>
              <p className="text-2xl font-bold">
                {cobrancas.filter(c => c.status === "vencido").length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(cobrancas.reduce((acc, c) => acc + Number(c.valor), 0))}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Cobrança"
        description={`Tem certeza que deseja excluir a cobrança "${cobrancaToDelete?.descricao}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </Layout>
  );
};

export default Cobrancas; 