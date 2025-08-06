# Finance AI - Sistema de Gestão Financeira

Um sistema completo de gestão financeira desenvolvido com React, TypeScript, Vite e Supabase.

## 🚀 Funcionalidades

- **Dashboard Intuitivo**: Visualização clara de receitas, despesas e saldo
- **Gestão de Transações**: Adicione, edite e categorize entradas e saídas
- **Relatórios Avançados**: Exporte relatórios em PDF com gráficos detalhados
- **Calendário Visual**: Visualize transações em um calendário interativo
- **Sistema de Categorização**: Organize transações por categorias personalizadas
- **Backup e Restauração**: Sistema completo de backup dos dados
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Autenticação Segura**: Sistema de login com Supabase Auth

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Charts**: Recharts
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Deploy**: GitHub Pages (via GitHub Actions)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/MarceloAugusto777/finance-ai.git
cd finance-ai
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

4. Configure as variáveis no arquivo `.env`:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

5. Execute o projeto:
```bash
npm run dev
```

## 🚀 Deploy

O projeto está configurado para deploy automático via GitHub Actions. A cada push para a branch `master`, o projeto será automaticamente:

1. Buildado
2. Deployado no GitHub Pages

### URL do Deploy
- **GitHub Pages**: https://marceloaugusto777.github.io/finance-ai/

### Deploy Manual

Se preferir fazer deploy manualmente:

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Componentes de autenticação
│   ├── charts/         # Componentes de gráficos
│   ├── dashboard/      # Componentes do dashboard
│   ├── forms/          # Formulários
│   ├── layout/         # Layout e navegação
│   └── ui/             # Componentes UI reutilizáveis
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── contexts/           # Contextos React
├── integrations/       # Integrações externas
└── lib/                # Utilitários
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 📊 Banco de Dados

O projeto utiliza Supabase com as seguintes tabelas principais:

- **users**: Usuários do sistema
- **entradas**: Receitas/entradas financeiras
- **saidas**: Despesas/saídas financeiras
- **categorias**: Categorias de transações
- **cobrancas**: Sistema de cobranças

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ por [Seu Nome]
