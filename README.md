# Finance AI - Sistema de Gestão Financeira Inteligente

Um sistema completo de gestão financeira desenvolvido com React, TypeScript e Supabase, oferecendo funcionalidades avançadas para empresas e profissionais. **Produto comercial com sistema de autenticação completo.**

## 🚀 Funcionalidades Principais

### 📊 **Dashboard Intuitivo**
- Visualização em tempo real de entradas e saídas
- Gráficos interativos e métricas importantes
- Interface responsiva e moderna

### 💰 **Gestão Financeira**
- Controle de entradas e saídas
- Categorização automática
- Gestão de clientes e cobranças
- Relatórios detalhados

### 🔐 **Sistema de Autenticação Completo**
- **Login/Cadastro** com email e senha
- **Login social** com Google OAuth
- **Recuperação de senha** via email
- **Verificação de email** obrigatória
- **Proteção de rotas** automática
- **Gerenciamento de perfil** do usuário
- **Logout** seguro

### 🔄 **Funcionalidades Avançadas**
- **Backup automático** dos dados
- **Exportação de relatórios** em múltiplos formatos
- **Integração com calendário** e lembretes

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui
- **Autenticação**: Supabase Auth
- **Backend**: Supabase (PostgreSQL)
- **Roteamento**: React Router DOM
- **Gerenciamento de Estado**: React Query (TanStack Query)
- **Ícones**: Lucide React

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/finance-ai.git
cd finance-ai
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
bun install
```

3. **Configure o Supabase**
   - Crie uma conta em [supabase.com](https://supabase.com)
   - Crie um novo projeto
   - Configure as variáveis de ambiente no arquivo `src/integrations/supabase/client.ts`
   - Configure o Google OAuth no painel do Supabase

4. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env.local
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

5. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

## 🔧 Configuração do Supabase

### 1. **Configuração da Autenticação**
```sql
-- Habilitar autenticação por email
-- Configurar templates de email no painel do Supabase
-- Configurar URLs de redirecionamento para OAuth
```

### 2. **Configuração do Google OAuth**
1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto e configure as credenciais OAuth
3. Adicione as URLs de redirecionamento:
   - `https://seu-projeto.supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (desenvolvimento)

### 3. **Estrutura do Banco de Dados**
```sql
-- Tabela de perfis de usuário
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── auth/           # Componentes de autenticação
│   │   ├── ProtectedRoute.tsx
│   │   └── UserProfile.tsx
│   ├── backup/         # Sistema de backup
│   ├── exportacao/     # Exportação de relatórios
│   ├── calendario/     # Integração com calendário
│   └── ui/            # Componentes UI reutilizáveis
├── contexts/
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/
│   ├── useAuth.ts      # Hook de autenticação
│   ├── useBackup.ts    # Hook de backup
│   ├── useExportacao.ts # Hook de exportação
│   └── useCalendario.ts # Hook de calendário
├── integrations/
│   └── supabase/      # Configuração do Supabase
├── pages/
│   ├── auth/          # Páginas de autenticação
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── VerifyEmail.tsx
│   │   └── AuthCallback.tsx
│   └── Landing.tsx    # Página de landing
└── App.tsx           # Configuração de rotas
```

## 🔐 Sistema de Autenticação

### **Funcionalidades Implementadas**

#### 1. **Login/Cadastro**
- Formulários modernos e responsivos
- Validação em tempo real
- Integração com Supabase Auth
- Suporte a login social (Google)

#### 2. **Recuperação de Senha**
- Envio de email de recuperação
- Página de confirmação
- Redefinição segura de senha

#### 3. **Verificação de Email**
- Confirmação obrigatória de email
- Página de verificação
- Redirecionamento automático

#### 4. **Proteção de Rotas**
- Componente `ProtectedRoute`
- Redirecionamento automático
- Verificação de sessão

#### 5. **Gerenciamento de Perfil**
- Edição de informações pessoais
- Visualização de dados da conta
- Atualização segura de perfil

### **Fluxo de Autenticação**

```
1. Usuário acessa a aplicação
2. Se não autenticado → Redirecionado para /auth/login
3. Login bem-sucedido → Redirecionado para /dashboard
4. Se email não confirmado → Redirecionado para /auth/verify-email
5. Todas as rotas protegidas verificam autenticação
```

## 💼 Funcionalidades Comerciais

### **Página de Landing**
- Design profissional e moderno
- Seções de funcionalidades
- Planos de preços
- Depoimentos de clientes
- Call-to-action otimizado

### **Planos de Preços**
- **Gratuito**: Funcionalidades básicas
- **Profissional**: R$ 29/mês - Funcionalidades completas
- **Empresarial**: R$ 99/mês - Múltiplos usuários e API

### **Elementos de Conversão**
- CTAs estratégicos
- Benefícios claros
- Social proof
- Garantias de segurança

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔒 Segurança

- **Autenticação segura** com Supabase
- **Dados criptografados** em trânsito e repouso
- **Proteção de rotas** implementada
- **Validação de entrada** em todos os formulários
- **Políticas de segurança** no banco de dados

## 🚀 Deploy

### **Vercel (Recomendado)**
```bash
npm install -g vercel
vercel
```

### **Netlify**
```bash
npm run build
# Faça upload da pasta dist/
```

### **Configuração de Produção**
1. Configure as variáveis de ambiente
2. Atualize as URLs de redirecionamento no Supabase
3. Configure o domínio personalizado
4. Ative HTTPS

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@finance-ai.com
- **Documentação**: [docs.finance-ai.com](https://docs.finance-ai.com)
- **Status**: [status.finance-ai.com](https://status.finance-ai.com)

## 🗺️ Roadmap

- [ ] Integração com bancos brasileiros
- [ ] App mobile nativo
- [ ] IA para categorização automática
- [ ] Integração com sistemas contábeis
- [ ] Módulo de metas financeiras
- [ ] Relatórios fiscais
- [ ] API pública para desenvolvedores
- [ ] Marketplace de integrações

---

**Finance AI** - Transformando a gestão financeira com tecnologia inteligente.
