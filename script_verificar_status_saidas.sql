-- Script para verificar se o campo status existe na tabela saidas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estrutura da tabela saidas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'saidas' 
ORDER BY ordinal_position;

-- 2. Verificar se a coluna status existe
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'saidas' 
AND column_name = 'status';

-- 3. Verificar alguns registros da tabela saidas
SELECT id, descricao, valor, data, user_id, created_at
FROM saidas 
LIMIT 5;

-- 4. Contar total de registros
SELECT COUNT(*) as total_saidas FROM saidas;

-- 5. Verificar se há registros com status (se a coluna existir)
SELECT status, COUNT(*) as quantidade
FROM saidas 
GROUP BY status; 