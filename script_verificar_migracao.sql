-- Script para verificar o estado atual e migrar dados se necessário
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela users existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') 
        THEN 'Tabela users existe'
        ELSE 'Tabela users NÃO existe'
    END as status_users;

-- 2. Verificar se a tabela profiles existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
        THEN 'Tabela profiles existe'
        ELSE 'Tabela profiles NÃO existe'
    END as status_profiles;

-- 3. Verificar estrutura da tabela users (se existir)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 4. Verificar políticas de segurança da tabela users
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 5. Contar registros em cada tabela
SELECT 
    'users' as tabela,
    COUNT(*) as total_registros
FROM public.users
UNION ALL
SELECT 
    'profiles' as tabela,
    COUNT(*) as total_registros
FROM public.profiles;

-- 6. Se a tabela profiles existir e users estiver vazia, migrar dados
DO $$
DECLARE
    profiles_count INTEGER;
    users_count INTEGER;
BEGIN
    -- Verificar se profiles existe e tem dados
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        SELECT COUNT(*) INTO profiles_count FROM public.profiles;
        SELECT COUNT(*) INTO users_count FROM public.users;
        
        -- Se profiles tem dados e users está vazia, migrar
        IF profiles_count > 0 AND users_count = 0 THEN
            INSERT INTO public.users (id, nome, contato, email, created_at, updated_at)
            SELECT 
                user_id as id,
                COALESCE(nome, 'Nome não informado') as nome,
                COALESCE(telefone, 'Contato não informado') as contato,
                COALESCE(email, 'email@exemplo.com') as email,
                created_at,
                updated_at
            FROM public.profiles
            WHERE user_id NOT IN (SELECT id FROM public.users);
            
            RAISE NOTICE 'Migração concluída: % registros migrados de profiles para users', profiles_count;
        ELSE
            RAISE NOTICE 'Migração não necessária: profiles=% registros, users=% registros', profiles_count, users_count;
        END IF;
    ELSE
        RAISE NOTICE 'Tabela profiles não existe';
    END IF;
END $$; 