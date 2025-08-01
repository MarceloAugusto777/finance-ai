-- Script para criar a tabela users com verificação de existência
-- Execute este script no SQL Editor do Supabase

-- 1. Criar a nova tabela users (se não existir)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices (se não existirem)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_nome ON public.users(nome);

-- 3. Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de segurança (apenas se não existirem)
DO $$
BEGIN
    -- Política para visualizar dados próprios
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can view own data'
    ) THEN
        CREATE POLICY "Users can view own data" ON public.users
            FOR SELECT USING (auth.uid()::text = id::text);
    END IF;

    -- Política para inserir dados próprios
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can insert own data'
    ) THEN
        CREATE POLICY "Users can insert own data" ON public.users
            FOR INSERT WITH CHECK (auth.uid()::text = id::text);
    END IF;

    -- Política para atualizar dados próprios
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can update own data'
    ) THEN
        CREATE POLICY "Users can update own data" ON public.users
            FOR UPDATE USING (auth.uid()::text = id::text);
    END IF;

    -- Política para deletar dados próprios
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can delete own data'
    ) THEN
        CREATE POLICY "Users can delete own data" ON public.users
            FOR DELETE USING (auth.uid()::text = id::text);
    END IF;
END $$;

-- 5. Criar função para atualizar updated_at (se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar trigger (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_users_updated_at'
    ) THEN
        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON public.users 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 7. Verificar se a tabela foi criada corretamente
SELECT 
    'Tabela users criada com sucesso!' as status,
    COUNT(*) as total_users
FROM public.users; 