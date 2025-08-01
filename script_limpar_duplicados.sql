-- Script para verificar e limpar duplicados nas tabelas entradas e saidas
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar duplicados na tabela entradas
SELECT 
  valor,
  descricao,
  categoria,
  data,
  user_id,
  COUNT(*) as quantidade
FROM entradas
GROUP BY valor, descricao, categoria, data, user_id
HAVING COUNT(*) > 1
ORDER BY quantidade DESC;

-- 2. Verificar duplicados na tabela saidas
SELECT 
  valor,
  descricao,
  categoria,
  data,
  user_id,
  COUNT(*) as quantidade
FROM saidas
GROUP BY valor, descricao, categoria, data, user_id
HAVING COUNT(*) > 1
ORDER BY quantidade DESC;

-- 3. Limpar duplicados na tabela entradas (manter apenas o registro mais recente)
DELETE FROM entradas
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY valor, descricao, categoria, data, user_id
             ORDER BY created_at DESC
           ) as rn
    FROM entradas
  ) t
  WHERE t.rn > 1
);

-- 4. Limpar duplicados na tabela saidas (manter apenas o registro mais recente)
DELETE FROM saidas
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY valor, descricao, categoria, data, user_id
             ORDER BY created_at DESC
           ) as rn
    FROM saidas
  ) t
  WHERE t.rn > 1
);

-- 5. Verificar se ainda há duplicados após a limpeza
SELECT 'Entradas após limpeza' as tabela, COUNT(*) as total
FROM entradas
UNION ALL
SELECT 'Saidas após limpeza' as tabela, COUNT(*) as total
FROM saidas;

-- 6. Verificar registros por usuário
SELECT 
  'Entradas por usuário' as tipo,
  user_id,
  COUNT(*) as quantidade
FROM entradas
GROUP BY user_id
UNION ALL
SELECT 
  'Saidas por usuário' as tipo,
  user_id,
  COUNT(*) as quantidade
FROM saidas
GROUP BY user_id
ORDER BY tipo, quantidade DESC; 