-- Script para adicionar campo status à tabela saidas
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar coluna status à tabela saidas
ALTER TABLE saidas 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'agendado';

-- 2. Atualizar registros existentes para ter um status padrão
UPDATE saidas 
SET status = 'agendado' 
WHERE status IS NULL;

-- 3. Verificar se a coluna foi adicionada corretamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'saidas' 
AND column_name = 'status';

-- 4. Verificar alguns registros para confirmar
SELECT id, descricao, valor, status, data
FROM saidas 
LIMIT 5;

-- 5. Criar índice para melhorar performance de consultas por status
CREATE INDEX IF NOT EXISTS idx_saidas_status ON saidas(status);
CREATE INDEX IF NOT EXISTS idx_saidas_user_status ON saidas(user_id, status); 