import { useState } from "react";

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  tipo: "entrada" | "saida";
  palavrasChave: string[];
  cor: string;
}

const categoriasPadrao: Categoria[] = [
  // Categorias de Entrada
  {
    id: "servicos",
    nome: "Serviços",
    descricao: "Receitas de prestação de serviços",
    tipo: "entrada",
    palavrasChave: ["serviço", "consultoria", "projeto", "desenvolvimento", "design", "marketing"],
    cor: "#10b981"
  },
  {
    id: "produtos",
    nome: "Produtos",
    descricao: "Vendas de produtos",
    tipo: "entrada",
    palavrasChave: ["produto", "venda", "ecommerce", "loja", "mercadoria"],
    cor: "#3b82f6"
  },
  {
    id: "freelance",
    nome: "Freelance",
    descricao: "Trabalhos freelancer",
    tipo: "entrada",
    palavrasChave: ["freelance", "freelancer", "trabalho", "job", "projeto"],
    cor: "#8b5cf6"
  },
  {
    id: "investimentos",
    nome: "Investimentos",
    descricao: "Rendimentos de investimentos",
    tipo: "entrada",
    palavrasChave: ["investimento", "dividendo", "rendimento", "juros", "aplicação"],
    cor: "#f59e0b"
  },

  // Categorias de Saída
  {
    id: "alimentacao",
    nome: "Alimentação",
    descricao: "Gastos com alimentação",
    tipo: "saida",
    palavrasChave: ["comida", "restaurante", "supermercado", "alimentação", "lanche", "café"],
    cor: "#ef4444"
  },
  {
    id: "transporte",
    nome: "Transporte",
    descricao: "Gastos com transporte",
    tipo: "saida",
    palavrasChave: ["uber", "99", "taxi", "ônibus", "metrô", "combustível", "gasolina"],
    cor: "#f97316"
  },
  {
    id: "moradia",
    nome: "Moradia",
    descricao: "Gastos com moradia",
    tipo: "saida",
    palavrasChave: ["aluguel", "condomínio", "energia", "água", "internet", "moradia"],
    cor: "#06b6d4"
  },
  {
    id: "saude",
    nome: "Saúde",
    descricao: "Gastos com saúde",
    tipo: "saida",
    palavrasChave: ["médico", "farmácia", "consulta", "exame", "saúde", "hospital"],
    cor: "#ec4899"
  },
  {
    id: "educacao",
    nome: "Educação",
    descricao: "Gastos com educação",
    tipo: "saida",
    palavrasChave: ["curso", "faculdade", "universidade", "livro", "educação", "estudo"],
    cor: "#84cc16"
  },
  {
    id: "lazer",
    nome: "Lazer",
    descricao: "Gastos com lazer e entretenimento",
    tipo: "saida",
    palavrasChave: ["cinema", "teatro", "show", "viagem", "lazer", "entretenimento"],
    cor: "#a855f7"
  },
  {
    id: "tecnologia",
    nome: "Tecnologia",
    descricao: "Gastos com tecnologia",
    tipo: "saida",
    palavrasChave: ["computador", "celular", "software", "app", "tecnologia", "equipamento"],
    cor: "#6366f1"
  }
];

export function useCategorizacao() {
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasPadrao);

  const categorizarTransacao = (descricao: string, tipo: "entrada" | "saida"): Categoria | null => {
    const descricaoLower = descricao.toLowerCase();
    
    // Filtrar categorias pelo tipo
    const categoriasFiltradas = categorias.filter(cat => cat.tipo === tipo);
    
    // Calcular score para cada categoria
    const scores = categoriasFiltradas.map(categoria => {
      let score = 0;
      
      // Verificar palavras-chave
      categoria.palavrasChave.forEach(palavra => {
        if (descricaoLower.includes(palavra.toLowerCase())) {
          score += 1;
        }
      });
      
      // Verificar correspondência exata
      if (descricaoLower === categoria.nome.toLowerCase()) {
        score += 3;
      }
      
      // Verificar correspondência parcial
      if (descricaoLower.includes(categoria.nome.toLowerCase())) {
        score += 2;
      }
      
      return { categoria, score };
    });
    
    // Ordenar por score e retornar a melhor categoria
    scores.sort((a, b) => b.score - a.score);
    
    return scores[0]?.score > 0 ? scores[0].categoria : null;
  };

  const adicionarCategoria = (novaCategoria: Omit<Categoria, "id">) => {
    const categoria: Categoria = {
      ...novaCategoria,
      id: Date.now().toString()
    };
    
    setCategorias(prev => [...prev, categoria]);
  };

  const editarCategoria = (id: string, dadosAtualizados: Partial<Categoria>) => {
    setCategorias(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, ...dadosAtualizados } : cat
      )
    );
  };

  const removerCategoria = (id: string) => {
    setCategorias(prev => prev.filter(cat => cat.id !== id));
  };

  const obterCategoriaPorId = (id: string): Categoria | undefined => {
    return categorias.find(cat => cat.id === id);
  };

  const obterCategoriasPorTipo = (tipo: "entrada" | "saida"): Categoria[] => {
    return categorias.filter(cat => cat.tipo === tipo);
  };

  const sugerirCategorias = (descricao: string, tipo: "entrada" | "saida"): Categoria[] => {
    const descricaoLower = descricao.toLowerCase();
    const categoriasFiltradas = categorias.filter(cat => cat.tipo === tipo);
    
    const sugestoes = categoriasFiltradas
      .map(categoria => {
        let score = 0;
        
        categoria.palavrasChave.forEach(palavra => {
          if (descricaoLower.includes(palavra.toLowerCase())) {
            score += 1;
          }
        });
        
        return { categoria, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.categoria);
    
    return sugestoes;
  };

  const aprenderCategorizacao = (descricao: string, categoriaId: string) => {
    const categoria = obterCategoriaPorId(categoriaId);
    if (!categoria) return;
    
    // Extrair palavras da descrição que não estão nas palavras-chave
    const palavras = descricao.toLowerCase().split(/\s+/);
    const novasPalavras = palavras.filter(palavra => 
      palavra.length > 2 && 
      !categoria.palavrasChave.includes(palavra)
    );
    
    if (novasPalavras.length > 0) {
      editarCategoria(categoriaId, {
        palavrasChave: [...categoria.palavrasChave, ...novasPalavras.slice(0, 3)]
      });
    }
  };

  return {
    categorias,
    categorizarTransacao,
    adicionarCategoria,
    editarCategoria,
    removerCategoria,
    obterCategoriaPorId,
    obterCategoriasPorTipo,
    sugerirCategorias,
    aprenderCategorizacao
  };
} 