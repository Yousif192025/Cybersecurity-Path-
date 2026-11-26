\set ON_ERROR_STOP on

CREATE TEMP TABLE f_policy_raw (line text);
CREATE TEMP TABLE f_policies (line text);
CREATE TEMP TABLE f_rls (line text);
CREATE TEMP TABLE f_tbl (line text);
CREATE TEMP TABLE f_col (line text);
CREATE TEMP TABLE f_fncontent (
  signature text,
  def_md5 text,
  owner_name text
);
CREATE TEMP TABLE f_fnacl (line text);
CREATE TEMP TABLE f_trg (line text);
CREATE TEMP TABLE f_def (line text);

\copy f_policy_raw FROM PROGRAM 'grep -v "^$" pack1_snapshots/pre_policies.sql | sed "s/\r$//"'

WITH ordered AS (
  SELECT ctid AS ord, line,
    SUM(CASE WHEN line LIKE 'CREATE POLICY %' THEN 1 ELSE 0 END)
      OVER (ORDER BY ctid) AS policy_no
  FROM f_policy_raw
)
INSERT INTO f_policies(line)
SELECT regexp_replace(
  string_agg(line, ' ' ORDER BY ord),
  '[[:space:]]+', ' ', 'g'
)
FROM ordered
GROUP BY policy_no;

\copy f_rls FROM PROGRAM 'grep -v "^$" pack1_snapshots/pre_rls_state.sql | sed "s/\r$//"'
\copy f_tbl FROM PROGRAM 'grep -v "^$" pack1_snapshots/pre_grants_tables.sql | sed "s/\r$//"'
\copy f_col FROM PROGRAM 'grep -v "^$" pack1_snapshots/pre_grants_columns.sql | sed "s/\r$//"'
\copy f_fncontent FROM PROGRAM 'grep -v "^$" pack1_snapshots/pre_function_content.tsv | sed "s/\r$//"'
ALTER TABLE f_fncontent ADD COLUMN line text;
UPDATE f_fncontent SET line = format(E'%s\t%s\t%s', signature, def_md5, owner_name);
\copy f_fnacl FROM PROGRAM 'grep -v "^$" pack1_snapshots/pre_grants_functions.sql | sed "s/\r$//"'
\copy f_trg FROM PROGRAM 'grep -v "^$" pack1_snapshots/pre_triggers.sql | sed "s/\r$//"'
\copy f_def FROM PROGRAM 'grep -v "^$" pack1_snapshots/pre_default_privileges.sql | sed "s/\r$//"'

CREATE TEMP TABLE l_policies AS
SELECT regexp_replace(
  format(
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
  ),
  '[[:space:]]+', ' ', 'g'
) AS line
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons');

CREATE TEMP TABLE l_rls AS
SELECT format('ALTER TABLE public.%I %s ROW LEVEL SECURITY;', c.relname,
  CASE WHEN c.relrowsecurity THEN 'ENABLE' ELSE 'DISABLE' END) AS line
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons')
UNION ALL
SELECT format('ALTER TABLE public.%I %s ROW LEVEL SECURITY;', c.relname,
  CASE WHEN c.relforcerowsecurity THEN 'FORCE' ELSE 'NO FORCE' END)
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons');

CREATE TEMP TABLE l_tbl AS
SELECT format('REVOKE ALL ON TABLE public.%I FROM %s;', c.relname,
  CASE WHEN x.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END) AS line
FROM (
  SELECT DISTINCT c.oid AS relid, c.relname, a.grantee
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  CROSS JOIN LATERAL aclexplode(COALESCE(c.relacl, acldefault('r', c.relowner))) a
  WHERE n.nspname = 'public' AND c.relkind = 'r'
    AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons')
) x
JOIN pg_class c ON c.oid = x.relid
LEFT JOIN pg_roles r ON r.oid = x.grantee AND x.grantee <> 0
UNION ALL
SELECT format('GRANT %s ON TABLE public.%I TO %s%s;', a.privilege_type, c.relname,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
  CASE WHEN a.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END)
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
CROSS JOIN LATERAL aclexplode(COALESCE(c.relacl, acldefault('r', c.relowner))) a
LEFT JOIN pg_roles r ON r.oid = a.grantee AND a.grantee <> 0
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons');

