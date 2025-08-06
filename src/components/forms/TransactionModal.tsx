import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, TrendingUp, TrendingDown, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCreateEntrada } from "@/hooks/useEntradas";
import { useCreateSaida } from "@/hooks/useSaidas";
import { useClientes } from "@/hooks/useClientes";
import { useToast } from "@/components/ui/use-toast";

interface TransactionModalProps {
  type: "entrada" | "saida";
  trigger?: React.ReactNode;
}

const categories = {
  entrada: ["Vendas", "Serviços", "Consultoria", "Investimentos", "Outros"],
  saida: ["Infraestrutura", "Suprimentos", "Tecnologia", "Marketing", "Pessoal", "Outros"]
};

const statusOptions = [
  { value: "pendente", label: "Pendente", icon: Clock },
  { value: "pago", label: "Pago", icon: CheckCircle },
  { value: "agendado", label: "Agendado", icon: Clock }
];

export function TransactionModal({ type, trigger }: TransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: undefined as string | undefined,
    customCategory: "",
    client: "",
    notes: "",
    status: "pendente",
    cliente_id: "none"
  });

  const createEntrada = useCreateEntrada();
  const createSaida = useCreateSaida();
  const { data: clientes = [] } = useClientes();
  const { toast } = useToast();

  const isEntrada = type === "entrada";
  const icon = isEntrada ? TrendingUp : TrendingDown;
  const iconColor = isEntrada ? "text-success" : "text-danger";
  const buttonColor = isEntrada ? "bg-success hover:bg-success/90" : "bg-danger hover:bg-danger/90";

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
    setShowCustomCategory(value === "Outros");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!date) {
      toast({
        title: "Data obrigatória",
        description: "Por favor, selecione uma data para a transação.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category || formData.category === "Selecione uma categoria") {
      toast({
        title: "Categoria obrigatória",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    if (formData.category === "Outros" && !formData.customCategory.trim()) {
      toast({
        title: "Categoria obrigatória",
        description: "Por favor, digite uma categoria personalizada.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalCategory = formData.category === "Outros" ? formData.customCategory : (formData.category || "");
      
      const transactionData = {
        valor: parseFloat(formData.amount),
        descricao: formData.description,
        categoria: finalCategory,
        data: format(date, 'yyyy-MM-dd'),
        ...(isEntrada && { 
          status: formData.status || "pendente",
          cliente_id: formData.cliente_id === "none" ? null : formData.cliente_id || null 
        })
      };

      if (isEntrada) {
        await createEntrada.mutateAsync(transactionData);
      } else {
        await createSaida.mutateAsync(transactionData);
      }

      // Reset form
      setFormData({
        description: "",
        amount: "",
        category: undefined,
        customCategory: "",
        client: "",
        notes: "",
        status: isEntrada ? "pendente" : "pago",
        cliente_id: "none"
      });
      setDate(undefined);
      setShowCustomCategory(false);
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className={cn("gap-2", buttonColor)}>
      <Plus className="w-4 h-4" />
      Nova {isEntrada ? "Entrada" : "Saída"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto glass-card mobile-scrollable">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", isEntrada ? "bg-success/20" : "bg-danger/20")}>
              {React.createElement(icon, { className: cn("w-5 h-5", iconColor) })}
            </div>
            Registrar {isEntrada ? "Entrada" : "Saída"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da transação para registrar no sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                placeholder="Ex: Pagamento do cliente ABC"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select 
                {...(formData.category ? { value: formData.category } : {})}
                onValueChange={handleCategoryChange}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories[type].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {showCustomCategory && (
                <div className="space-y-2 mt-2">
                  <Label htmlFor="customCategory">Categoria Personalizada *</Label>
                  <Input
                    id="customCategory"
                    placeholder="Digite sua categoria"
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={isSubmitting}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {isEntrada && (
            <div className="space-y-2">
              <Label>Status de Pagamento</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {React.createElement(option.icon, { className: "w-4 h-4" })}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isEntrada && (
            <div className="space-y-2">
              <Label>Cliente (Opcional)</Label>
              <Select 
                value={formData.cliente_id} 
                onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum cliente</SelectItem>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Selecione um cliente para criar uma cobrança automaticamente quando o status for "pendente"
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 justify-end sticky bottom-0 bg-background pt-4 border-t border-border/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={buttonColor}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Registrando...
                </div>
              ) : (
                `Registrar ${isEntrada ? "Entrada" : "Saída"}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}