-- Script de teste corrigido para entradas
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar se há usuários na tabela auth.users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Verificar se há dados na tabela entradas
SELECT COUNT(*) as total_entradas FROM entradas;

-- 3. Testar inserção com user_id válido
-- Substitua 'SEU_USER_ID_AQUI' pelo ID real de um usuário
INSERT INTO entradas (
  valor, 
  descricao, 
  categoria, 
  data, 
  status, 
  user_id
) VALUES (
  100.00,
  'Teste de entrada corrigido',
  'Vendas',
  CURRENT_DATE,
  'pendente',
  (SELECT id FROM auth.users LIMIT 1)
);

-- 4. Verificar se a inserção funcionou
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
WHERE descricao = 'Teste de entrada corrigido'
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Verificar estrutura da tabela entradas
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'entradas' 
ORDER BY ordinal_position;

-- 6. Verificar se o campo status foi criado corretamente
SELECT 
  status,
  COUNT(*) as quantidade
FROM entradas 
GROUP BY status 
ORDER BY status;

-- 7. Limpar dados de teste (opcional - descomente se quiser remover)
-- DELETE FROM entradas WHERE descricao = 'Teste de entrada corrigido'; 