import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, Download, Users, Mail, Phone, MapPin, Edit, Trash2, Loader2, Eye } from "lucide-react";
import { useClientes, useCreateCliente, useDeleteCliente } from "@/hooks/useClientes";
import { useToast } from "@/hooks/use-toast";
import { Loading } from "@/components/ui/loading";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<any>(null);
  
  const { data: clientes = [], isLoading, refetch } = useClientes();
  const createClienteMutation = useCreateCliente();
  const deleteCliente = useDeleteCliente();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    observacoes: ""
  });

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone?.includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalMode === "create") {
        await createClienteMutation.mutateAsync({
          nome: formData.nome,
          email: formData.email || undefined,
          telefone: formData.telefone || undefined,
          endereco: formData.endereco || undefined,
          observacoes: formData.observacoes || undefined
        });
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao processar cliente:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
      observacoes: ""
    });
    setSelectedCliente(null);
    setModalMode("create");
  };

  const openCreateModal = () => {
    setModalMode("create");
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (cliente: any) => {
    setModalMode("edit");
    setSelectedCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email || "",
      telefone: cliente.telefone || "",
      endereco: cliente.endereco || "",
      observacoes: cliente.observacoes || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = (cliente: any) => {
    setClienteToDelete(cliente);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (clienteToDelete) {
      await deleteCliente.mutateAsync(clienteToDelete.id);
      setDeleteDialogOpen(false);
      setClienteToDelete(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Layout title="Clientes">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout title="Clientes">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-10 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="gap-2 bg-info hover:bg-info/90" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="finance-card border-info/20 bg-info/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-info" />
                <CardTitle className="text-lg">Total de Clientes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{clientes.length}</div>
              <p className="text-sm text-muted-foreground">Todos os clientes</p>
            </CardContent>
          </Card>

          <Card className="finance-card border-success/20 bg-success/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Clientes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{clientes.length}</div>
              <p className="text-sm text-muted-foreground">100% do total</p>
            </CardContent>
          </Card>

          <Card className="finance-card border-warning/20 bg-warning/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Com Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {clientes.filter(c => c.email).length}
              </div>
              <p className="text-sm text-muted-foreground">
                {clientes.length > 0 ? Math.round((clientes.filter(c => c.email).length / clientes.length) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="finance-card border-danger/20 bg-danger/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Com Telefone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">
                {clientes.filter(c => c.telefone).length}
              </div>
              <p className="text-sm text-muted-foreground">
                {clientes.length > 0 ? Math.round((clientes.filter(c => c.telefone).length / clientes.length) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Clientes List */}
        <Card className="finance-card">
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              Gerencie seus clientes e suas informações
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredClientes.length > 0 ? (
              <div className="space-y-4">
                {filteredClientes.map((cliente) => (
                  <div key={cliente.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-border/20 hover:bg-background/60 transition-colors gap-3">
                    <div className="flex items-center gap-4">
                                             <Avatar className="w-12 h-12">
                         <AvatarImage src="" />
                         <AvatarFallback className="bg-primary/10 text-primary">
                           {getInitials(cliente.nome)}
                         </AvatarFallback>
                       </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {cliente.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {cliente.email}
                            </div>
                          )}
                          {cliente.telefone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {cliente.telefone}
                            </div>
                          )}
                          {cliente.endereco && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {cliente.endereco}
                            </div>
                          )}
                        </div>
                        {cliente.observacoes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {cliente.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(cliente)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(cliente)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "Tente ajustar os termos de busca" 
                    : "Comece cadastrando seu primeiro cliente"
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={openCreateModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Primeiro Cliente
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Criar/Editar Cliente */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {modalMode === "create" ? "Novo Cliente" : "Editar Cliente"}
              </DialogTitle>
              <DialogDescription>
                {modalMode === "create" 
                  ? "Preencha as informações do novo cliente" 
                  : "Atualize as informações do cliente"
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Nome completo ou razão social"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Endereço completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre o cliente"
                  rows={3}
                />
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
                  disabled={createClienteMutation.isPending}
                >
                  {createClienteMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    modalMode === "create" ? "Criar Cliente" : "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog for Delete */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          description={`Tem certeza que deseja excluir o cliente "${clienteToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        />
      </div>
    </Layout>
  );
};

export default Clientes;