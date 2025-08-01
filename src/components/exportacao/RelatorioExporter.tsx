import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Users, 
  Receipt,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEntradas } from "@/hooks/useEntradas";
import { useSaidas } from "@/hooks/useSaidas";
import { useCobrancas } from "@/hooks/useCobrancas";
import { useClientes } from "@/hooks/useClientes";

import jsPDF from 'jspdf';

const RelatorioExporter = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("mes_atual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSections, setSelectedSections] = useState({
    resumo: true,
    entradas: true,
    saidas: true,
    cobrancas: true,
    clientes: true,
    graficos: true
  });
  const [reportType, setReportType] = useState("completo");

  const { toast } = useToast();
  const { data: entradas = [] } = useEntradas();
  const { data: saidas = [] } = useSaidas();
  const { data: cobrancas = [] } = useCobrancas();
  const { data: clientes = [] } = useClientes();

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const getReportTypes = () => [
    { value: "cobrancas", label: "Relatório de Cobranças", description: "Foco em cobranças pendentes, pagas e vencidas." },
    { value: "entradas", label: "Relatório de Entradas", description: "Todas as entradas e receitas do período." },
    { value: "saidas", label: "Relatório de Saídas", description: "Todas as saídas e despesas do período." },
    { value: "entrada_saida", label: "Relatório Entrada e Saída", description: "Comparativo entre entradas e saídas." },
    { value: "completo", label: "Relatório Completo", description: "Todas as movimentações financeiras." }
  ];

  const getDateRange = () => {
    const now = new Date();
    let start, end;

    switch (selectedPeriod) {
      case "mes_atual":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "trimestre":
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1);
        end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
        break;
      case "ano_atual":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      case "personalizado":
        start = startDate ? new Date(startDate) : new Date();
        end = endDate ? new Date(endDate) : new Date();
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return { start, end };
  };

  const filterDataByDateRange = (data: any[], start: Date, end: Date) => {
    return data.filter(item => {
      const itemDate = new Date(item.data || item.created_at);
      return itemDate >= start && itemDate <= end;
    });
  };

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const { start, end } = getDateRange();
      
      // Filtrar dados pelo período
      const entradasFiltradas = filterDataByDateRange(entradas, start, end);
      const saidasFiltradas = filterDataByDateRange(saidas, start, end);
      const cobrancasFiltradas = filterDataByDateRange(cobrancas, start, end);

      // Calcular estatísticas
      const totalEntradas = entradasFiltradas.reduce((sum, item) => sum + Number(item.valor), 0);
      const totalSaidas = saidasFiltradas.reduce((sum, item) => sum + Number(item.valor), 0);
      const saldo = totalEntradas - totalSaidas;
      const cobrancasPendentes = cobrancasFiltradas.filter(c => c.status === "pendente").length;
      const cobrancasPagas = cobrancasFiltradas.filter(c => c.status === "pago").length;
      const cobrancasVencidas = cobrancasFiltradas.filter(c => c.status === "vencido").length;

      // Criar PDF
      const doc = new jsPDF();
      
      // Configurar fonte
      doc.setFont("helvetica");
      
      // Título baseado no tipo de relatório
      const reportTypes = getReportTypes();
      const currentReport = reportTypes.find(t => t.value === reportType);
      
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(currentReport?.label || "Relatório Financeiro", 105, 20, { align: "center" });
      
      // Período
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Período: ${start.toLocaleDateString('pt-BR')} a ${end.toLocaleDateString('pt-BR')}`, 20, 35);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 42);
      
      let yPosition = 60;

      // Gerar conteúdo baseado no tipo de relatório
      switch (reportType) {
        case "cobrancas":
          generateCobrancasReport(doc, cobrancasFiltradas, yPosition);
          break;
        case "entradas":
          generateEntradasReport(doc, entradasFiltradas, totalEntradas, yPosition);
          break;
        case "saidas":
          generateSaidasReport(doc, saidasFiltradas, totalSaidas, yPosition);
          break;
        case "entrada_saida":
          generateEntradaSaidaReport(doc, entradasFiltradas, saidasFiltradas, totalEntradas, totalSaidas, saldo, yPosition);
          break;
        case "completo":
        default:
          generateCompletoReport(doc, entradasFiltradas, saidasFiltradas, cobrancasFiltradas, clientes, totalEntradas, totalSaidas, saldo, cobrancasPendentes, cobrancasPagas, cobrancasVencidas, yPosition);
          break;
      }

      // Rodapé
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
        doc.text("FinanceAI - Sistema de Gestão Financeira", 105, 295, { align: "center" });
      }

      // Salvar PDF
      const fileName = `${currentReport?.label.replace(/\s+/g, '_')}_${start.toLocaleDateString('pt-BR').replace(/\//g, '-')}_${end.toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      doc.save(fileName);

      toast({
        title: "Relatório gerado!",
        description: `O relatório foi baixado como ${fileName}`,
      });

    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        title: "Erro!",
        description: "Erro ao gerar relatório: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCobrancasReport = (doc: jsPDF, cobrancas: any[], yPosition: number) => {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Cobranças", 20, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    cobrancas.slice(0, 10).forEach((cobranca, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${new Date(cobranca.data_vencimento).toLocaleDateString('pt-BR')} - ${cobranca.descricao}`, 20, yPosition);
      doc.text(`R$ ${Number(cobranca.valor).toFixed(2)} - ${cobranca.status}`, 150, yPosition);
      yPosition += 8;
    });
    
    if (cobrancas.length > 10) {
      doc.text(`... e mais ${cobrancas.length - 10} cobranças`, 20, yPosition);
      yPosition += 8;
    }
    yPosition += 10;
  };

  const generateEntradasReport = (doc: jsPDF, entradas: any[], totalEntradas: number, yPosition: number) => {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Entradas", 20, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    entradas.slice(0, 10).forEach((entrada, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${new Date(entrada.data).toLocaleDateString('pt-BR')} - ${entrada.descricao}`, 20, yPosition);
      doc.text(`R$ ${Number(entrada.valor).toFixed(2)}`, 150, yPosition);
      yPosition += 8;
    });
    
    if (entradas.length > 10) {
      doc.text(`... e mais ${entradas.length - 10} entradas`, 20, yPosition);
      yPosition += 8;
    }
    yPosition += 10;
  };

  const generateSaidasReport = (doc: jsPDF, saidas: any[], totalSaidas: number, yPosition: number) => {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Saídas", 20, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    saidas.slice(0, 10).forEach((saida, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${new Date(saida.data).toLocaleDateString('pt-BR')} - ${saida.descricao}`, 20, yPosition);
      doc.text(`R$ ${Number(saida.valor).toFixed(2)}`, 150, yPosition);
      yPosition += 8;
    });
    
    if (saidas.length > 10) {
      doc.text(`... e mais ${saidas.length - 10} saídas`, 20, yPosition);
      yPosition += 8;
    }
    yPosition += 10;
  };

  const generateEntradaSaidaReport = (doc: jsPDF, entradas: any[], saidas: any[], totalEntradas: number, totalSaidas: number, saldo: number, yPosition: number) => {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Comparativo Entradas e Saídas", 20, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Saldo: R$ ${saldo.toFixed(2)}`, 20, yPosition);
    yPosition += 15;
  };

  const generateCompletoReport = (doc: jsPDF, entradas: any[], saidas: any[], cobrancas: any[], clientes: any[], totalEntradas: number, totalSaidas: number, saldo: number, cobrancasPendentes: number, cobrancasPagas: number, cobrancasVencidas: number, yPosition: number) => {
    // Resumo Financeiro
    if (selectedSections.resumo) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Resumo Financeiro", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2)}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2)}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Saldo: R$ ${saldo.toFixed(2)}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Total de Clientes: ${clientes.length}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Cobranças Pendentes: ${cobrancasPendentes}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Cobranças Pagas: ${cobrancasPagas}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Cobranças Vencidas: ${cobrancasVencidas}`, 20, yPosition);
      yPosition += 15;
    }

    // Entradas
    if (selectedSections.entradas && entradas.length > 0) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Entradas", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      entradas.slice(0, 10).forEach((entrada, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${new Date(entrada.data).toLocaleDateString('pt-BR')} - ${entrada.descricao}`, 20, yPosition);
        doc.text(`R$ ${Number(entrada.valor).toFixed(2)}`, 150, yPosition);
        yPosition += 8;
      });
      
      if (entradas.length > 10) {
        doc.text(`... e mais ${entradas.length - 10} entradas`, 20, yPosition);
        yPosition += 8;
      }
      yPosition += 10;
    }

    // Saídas
    if (selectedSections.saidas && saidas.length > 0) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Saídas", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      saidas.slice(0, 10).forEach((saida, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${new Date(saida.data).toLocaleDateString('pt-BR')} - ${saida.descricao}`, 20, yPosition);
        doc.text(`R$ ${Number(saida.valor).toFixed(2)}`, 150, yPosition);
        yPosition += 8;
      });
      
      if (saidas.length > 10) {
        doc.text(`... e mais ${saidas.length - 10} saídas`, 20, yPosition);
        yPosition += 8;
      }
      yPosition += 10;
    }

    // Cobranças
    if (selectedSections.cobrancas && cobrancas.length > 0) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Cobranças", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      cobrancas.slice(0, 10).forEach((cobranca, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${new Date(cobranca.data_vencimento).toLocaleDateString('pt-BR')} - ${cobranca.descricao}`, 20, yPosition);
        doc.text(`R$ ${Number(cobranca.valor).toFixed(2)} - ${cobranca.status}`, 150, yPosition);
        yPosition += 8;
      });
      
      if (cobrancas.length > 10) {
        doc.text(`... e mais ${cobrancas.length - 10} cobranças`, 20, yPosition);
        yPosition += 8;
      }
      yPosition += 10;
    }

    // Clientes
    if (selectedSections.clientes && clientes.length > 0) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Clientes", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      clientes.slice(0, 10).forEach((cliente, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${cliente.nome}`, 20, yPosition);
        if (cliente.email) {
          doc.text(`${cliente.email}`, 100, yPosition);
        }
        yPosition += 8;
      });
      
      if (clientes.length > 10) {
        doc.text(`... e mais ${clientes.length - 10} clientes`, 20, yPosition);
        yPosition += 8;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exportar Relatórios</h1>
          <p className="text-muted-foreground">
            Gere relatórios em PDF com suas informações financeiras
          </p>
        </div>
        <Button 
          onClick={generatePDF} 
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Gerar PDF
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configurações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tipo de Relatório */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tipo de Relatório
              </CardTitle>
              <CardDescription>
                Escolha o tipo de relatório que deseja gerar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    {getReportTypes().map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {reportType && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {getReportTypes().find(t => t.value === reportType)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mes_atual">Mês Atual</SelectItem>
                    <SelectItem value="trimestre">Trimestre Atual</SelectItem>
                    <SelectItem value="ano_atual">Ano Atual</SelectItem>
                    <SelectItem value="personalizado">Período Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPeriod === "personalizado" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Data Início</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Data Fim</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Período Selecionado</h4>
                <p className="text-sm text-muted-foreground">
                  {(() => {
                    const { start, end } = getDateRange();
                    return `${start.toLocaleDateString('pt-BR')} a ${end.toLocaleDateString('pt-BR')}`;
                  })()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seções */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Seções do Relatório
              </CardTitle>
              <CardDescription>
                Selecione quais seções incluir no relatório
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="resumo"
                    checked={selectedSections.resumo}
                    onCheckedChange={() => handleSectionToggle("resumo")}
                  />
                  <Label htmlFor="resumo" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Resumo Financeiro
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entradas"
                    checked={selectedSections.entradas}
                    onCheckedChange={() => handleSectionToggle("entradas")}
                  />
                  <Label htmlFor="entradas" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Entradas
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saidas"
                    checked={selectedSections.saidas}
                    onCheckedChange={() => handleSectionToggle("saidas")}
                  />
                  <Label htmlFor="saidas" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-600" />
                    Saídas
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cobrancas"
                    checked={selectedSections.cobrancas}
                    onCheckedChange={() => handleSectionToggle("cobrancas")}
                  />
                  <Label htmlFor="cobrancas" className="flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Cobranças
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="clientes"
                    checked={selectedSections.clientes}
                    onCheckedChange={() => handleSectionToggle("clientes")}
                  />
                  <Label htmlFor="clientes" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Clientes
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="graficos"
                    checked={selectedSections.graficos}
                    onCheckedChange={() => handleSectionToggle("graficos")}
                  />
                  <Label htmlFor="graficos" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Gráficos
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Preview do Relatório
              </CardTitle>
              <CardDescription>
                Visualize o que será incluído
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tipo:</span>
                  <span className="text-sm font-medium">{getReportTypes().find(t => t.value === reportType)?.label}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Período:</span>
                  <span className="text-sm font-medium">
                    {(() => {
                      const { start, end } = getDateRange();
                      return `${start.toLocaleDateString('pt-BR')} - ${end.toLocaleDateString('pt-BR')}`;
                    })()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Seções:</span>
                  <span className="text-sm font-medium">
                    {Object.values(selectedSections).filter(Boolean).length} de 6
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Entradas:</span>
                  <span className="text-sm font-medium">{entradas.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Saídas:</span>
                  <span className="text-sm font-medium">{saidas.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Cobranças:</span>
                  <span className="text-sm font-medium">{cobrancas.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Clientes:</span>
                  <span className="text-sm font-medium">{clientes.length}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={generatePDF} 
                  disabled={isGenerating}
                  className="w-full gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Gerar e Baixar PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Dicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Relatórios completos podem demorar mais para gerar</p>
              <p>• Use filtros de período para relatórios mais específicos</p>
              <p>• Selecione apenas as seções necessárias para relatórios mais rápidos</p>
              <p>• Os PDFs são otimizados para impressão</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RelatorioExporter; 