CREATE TEMP TABLE l_col AS
SELECT format('GRANT %s (%I) ON TABLE public.%I TO %s%s;',
  a.privilege_type, att.attname, c.relname,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
  CASE WHEN a.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END) AS line
FROM pg_attribute att
JOIN pg_class c ON c.oid = att.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace
CROSS JOIN LATERAL aclexplode(att.attacl) a
LEFT JOIN pg_roles r ON r.oid = a.grantee AND a.grantee <> 0
WHERE n.nspname = 'public'
  AND c.relname IN ('user_profile','enrollments','learning_progress','courses','lessons')
  AND att.attnum > 0 AND NOT att.attisdropped AND att.attacl IS NOT NULL;

-- Same one-line format as pre_function_content.tsv (def content via md5 + owner)
CREATE TEMP TABLE l_fncontent AS
SELECT format(E'%s\t%s\t%s',
  p.oid::regprocedure::text,
  md5(pg_get_functiondef(p.oid)),
  r.rolname) AS line
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_roles r ON r.oid = p.proowner
WHERE n.nspname = 'public' AND p.proname IN (
  'ensure_user_profile','report_lesson_activity','trust_set_lesson_progress',
  'handle_student_linking','enroll_student_in_path_courses');

CREATE TEMP TABLE l_fnacl AS
SELECT format('REVOKE ALL ON FUNCTION %s FROM %s;', p.oid::regprocedure,
  CASE WHEN x.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END) AS line
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
UNION ALL
SELECT format('GRANT EXECUTE ON FUNCTION %s TO %s%s;', p.oid::regprocedure,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END,
  CASE WHEN a.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END)
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
CROSS JOIN LATERAL aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) a
LEFT JOIN pg_roles r ON r.oid = a.grantee AND a.grantee <> 0
WHERE n.nspname = 'public' AND p.proname IN (
  'ensure_user_profile','report_lesson_activity','trust_set_lesson_progress',
  'handle_student_linking','enroll_student_in_path_courses')
  AND a.privilege_type = 'EXECUTE';

CREATE TEMP TABLE l_trg AS
SELECT rtrim(pg_get_triggerdef(t.oid, true)) || ';' AS line
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE NOT t.tgisinternal AND (
  (n.nspname = 'public' AND c.relname = 'user_profile' AND p.proname = 'enroll_student_in_path_courses')
  OR (n.nspname = 'auth' AND c.relname = 'users'
      AND (p.proname = 'handle_student_linking' OR t.tgname = 'on_auth_user_created')))
UNION ALL
SELECT format(
  CASE t.tgenabled
    WHEN 'D' THEN 'ALTER TABLE %I.%I DISABLE TRIGGER %I;'
    WHEN 'R' THEN 'ALTER TABLE %I.%I ENABLE REPLICA TRIGGER %I;'
    WHEN 'A' THEN 'ALTER TABLE %I.%I ENABLE ALWAYS TRIGGER %I;'
    ELSE 'ALTER TABLE %I.%I ENABLE TRIGGER %I;' END,
  n.nspname, c.relname, t.tgname)
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE NOT t.tgisinternal AND (
  (n.nspname = 'public' AND c.relname = 'user_profile' AND p.proname = 'enroll_student_in_path_courses')
  OR (n.nspname = 'auth' AND c.relname = 'users'
      AND (p.proname = 'handle_student_linking' OR t.tgname = 'on_auth_user_created')));

CREATE TEMP TABLE l_def AS
SELECT format(
  'ALTER DEFAULT PRIVILEGES FOR ROLE %I%s REVOKE ALL ON %s FROM %s;',
  pg_get_userbyid(s.defaclrole),
  CASE WHEN s.defaclnamespace = 0 THEN '' ELSE ' IN SCHEMA public' END,
  CASE s.defaclobjtype WHEN 'r' THEN 'TABLES' WHEN 'S' THEN 'SEQUENCES' WHEN 'f' THEN 'FUNCTIONS'
    WHEN 'T' THEN 'TYPES' WHEN 'n' THEN 'SCHEMAS' END,
  CASE WHEN s.grantee = 0 THEN 'PUBLIC' ELSE quote_ident(r.rolname) END) AS line
