\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned
\pset fieldsep ''
\pset footer off

\o pack1_snapshots/pre_rls_state.sql
SELECT format('ALTER TABLE public.%I %s ROW LEVEL SECURITY;', c.relname,
  CASE WHEN c.relrowsecurity THEN 'ENABLE' ELSE 'DISABLE' END)
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons')
ORDER BY c.relname;
SELECT format('ALTER TABLE public.%I %s ROW LEVEL SECURITY;', c.relname,
  CASE WHEN c.relforcerowsecurity THEN 'FORCE' ELSE 'NO FORCE' END)
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons')
ORDER BY c.relname;
\o

\o pack1_snapshots/pre_policies.sql
SELECT format(
  'CREATE POLICY %I ON public.%I AS %s FOR %s TO %s%s%s;',
  p.polname, c.relname,
  CASE WHEN p.polpermissive THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END,
  CASE p.polcmd WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT' WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE' WHEN '*' THEN 'ALL' END,
  CASE WHEN p.polroles = '{}'::oid[] OR p.polroles IS NULL THEN 'PUBLIC'
    ELSE (SELECT string_agg(CASE WHEN u.oid = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END, ', ' ORDER BY ord)
      FROM unnest(p.polroles) WITH ORDINALITY AS u(oid, ord)
      LEFT JOIN pg_roles r ON r.oid = u.oid AND u.oid <> 0) END,
  CASE WHEN p.polqual IS NOT NULL THEN ' USING (' || pg_get_expr(p.polqual, p.polrelid, false) || ')' ELSE '' END,
  CASE WHEN p.polwithcheck IS NOT NULL THEN ' WITH CHECK (' || pg_get_expr(p.polwithcheck, p.polrelid, false) || ')' ELSE '' END
)
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons')
ORDER BY c.relname, p.polname;
\o

\o pack1_snapshots/pre_grants_tables.sql
SELECT format('REVOKE ALL ON TABLE public.%I FROM %s;', c.relname,
  CASE WHEN x.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END)
FROM (
  SELECT DISTINCT c.oid AS relid, c.relname, a.grantee
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  CROSS JOIN LATERAL aclexplode(COALESCE(c.relacl, acldefault('r', c.relowner))) a
  WHERE n.nspname = 'public' AND c.relkind = 'r'
    AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons')
) x
JOIN pg_class c ON c.oid = x.relid
LEFT JOIN pg_roles r ON r.oid = x.grantee AND x.grantee <> 0
ORDER BY c.relname, x.grantee;
SELECT format('GRANT %s ON TABLE public.%I TO %s%s;', a.privilege_type, c.relname,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
  CASE WHEN a.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END)
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
CROSS JOIN LATERAL aclexplode(COALESCE(c.relacl, acldefault('r', c.relowner))) a
LEFT JOIN pg_roles r ON r.oid = a.grantee AND a.grantee <> 0
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons')
ORDER BY c.relname, a.grantee, a.privilege_type;
\o

\o pack1_snapshots/pre_grants_columns.sql
SELECT format('GRANT %s (%I) ON TABLE public.%I TO %s%s;',
  a.privilege_type, att.attname, c.relname,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
  CASE WHEN a.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END)
FROM pg_attribute att
JOIN pg_class c ON c.oid = att.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace
CROSS JOIN LATERAL aclexplode(att.attacl) a
LEFT JOIN pg_roles r ON r.oid = a.grantee AND a.grantee <> 0
WHERE n.nspname = 'public'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons')
  AND att.attnum > 0 AND NOT att.attisdropped AND att.attacl IS NOT NULL
ORDER BY c.relname, att.attname, a.grantee, a.privilege_type;
\o

-- Multi-line SQL for DOWN restore only
\o pack1_snapshots/pre_function_defs.sql
SELECT pg_get_functiondef(p.oid) || E';\n'
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname IN (
  'ensure_user_profile','report_lesson_activity','trust_set_lesson_progress',
  'handle_student_linking','enroll_student_in_path_courses')
ORDER BY p.proname;
SELECT format('ALTER FUNCTION %s OWNER TO %I;', p.oid::regprocedure, r.rolname)
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_roles r ON r.oid = p.proowner
WHERE n.nspname = 'public' AND p.proname IN (
  'ensure_user_profile','report_lesson_activity','trust_set_lesson_progress',
  'handle_student_linking','enroll_student_in_path_courses')
ORDER BY p.proname;
\o

-- One record per function: signature | md5(full def) | owner  (content validation)
\o pack1_snapshots/pre_function_content.tsv
SELECT format(E'%s\t%s\t%s',
  p.oid::regprocedure::text,
  md5(pg_get_functiondef(p.oid)),
  r.rolname)
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_roles r ON r.oid = p.proowner
WHERE n.nspname = 'public' AND p.proname IN (
  'ensure_user_profile','report_lesson_activity','trust_set_lesson_progress',
  'handle_student_linking','enroll_student_in_path_courses')
