import { useEntradas } from "./useEntradas";
import { useSaidas } from "./useSaidas";
import { useClientes } from "./useClientes";
import { useCobrancas } from "./useCobrancas";
import { useToast } from "./use-toast";

interface RelatorioData {
  periodo: {
    inicio: string;
    fim: string;
  };
  resumo: {
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
    totalClientes: number;
    totalCobrancas: number;
  };
  detalhes: {
    entradas: any[];
    saidas: any[];
    clientes: any[];
    cobrancas: any[];
  };
}

export function useExportacao() {
  const { toast } = useToast();
  const { data: entradas = [] } = useEntradas();
  const { data: saidas = [] } = useSaidas();
  const { data: clientes = [] } = useClientes();
  const { data: cobrancas = [] } = useCobrancas();

  const gerarDadosRelatorio = (dataInicio?: string, dataFim?: string): RelatorioData => {
    const inicio = dataInicio ? new Date(dataInicio) : new Date(new Date().getFullYear(), 0, 1);
    const fim = dataFim ? new Date(dataFim) : new Date();

    const entradasFiltradas = entradas.filter(e => {
      const data = new Date(e.data);
      return data >= inicio && data <= fim;
    });

    const saidasFiltradas = saidas.filter(s => {
      const data = new Date(s.data);
      return data >= inicio && data <= fim;
    });

    const totalEntradas = entradasFiltradas.reduce((acc, e) => acc + Number(e.valor), 0);
    const totalSaidas = saidasFiltradas.reduce((acc, s) => acc + Number(s.valor), 0);

    return {
      periodo: {
        inicio: inicio.toISOString().split('T')[0],
        fim: fim.toISOString().split('T')[0]
      },
      resumo: {
        totalEntradas,
        totalSaidas,
        saldo: totalEntradas - totalSaidas,
        totalClientes: clientes.length,
        totalCobrancas: cobrancas.length
      },
      detalhes: {
        entradas: entradasFiltradas,
        saidas: saidasFiltradas,
        clientes,
        cobrancas
      }
    };
  };

  const exportarPDF = async (dataInicio?: string, dataFim?: string) => {
    try {
      const dados = gerarDadosRelatorio(dataInicio, dataFim);
      
      // Simular geração de PDF (em produção, usar biblioteca como jsPDF)
      const conteudo = `
        RELATÓRIO FINANCEIRO - FINANCE AI
        
        Período: ${dados.periodo.inicio} a ${dados.periodo.fim}
        
        RESUMO:
        - Total Entradas: R$ ${dados.resumo.totalEntradas.toFixed(2)}
        - Total Saídas: R$ ${dados.resumo.totalSaidas.toFixed(2)}
        - Saldo: R$ ${dados.resumo.saldo.toFixed(2)}
        - Total Clientes: ${dados.resumo.totalClientes}
        - Total Cobranças: ${dados.resumo.totalCobrancas}
        
        DETALHES DAS ENTRADAS:
        ${dados.detalhes.entradas.map(e => 
          `- ${e.descricao}: R$ ${Number(e.valor).toFixed(2)} (${e.data})`
        ).join('\n')}
        
        DETALHES DAS SAÍDAS:
        ${dados.detalhes.saidas.map(s => 
          `- ${s.descricao}: R$ ${Number(s.valor).toFixed(2)} (${s.data})`
        ).join('\n')}
      `;
      
      // Criar arquivo para download
      const blob = new Blob([conteudo], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-financeiro-${dados.periodo.inicio}-${dados.periodo.fim}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Relatório exportado!",
        description: "Relatório em PDF baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação!",
        description: "Erro ao gerar relatório PDF.",
        variant: "destructive",
      });
    }
  };

  const exportarExcel = async (dataInicio?: string, dataFim?: string) => {
    try {
      const dados = gerarDadosRelatorio(dataInicio, dataFim);
      
      // Gerar CSV (simulação de Excel)
      const csvEntradas = [
        ["Data", "Descrição", "Valor", "Categoria", "Cliente"],
        ...dados.detalhes.entradas.map(e => [
          e.data,
          e.descricao,
          Number(e.valor).toFixed(2),
          e.categoria,
          e.cliente?.nome || ""
        ])
      ].map(row => row.join(",")).join("\n");
      
      const csvSaidas = [
        ["Data", "Descrição", "Valor", "Categoria"],
        ...dados.detalhes.saidas.map(s => [
          s.data,
          s.descricao,
          Number(s.valor).toFixed(2),
          s.categoria
        ])
      ].map(row => row.join(",")).join("\n");
      
      const conteudo = `RELATÓRIO FINANCEIRO\n\nENTRADAS:\n${csvEntradas}\n\nSAÍDAS:\n${csvSaidas}`;
      
      // Criar arquivo para download
      const blob = new Blob([conteudo], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-financeiro-${dados.periodo.inicio}-${dados.periodo.fim}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Relatório exportado!",
        description: "Relatório em Excel baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação!",
        description: "Erro ao gerar relatório Excel.",
        variant: "destructive",
      });
    }
  };

  const exportarJSON = async (dataInicio?: string, dataFim?: string) => {
    try {
      const dados = gerarDadosRelatorio(dataInicio, dataFim);
      
      // Criar arquivo para download
      const blob = new Blob([JSON.stringify(dados, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-financeiro-${dados.periodo.inicio}-${dados.periodo.fim}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Relatório exportado!",
        description: "Relatório em JSON baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação!",
        description: "Erro ao gerar relatório JSON.",
        variant: "destructive",
      });
    }
  };

  const exportarRelatorioMensal = async (mes: number, ano: number) => {
    const dataInicio = new Date(ano, mes, 1).toISOString().split('T')[0];
    const dataFim = new Date(ano, mes + 1, 0).toISOString().split('T')[0];
    
    await exportarPDF(dataInicio, dataFim);
  };

  const exportarRelatorioAnual = async (ano: number) => {
    const dataInicio = new Date(ano, 0, 1).toISOString().split('T')[0];
    const dataFim = new Date(ano, 11, 31).toISOString().split('T')[0];
    
    await exportarPDF(dataInicio, dataFim);
  };

  const exportarRelatorioPersonalizado = async (
    dataInicio: string,
    dataFim: string,
    formato: "pdf" | "excel" | "json"
  ) => {
    switch (formato) {
      case "pdf":
        await exportarPDF(dataInicio, dataFim);
        break;
      case "excel":
        await exportarExcel(dataInicio, dataFim);
        break;
      case "json":
        await exportarJSON(dataInicio, dataFim);
        break;
    }
  };

  return {
    exportarPDF,
    exportarExcel,
    exportarJSON,
    exportarRelatorioMensal,
    exportarRelatorioAnual,
    exportarRelatorioPersonalizado,
    gerarDadosRelatorio
  };
} 