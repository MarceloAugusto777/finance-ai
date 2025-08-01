-- Script para adicionar campo status à tabela entradas
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar coluna status à tabela entradas
ALTER TABLE entradas 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pendente';

-- 2. Atualizar registros existentes para ter um status padrão
UPDATE entradas 
SET status = 'pendente' 
WHERE status IS NULL;

-- 3. Verificar se a coluna foi adicionada corretamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'entradas' 
AND column_name = 'status';

-- 4. Verificar alguns registros para confirmar
SELECT id, descricao, valor, status, data
FROM entradas 
LIMIT 5;

-- 5. Criar índice para melhorar performance de consultas por status
CREATE INDEX IF NOT EXISTS idx_entradas_status ON entradas(status);
CREATE INDEX IF NOT EXISTS idx_entradas_user_status ON entradas(user_id, status); 