-- Script para corrigir e adicionar campo status na tabela entradas
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a coluna status existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'entradas' 
        AND column_name = 'status'
    ) THEN
        -- Adicionar coluna status se não existir
        ALTER TABLE entradas ADD COLUMN status VARCHAR(20) DEFAULT 'pendente';
        RAISE NOTICE 'Coluna status adicionada à tabela entradas';
    ELSE
        RAISE NOTICE 'Coluna status já existe na tabela entradas';
    END IF;
END $$;

-- 2. Verificar se a constraint existe e criar se necessário
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.check_constraints 
        WHERE constraint_name = 'check_status'
    ) THEN
        -- Adicionar constraint para valores válidos
        ALTER TABLE entradas ADD CONSTRAINT check_status CHECK (status IN ('pendente', 'pago'));
        RAISE NOTICE 'Constraint check_status adicionada';
    ELSE
        RAISE NOTICE 'Constraint check_status já existe';
    END IF;
END $$;

-- 3. Criar índice se não existir
CREATE INDEX IF NOT EXISTS idx_entradas_status ON entradas(status);

-- 4. Atualizar registros existentes para ter status padrão
UPDATE entradas 
SET status = 'pendente' 
WHERE status IS NULL OR status = '';

-- 5. Verificar a estrutura atual da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'entradas' 
ORDER BY ordinal_position;

-- 6. Verificar dados existentes
SELECT 
  status,
  COUNT(*) as quantidade
FROM entradas 
GROUP BY status 
ORDER BY status;

-- 7. Testar inserção de dados
INSERT INTO entradas (
  valor, 
  descricao, 
  categoria, 
  data, 
  status, 
  user_id
) VALUES (
  100.00,
  'Teste de entrada',
  'Vendas',
  CURRENT_DATE,
  'pendente',
  (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT DO NOTHING;

-- 8. Verificar se a inserção funcionou
SELECT 
  descricao,
  valor,
  categoria,
  data,
  status,
  created_at
FROM entradas 
WHERE descricao = 'Teste de entrada'
ORDER BY created_at DESC 
LIMIT 5;

-- 9. Limpar dados de teste (opcional)
-- DELETE FROM entradas WHERE descricao = 'Teste de entrada'; 