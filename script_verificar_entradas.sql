-- Script para verificar se a tabela entradas está funcionando corretamente
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'entradas' 
ORDER BY ordinal_position;

-- 2. Verificar se há dados na tabela
SELECT COUNT(*) as total_entradas FROM entradas;

-- 3. Verificar dados existentes
SELECT 
  id,
  descricao,
  valor,
  categoria,
  data,
  status,
  user_id,
  created_at
FROM entradas 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Verificar se o campo status existe e tem valores
SELECT 
  status,
  COUNT(*) as quantidade
FROM entradas 
GROUP BY status 
ORDER BY status;

-- 5. Testar inserção manual (substitua o user_id pelo seu)
-- INSERT INTO entradas (
--   valor, 
--   descricao, 
--   categoria, 
--   data, 
--   status, 
--   user_id
-- ) VALUES (
--   150.00,
--   'Teste manual',
--   'Vendas',
--   CURRENT_DATE,
--   'pendente',
--   'SEU_USER_ID_AQUI'
-- );

-- 6. Verificar RLS (Row Level Security)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'entradas';

-- 7. Verificar triggers
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'entradas'; 