ORDER BY p.oid::regprocedure::text;
\o

\o pack1_snapshots/pre_grants_functions.sql
SELECT format('REVOKE ALL ON FUNCTION %s FROM %s;', p.oid::regprocedure,
  CASE WHEN x.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END)
FROM (
  SELECT DISTINCT p.oid AS poid, a.grantee FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  CROSS JOIN LATERAL aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) a
  WHERE n.nspname = 'public' AND p.proname IN (
    'ensure_user_profile','report_lesson_activity','trust_set_lesson_progress',
    'handle_student_linking','enroll_student_in_path_courses')
) x
JOIN pg_proc p ON p.oid = x.poid
LEFT JOIN pg_roles r ON r.oid = x.grantee AND x.grantee <> 0
ORDER BY 1;
SELECT format('GRANT EXECUTE ON FUNCTION %s TO %s%s;', p.oid::regprocedure,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
  CASE WHEN a.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END)
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
CROSS JOIN LATERAL aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) a
LEFT JOIN pg_roles r ON r.oid = a.grantee AND a.grantee <> 0
WHERE n.nspname = 'public' AND p.proname IN (
  'ensure_user_profile','report_lesson_activity','trust_set_lesson_progress',
  'handle_student_linking','enroll_student_in_path_courses')
  AND a.privilege_type = 'EXECUTE'
ORDER BY 1;
\o

\o pack1_snapshots/pre_triggers.sql
SELECT pg_get_triggerdef(t.oid, true) || E';\n'
  || format(
    CASE t.tgenabled
      WHEN 'D' THEN 'ALTER TABLE %I.%I DISABLE TRIGGER %I;'
      WHEN 'R' THEN 'ALTER TABLE %I.%I ENABLE REPLICA TRIGGER %I;'
      WHEN 'A' THEN 'ALTER TABLE %I.%I ENABLE ALWAYS TRIGGER %I;'
      ELSE 'ALTER TABLE %I.%I ENABLE TRIGGER %I;' END,
    n.nspname, c.relname, t.tgname) || E'\n'
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE NOT t.tgisinternal AND (
  (n.nspname = 'public' AND c.relname = 'user_profile' AND p.proname = 'enroll_student_in_path_courses')
  OR (n.nspname = 'auth' AND c.relname = 'users'
      AND (p.proname = 'handle_student_linking' OR t.tgname = 'on_auth_user_created')));
\o

\o pack1_snapshots/pre_default_privileges.sql
SELECT format(
  'ALTER DEFAULT PRIVILEGES FOR ROLE %I%s REVOKE ALL ON %s FROM %s;',
  pg_get_userbyid(s.defaclrole),
  CASE WHEN s.defaclnamespace = 0 THEN '' ELSE ' IN SCHEMA public' END,
  CASE s.defaclobjtype WHEN 'r' THEN 'TABLES' WHEN 'S' THEN 'SEQUENCES' WHEN 'f' THEN 'FUNCTIONS'
    WHEN 'T' THEN 'TYPES' WHEN 'n' THEN 'SCHEMAS' END,
  CASE WHEN s.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END)
FROM (
  SELECT DISTINCT d.defaclrole, d.defaclnamespace, d.defaclobjtype, a.grantee
  FROM pg_default_acl d CROSS JOIN LATERAL aclexplode(d.defaclacl) a
  WHERE d.defaclnamespace = 0
     OR d.defaclnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
) s
LEFT JOIN pg_roles r ON r.oid = s.grantee AND s.grantee <> 0
ORDER BY 1;
SELECT format(
  'ALTER DEFAULT PRIVILEGES FOR ROLE %I%s GRANT %s ON %s TO %s%s;',
  pg_get_userbyid(d.defaclrole),
  CASE WHEN d.defaclnamespace = 0 THEN '' ELSE ' IN SCHEMA public' END,
  a.privilege_type,
  CASE d.defaclobjtype WHEN 'r' THEN 'TABLES' WHEN 'S' THEN 'SEQUENCES' WHEN 'f' THEN 'FUNCTIONS'
    WHEN 'T' THEN 'TYPES' WHEN 'n' THEN 'SCHEMAS' END,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
  CASE WHEN a.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END)
FROM pg_default_acl d CROSS JOIN LATERAL aclexplode(d.defaclacl) a
LEFT JOIN pg_roles r ON r.oid = a.grantee AND a.grantee <> 0
WHERE d.defaclnamespace = 0
   OR d.defaclnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY 1;
\o

\pset tuples_only off
\pset format aligned
