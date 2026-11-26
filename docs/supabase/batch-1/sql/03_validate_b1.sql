-- B1 validation — after UP

SELECT 'priv_anon_enrollments_select' AS test,
  NOT has_table_privilege('anon','public.enrollments','SELECT') AS pass;

SELECT 'priv_auth_enrollments_insert' AS test,
  NOT has_table_privilege('authenticated','public.enrollments','INSERT') AS pass;

SELECT 'priv_auth_progress_insert' AS test,
  NOT has_table_privilege('authenticated','public.learning_progress','INSERT') AS pass;

SELECT 'priv_auth_progress_update' AS test,
  NOT has_table_privilege('authenticated','public.learning_progress','UPDATE') AS pass;

SELECT 'priv_anon_courses_select' AS test,
  has_table_privilege('anon','public.courses','SELECT') AS pass;

SELECT 'priv_anon_lessons_select' AS test,
  has_table_privilege('anon','public.lessons','SELECT') AS pass;

SELECT 'fn_report_auth_exec' AS test,
  has_function_privilege('authenticated','public.report_lesson_activity(uuid,numeric)','EXECUTE') AS pass;

SELECT 'fn_enroll_self_auth_exec' AS test,
  has_function_privilege('authenticated','public.enroll_self_in_course(uuid)','EXECUTE') AS pass;

SELECT 'fn_trust_auth_no_exec' AS test,
  NOT has_function_privilege('authenticated','public.trust_set_lesson_progress(uuid,uuid,numeric)','EXECUTE') AS pass;

SELECT 'fn_trust_service_exec' AS test,
  has_function_privilege('service_role','public.trust_set_lesson_progress(uuid,uuid,numeric)','EXECUTE') AS pass;

SELECT 'fn_get_my_role_intact' AS test,
  EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'get_my_role' AND p.prosecdef
  ) AS pass;

SELECT 'rls_enabled_b1_tables' AS test,
  (SELECT count(*) FROM pg_class c
   JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public'
     AND c.relname IN ('enrollments','learning_progress','courses','lessons')
     AND c.relrowsecurity) = 4 AS pass;

-- Column-level ACL checks (table-level checks above do not cover these).

SELECT 'priv_anon_no_column_select_enrollments' AS test,
  NOT EXISTS (
    SELECT 1
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'enrollments'
      AND a.attnum > 0
      AND NOT a.attisdropped
      AND has_column_privilege(
        'anon', format('%I.%I', n.nspname, c.relname),
        a.attname, 'SELECT'
      )
  ) AS pass;

SELECT 'priv_anon_no_column_select_learning_progress' AS test,
  NOT EXISTS (
    SELECT 1
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'learning_progress'
      AND a.attnum > 0
      AND NOT a.attisdropped
      AND has_column_privilege(
        'anon', format('%I.%I', n.nspname, c.relname),
        a.attname, 'SELECT'
      )
  ) AS pass;

SELECT 'priv_no_column_writes_b1_tables' AS test,
  NOT EXISTS (
    SELECT 1
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    CROSS JOIN (VALUES ('anon'), ('authenticated')) AS grantee(role_name)
    WHERE n.nspname = 'public'
      AND c.relname IN (
        'enrollments', 'learning_progress', 'courses', 'lessons'
      )
      AND a.attnum > 0
      AND NOT a.attisdropped
      AND (
        has_column_privilege(grantee.role_name,
          format('%I.%I', n.nspname, c.relname), a.attname, 'INSERT')
        OR has_column_privilege(grantee.role_name,
          format('%I.%I', n.nspname, c.relname), a.attname, 'UPDATE')
        OR has_column_privilege(grantee.role_name,
          format('%I.%I', n.nspname, c.relname), a.attname, 'DELETE')
      )
  ) AS pass;

-- Triggers on user_profile for enroll_student_in_path_courses must still exist if they did pre-B1
-- (informational count; does not fail package if zero — environment dependent)
SELECT 'info_enroll_triggers_on_profile' AS test,
  count(*) AS trigger_count
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE NOT t.tgisinternal
  AND n.nspname = 'public'
  AND c.relname = 'user_profile'
  AND p.proname = 'enroll_student_in_path_courses';
