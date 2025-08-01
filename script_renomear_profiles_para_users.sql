-- Script para verificar e renomear a tabela profiles para users
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela profiles existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
        THEN 'Tabela profiles existe'
        ELSE 'Tabela profiles NÃO existe'
    END as status_profiles;

-- 2. Verificar se a tabela users existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') 
        THEN 'Tabela users existe'
        ELSE 'Tabela users NÃO existe'
    END as status_users;

-- 3. Verificar estrutura da tabela profiles (se existir)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Verificar estrutura da tabela users (se existir)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 5. Contar registros em cada tabela
SELECT 
    'profiles' as tabela,
    COUNT(*) as total_registros
FROM public.profiles
UNION ALL
SELECT 
    'users' as tabela,
    COUNT(*) as total_registros
FROM public.users;

-- 6. Se profiles existe e users não existe, renomear
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
    AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        
        -- Renomear a tabela profiles para users
        ALTER TABLE public.profiles RENAME TO users;
        
        -- Renomear a coluna user_id para id (se existir)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'user_id') THEN
            ALTER TABLE public.users RENAME COLUMN user_id TO id;
        END IF;
        
        -- Renomear a coluna telefone para contato (se existir)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'telefone') THEN
            ALTER TABLE public.users RENAME COLUMN telefone TO contato;
        END IF;
        
        -- Adicionar constraint UNIQUE no email se não existir
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_schema = 'public' AND table_name = 'users' AND constraint_name LIKE '%email%') THEN
            ALTER TABLE public.users ADD CONSTRAINT users_email_unique UNIQUE (email);
        END IF;
        
        -- Criar índices se não existirem
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'users' AND indexname = 'idx_users_email') THEN
            CREATE INDEX idx_users_email ON public.users(email);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'users' AND indexname = 'idx_users_nome') THEN
            CREATE INDEX idx_users_nome ON public.users(nome);
        END IF;
        
        RAISE NOTICE 'Tabela profiles renomeada para users com sucesso!';
        
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
    AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        
        RAISE NOTICE 'Ambas as tabelas profiles e users existem. Verifique manualmente qual usar.';
        
    ELSE
        RAISE NOTICE 'Tabela profiles não existe ou users já existe.';
    END IF;
END $$;

-- 7. Verificar resultado final
SELECT 
    'users' as tabela,
    COUNT(*) as total_registros
FROM public.users; 