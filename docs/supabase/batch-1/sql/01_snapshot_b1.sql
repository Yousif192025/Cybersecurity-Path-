-- B1 Snapshot — pure SQL for Supabase SQL Editor (no psql meta-commands)
-- Run each section and save the restore_sql / drop_sql column text before UP.
-- Snapshot coverage: RLS flags, policies (USING + WITH CHECK), table grants, column grants.
-- This is NOT claimed to capture every catalog object outside these four tables.

-- ========== SECTION A: RLS state ==========
SELECT format(
  'ALTER TABLE public.%I %s ROW LEVEL SECURITY;',
  c.relname,
  CASE WHEN c.relrowsecurity THEN 'ENABLE' ELSE 'DISABLE' END
) AS restore_sql
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('enrollments', 'learning_progress', 'courses', 'lessons')
ORDER BY c.relname;

SELECT format(
  'ALTER TABLE public.%I %s ROW LEVEL SECURITY;',
  c.relname,
  CASE WHEN c.relforcerowsecurity THEN 'FORCE' ELSE 'NO FORCE' END
) AS restore_sql
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('enrollments', 'learning_progress', 'courses', 'lessons')
ORDER BY c.relname;

-- ========== SECTION B: Policies (USING and WITH CHECK both emitted when present) ==========
SELECT format(
  'CREATE POLICY %I ON public.%I AS %s FOR %s TO %s%s%s;',
  p.polname,
  c.relname,
  CASE WHEN p.polpermissive THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END,
  CASE p.polcmd
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
  END,
  COALESCE(
    CASE
      WHEN p.polroles = '{}'::oid[] OR p.polroles IS NULL THEN 'PUBLIC'
      ELSE (
        SELECT string_agg(
          CASE WHEN u.oid = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
          ', ' ORDER BY ord
        )
        FROM unnest(p.polroles) WITH ORDINALITY AS u(oid, ord)
        LEFT JOIN pg_roles r ON r.oid = u.oid AND u.oid <> 0
      )
    END,
    'PUBLIC'
  ),
  CASE
    WHEN p.polqual IS NOT NULL
    THEN ' USING (' || pg_get_expr(p.polqual, p.polrelid) || ')'
    ELSE ''
  END,
  CASE
    WHEN p.polwithcheck IS NOT NULL
    THEN ' WITH CHECK (' || pg_get_expr(p.polwithcheck, p.polrelid) || ')'
    ELSE ''
  END
) AS restore_sql
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('enrollments', 'learning_progress', 'courses', 'lessons')
ORDER BY c.relname, p.polname;

-- ========== SECTION C: Table-level grants ==========
SELECT format(
  'GRANT %s ON TABLE public.%I TO %s%s;',
  a.privilege_type,
  c.relname,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
  CASE WHEN a.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END
) AS restore_sql
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
CROSS JOIN LATERAL aclexplode(COALESCE(c.relacl, acldefault('r', c.relowner))) a
LEFT JOIN pg_roles r ON r.oid = a.grantee AND a.grantee <> 0
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('enrollments', 'learning_progress', 'courses', 'lessons')
ORDER BY c.relname, a.grantee, a.privilege_type;

-- ========== SECTION E: Column-level grants (required for complete client ACL restore) ==========
SELECT format(
  'GRANT %s (%I) ON TABLE public.%I TO %s%s;',
  a.privilege_type,
  att.attname,
  c.relname,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
  CASE WHEN a.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END
) AS restore_sql
FROM pg_attribute att
JOIN pg_class c ON c.oid = att.attrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
CROSS JOIN LATERAL aclexplode(att.attacl) a
LEFT JOIN pg_roles r ON r.oid = a.grantee AND a.grantee <> 0
WHERE n.nspname = 'public'
  AND c.relname IN ('enrollments', 'learning_progress', 'courses', 'lessons')
  AND att.attnum > 0
  AND NOT att.attisdropped
  AND att.attacl IS NOT NULL
ORDER BY c.relname, att.attname, a.grantee, a.privilege_type;

-- ========== SECTION D: Drop-policy helper ==========
SELECT format(
  'DROP POLICY IF EXISTS %I ON public.%I;',
  policyname,
  tablename
) AS drop_sql
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('enrollments', 'learning_progress', 'courses', 'lessons')
ORDER BY tablename, policyname;
