-- Script robusto para verificar e testar entradas
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se há usuários autenticados
DO $$
DECLARE
    user_count INTEGER;
    test_user_id UUID;
BEGIN
    -- Contar usuários
    SELECT COUNT(*) INTO user_count FROM auth.users;
    RAISE NOTICE 'Total de usuários: %', user_count;
    
    -- Obter um user_id para teste
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE EXCEPTION 'Nenhum usuário encontrado na tabela auth.users';
    ELSE
        RAISE NOTICE 'User ID para teste: %', test_user_id;
        
        -- Testar inserção
        INSERT INTO entradas (
            valor, 
            descricao, 
            categoria, 
            data, 
            status, 
            user_id
        ) VALUES (
            150.00,
            'Teste automático de entrada',
            'Vendas',
            CURRENT_DATE,
            'pendente',
            test_user_id
        );
        
        RAISE NOTICE 'Inserção de teste realizada com sucesso!';
    END IF;
END $$;

-- 2. Verificar se a inserção funcionou
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
WHERE descricao = 'Teste automático de entrada'
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'entradas' 
ORDER BY ordinal_position;

-- 4. Verificar dados existentes
SELECT 
    status,
    COUNT(*) as quantidade
FROM entradas 
GROUP BY status 
ORDER BY status;

-- 5. Verificar RLS (Row Level Security)
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

-- 6. Limpar dados de teste (opcional)
-- DELETE FROM entradas WHERE descricao = 'Teste automático de entrada'; 