FROM (
  SELECT DISTINCT d.defaclrole, d.defaclnamespace, d.defaclobjtype, a.grantee
  FROM pg_default_acl d CROSS JOIN LATERAL aclexplode(d.defaclacl) a
  WHERE d.defaclnamespace = 0
     OR d.defaclnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
) s
LEFT JOIN pg_roles r ON r.oid = s.grantee AND s.grantee <> 0
UNION ALL
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
   OR d.defaclnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

CREATE TEMP TABLE content_fail (scope text, direction text, line text);

INSERT INTO content_fail SELECT 'policies', 'live_not_in_file', l.line FROM l_policies l
WHERE NOT EXISTS (SELECT 1 FROM f_policies f WHERE f.line = l.line);
INSERT INTO content_fail SELECT 'policies', 'file_not_in_live', f.line FROM f_policies f
WHERE NOT EXISTS (SELECT 1 FROM l_policies l WHERE l.line = f.line);

INSERT INTO content_fail SELECT 'rls', 'live_not_in_file', l.line FROM l_rls l
WHERE NOT EXISTS (SELECT 1 FROM f_rls f WHERE f.line = l.line);
INSERT INTO content_fail SELECT 'rls', 'file_not_in_live', f.line FROM f_rls f
WHERE NOT EXISTS (SELECT 1 FROM l_rls l WHERE l.line = f.line);

INSERT INTO content_fail SELECT 'table_grants', 'live_not_in_file', l.line FROM l_tbl l
WHERE NOT EXISTS (SELECT 1 FROM f_tbl f WHERE f.line = l.line);
INSERT INTO content_fail SELECT 'table_grants', 'file_not_in_live', f.line FROM f_tbl f
WHERE NOT EXISTS (SELECT 1 FROM l_tbl l WHERE l.line = f.line);

INSERT INTO content_fail SELECT 'column_grants', 'live_not_in_file', l.line FROM l_col l
WHERE NOT EXISTS (SELECT 1 FROM f_col f WHERE f.line = l.line);
INSERT INTO content_fail SELECT 'column_grants', 'file_not_in_live', f.line FROM f_col f
WHERE NOT EXISTS (SELECT 1 FROM l_col l WHERE l.line = f.line);

INSERT INTO content_fail SELECT 'function_content', 'live_not_in_file', l.line FROM l_fncontent l
WHERE NOT EXISTS (SELECT 1 FROM f_fncontent f WHERE f.line = l.line);
INSERT INTO content_fail SELECT 'function_content', 'file_not_in_live', f.line FROM f_fncontent f
WHERE NOT EXISTS (SELECT 1 FROM l_fncontent l WHERE l.line = f.line);

INSERT INTO content_fail SELECT 'function_acl', 'live_not_in_file', l.line FROM l_fnacl l
WHERE NOT EXISTS (SELECT 1 FROM f_fnacl f WHERE f.line = l.line);
INSERT INTO content_fail SELECT 'function_acl', 'file_not_in_live', f.line FROM f_fnacl f
WHERE NOT EXISTS (SELECT 1 FROM l_fnacl l WHERE l.line = f.line);

INSERT INTO content_fail SELECT 'triggers', 'live_not_in_file', l.line FROM l_trg l
WHERE NOT EXISTS (SELECT 1 FROM f_trg f WHERE f.line = l.line);
INSERT INTO content_fail SELECT 'triggers', 'file_not_in_live', f.line FROM f_trg f
WHERE NOT EXISTS (SELECT 1 FROM l_trg l WHERE l.line = f.line);

INSERT INTO content_fail SELECT 'default_privs', 'live_not_in_file', l.line FROM l_def l
WHERE NOT EXISTS (SELECT 1 FROM f_def f WHERE f.line = l.line);
INSERT INTO content_fail SELECT 'default_privs', 'file_not_in_live', f.line FROM f_def f
WHERE NOT EXISTS (SELECT 1 FROM l_def l WHERE l.line = f.line);

SELECT * FROM content_fail ORDER BY 1, 2;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM content_fail) THEN
    RAISE EXCEPTION 'FAIL: snapshot content does not match live catalog';
  END IF;
END
$$;

SELECT 1 AS content_integrity;
