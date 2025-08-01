-- Script para criar a tabela cobrancas
-- Execute este script no seu banco de dados Supabase

-- Criar tabela cobrancas se não existir
CREATE TABLE IF NOT EXISTS public.cobrancas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cobrancas_user_id ON public.cobrancas(user_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_cliente_id ON public.cobrancas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_status ON public.cobrancas(status);
CREATE INDEX IF NOT EXISTS idx_cobrancas_data_vencimento ON public.cobrancas(data_vencimento);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view their own cobrancas" ON public.cobrancas;
DROP POLICY IF EXISTS "Users can insert their own cobrancas" ON public.cobrancas;
DROP POLICY IF EXISTS "Users can update their own cobrancas" ON public.cobrancas;
DROP POLICY IF EXISTS "Users can delete their own cobrancas" ON public.cobrancas;

-- Criar política para usuários verem apenas suas próprias cobranças
CREATE POLICY "Users can view their own cobrancas" ON public.cobrancas
    FOR SELECT USING (auth.uid() = user_id);

-- Criar política para usuários inserirem suas próprias cobranças
CREATE POLICY "Users can insert their own cobrancas" ON public.cobrancas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Criar política para usuários atualizarem suas próprias cobranças
CREATE POLICY "Users can update their own cobrancas" ON public.cobrancas
    FOR UPDATE USING (auth.uid() = user_id);

-- Criar política para usuários deletarem suas próprias cobranças
CREATE POLICY "Users can delete their own cobrancas" ON public.cobrancas
    FOR DELETE USING (auth.uid() = user_id);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS update_cobrancas_updated_at ON public.cobrancas;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_cobrancas_updated_at 
    BEFORE UPDATE ON public.cobrancas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar se a tabela foi criada
SELECT 'Tabela cobrancas criada com sucesso!' as status; 