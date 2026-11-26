-- B1 Preflight — pure SQL for Supabase SQL Editor (no psql meta-commands)
-- Read-only. Run before UP.

-- Required roles
SELECT rolname
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'service_role', 'postgres')
ORDER BY 1;

-- B1 tables + RLS flags
SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('user_profile', 'enrollments', 'learning_progress', 'courses', 'lessons')
ORDER BY 1;

-- B0: get_my_role must exist
SELECT p.proname,
       p.prosecdef,
       pg_get_function_identity_arguments(p.oid) AS args,
       r.rolname AS owner
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_roles r ON r.oid = p.proowner
WHERE n.nspname = 'public'
  AND p.proname = 'get_my_role';

-- Current policies on B1 tables
SELECT tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('enrollments', 'learning_progress', 'courses', 'lessons')
ORDER BY tablename, policyname;

-- Client table privileges
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('enrollments', 'learning_progress', 'courses', 'lessons')
  AND grantee IN ('anon', 'authenticated', 'PUBLIC')
ORDER BY table_name, grantee, privilege_type;

-- Academic triggers on user_profile (B1 must leave them in place)
SELECT t.tgname, p.proname, t.tgenabled
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE NOT t.tgisinternal
  AND n.nspname = 'public'
  AND c.relname = 'user_profile'
  AND p.proname = 'enroll_student_in_path_courses';

-- Historical progress rows without user_id (must not be deleted by B1)
SELECT count(*) AS learning_progress_null_user_id
FROM public.learning_progress
WHERE user_id IS NULL;

-- enrollments NOT NULL columns (operator: enroll_self_in_course inserts only user_id, course_id)
SELECT column_name, is_nullable, column_default, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'enrollments'
ORDER BY ordinal_position;

-- B1: publication-related columns on courses and lessons
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('courses', 'lessons')
  AND (
    column_name ILIKE '%publish%'
    OR column_name ILIKE '%public%'
    OR column_name ILIKE '%status%'
    OR column_name ILIKE '%visible%'
    OR column_name ILIKE '%active%'
    OR column_name ILIKE '%draft%'
  )
ORDER BY table_name, ordinal_position;
SQLcd /workspaces/Cybersecurity-Path- && cat >> docs/supabase/batch-1/sql/00_preflight.sql <<'SQL'

-- B1: publication-related columns on courses and lessons
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('courses', 'lessons')
  AND (
    column_name ILIKE '%publish%'
    OR column_name ILIKE '%public%'
    OR column_name ILIKE '%status%'
    OR column_name ILIKE '%visible%'
    OR column_name ILIKE '%active%'
    OR column_name ILIKE '%draft%'
  )
ORDER BY table_name, ordinal_position;

-- B1: publication-related columns on courses and lessons
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('courses', 'lessons')
  AND (
    column_name ILIKE '%publish%'
    OR column_name ILIKE '%public%'
    OR column_name ILIKE '%status%'
    OR column_name ILIKE '%visible%'
    OR column_name ILIKE '%active%'
    OR column_name ILIKE '%draft%'
  )
ORDER BY table_name, ordinal_position;
