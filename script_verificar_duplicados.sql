-- Script para verificar e limpar dados duplicados
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar duplicados na tabela entradas
SELECT 
    'entradas' as tabela,
    COUNT(*) as total_registros,
    COUNT(DISTINCT id) as registros_unicos,
    COUNT(*) - COUNT(DISTINCT id) as duplicados
FROM public.entradas
UNION ALL
SELECT 
    'saidas' as tabela,
    COUNT(*) as total_registros,
    COUNT(DISTINCT id) as registros_unicos,
    COUNT(*) - COUNT(DISTINCT id) as duplicados
FROM public.saidas;

-- 2. Verificar registros com valores suspeitos (muito altos ou muito baixos)
SELECT 
    'entradas' as tabela,
    COUNT(*) as registros,
    MIN(valor) as valor_minimo,
    MAX(valor) as valor_maximo,
    AVG(valor) as valor_medio
FROM public.entradas
UNION ALL
SELECT 
    'saidas' as tabela,
    COUNT(*) as registros,
    MIN(valor) as valor_minimo,
    MAX(valor) as valor_maximo,
    AVG(valor) as valor_medio
FROM public.saidas;

-- 3. Verificar registros por usuário
SELECT 
    user_id,
    COUNT(*) as total_entradas
FROM public.entradas
GROUP BY user_id
ORDER BY total_entradas DESC;

SELECT 
    user_id,
    COUNT(*) as total_saidas
FROM public.saidas
GROUP BY user_id
ORDER BY total_saidas DESC;

-- 4. Verificar registros criados hoje
SELECT 
    'entradas' as tabela,
    COUNT(*) as registros_hoje
FROM public.entradas
WHERE DATE(created_at) = CURRENT_DATE
UNION ALL
SELECT 
    'saidas' as tabela,
    COUNT(*) as registros_hoje
FROM public.saidas
WHERE DATE(created_at) = CURRENT_DATE;

-- 5. Limpar duplicados (se existirem) - DESCOMENTE APENAS SE NECESSÁRIO
/*
-- Para entradas
DELETE FROM public.entradas 
WHERE id IN (
    SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY user_id, valor, descricao, data ORDER BY created_at) as rn
        FROM public.entradas
    ) t WHERE t.rn > 1
);

-- Para saídas
DELETE FROM public.saidas 
WHERE id IN (
    SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY user_id, valor, descricao, data ORDER BY created_at) as rn
        FROM public.saidas
    ) t WHERE t.rn > 1
);
*/

-- 6. Verificar estrutura das tabelas
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('entradas', 'saidas')
ORDER BY table_name, ordinal_position; 