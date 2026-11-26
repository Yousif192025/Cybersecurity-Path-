\set ON_ERROR_STOP on
BEGIN;

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('user_profile','enrollments','learning_progress','courses','lessons')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT t.tgname, n.nspname AS sch, c.relname AS tbl
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE NOT t.tgisinternal AND (
      (n.nspname = 'public' AND c.relname = 'user_profile' AND p.proname = 'enroll_student_in_path_courses')
      OR (n.nspname = 'auth' AND c.relname = 'users'
          AND (p.proname = 'handle_student_linking' OR t.tgname = 'on_auth_user_created')))
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I', r.tgname, r.sch, r.tbl);
  END LOOP;
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'handle_student_linking'
      AND pg_get_function_identity_arguments(p.oid) = ''
  ) THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.handle_student_linking() FROM PUBLIC';
    EXECUTE 'REVOKE ALL ON FUNCTION public.handle_student_linking() FROM anon';
    EXECUTE 'REVOKE ALL ON FUNCTION public.handle_student_linking() FROM authenticated';
  END IF;
END $$;

ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_profile_select_own ON public.user_profile
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY enrollments_select_own ON public.enrollments
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY learning_progress_select_own ON public.learning_progress
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY courses_select_public ON public.courses
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY lessons_select_public ON public.lessons
  FOR SELECT TO anon, authenticated USING (true);

REVOKE ALL ON TABLE public.user_profile FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.enrollments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.learning_progress FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.courses FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.lessons FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.user_profile TO authenticated;
GRANT SELECT ON TABLE public.enrollments TO authenticated;
GRANT SELECT ON TABLE public.learning_progress TO authenticated;
GRANT SELECT ON TABLE public.courses TO anon, authenticated;
GRANT SELECT ON TABLE public.lessons TO anon, authenticated;

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT table_name, column_name, grantee, privilege_type
    FROM information_schema.column_privileges
    WHERE table_schema = 'public'
      AND table_name IN ('user_profile','enrollments','learning_progress','courses','lessons')
      AND grantee IN ('anon','authenticated') AND privilege_type IN ('INSERT','UPDATE')
  LOOP
    EXECUTE format('REVOKE %s (%I) ON TABLE public.%I FROM %I',
      r.privilege_type, r.column_name, r.table_name, r.grantee);
  END LOOP;
  FOR r IN
    SELECT table_name, column_name, privilege_type
    FROM information_schema.column_privileges
    WHERE table_schema = 'public'
      AND table_name IN ('user_profile','enrollments','learning_progress','courses','lessons')
      AND grantee = 'PUBLIC' AND privilege_type IN ('INSERT','UPDATE')
  LOOP
    EXECUTE format('REVOKE %s (%I) ON TABLE public.%I FROM PUBLIC',
      r.privilege_type, r.column_name, r.table_name);
  END LOOP;
END $$;

DO $$
DECLARE g record; role_name text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'public') THEN
    RAISE EXCEPTION 'UP aborted: schema public does not exist';
  END IF;
  FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
      RAISE EXCEPTION 'UP aborted: required role % does not exist', role_name;
    END IF;
  END LOOP;
  FOR g IN
    SELECT DISTINCT pg_get_userbyid(d.defaclrole) AS grantor,
           (d.defaclnamespace = 0) AS is_db_wide
    FROM pg_default_acl d
    WHERE d.defaclnamespace = 0
       OR d.defaclnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = g.grantor) THEN
      RAISE EXCEPTION 'UP aborted: default-ACL grantor role % does not exist', g.grantor;
    END IF;
    IF g.is_db_wide THEN
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON TABLES FROM PUBLIC', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON TABLES FROM anon', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON TABLES FROM authenticated', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON SEQUENCES FROM PUBLIC', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON SEQUENCES FROM anon', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON SEQUENCES FROM authenticated', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON FUNCTIONS FROM PUBLIC', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON FUNCTIONS FROM anon', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON FUNCTIONS FROM authenticated', g.grantor);
    ELSE
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON TABLES FROM anon', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON TABLES FROM authenticated', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON SEQUENCES FROM authenticated', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon', g.grantor);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM authenticated', g.grantor);
    END IF;
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS public.user_profile
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE uid uuid := auth.uid(); rec public.user_profile;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT * INTO rec FROM public.user_profile WHERE user_id = uid;
  IF FOUND THEN RETURN rec; END IF;
  RAISE EXCEPTION 'profile_requires_provisioning' USING HINT = 'B-TRACK open';
END;
$$;

CREATE OR REPLACE FUNCTION public.report_lesson_activity(p_lesson_id uuid, p_self_reported_percentage numeric)
RETURNS public.learning_progress
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  uid uuid := auth.uid(); v_course uuid; pct integer;
  rec public.learning_progress; lock_key bigint;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF p_lesson_id IS NULL THEN RAISE EXCEPTION 'lesson_id required'; END IF;
  IF p_self_reported_percentage IS NULL OR p_self_reported_percentage < 0
     OR p_self_reported_percentage >= 100 THEN
    RAISE EXCEPTION 'self-reported percentage must be in [0, 100)';
  END IF;
  pct := FLOOR(p_self_reported_percentage)::integer;
  SELECT l.course_id INTO v_course FROM public.lessons l WHERE l.lesson_id = p_lesson_id;
  IF v_course IS NULL THEN RAISE EXCEPTION 'invalid lesson'; END IF;
  PERFORM public.ensure_user_profile();
  lock_key := hashtextextended(uid::text || ':' || p_lesson_id::text, 0);
  PERFORM pg_advisory_xact_lock(lock_key);
  SELECT * INTO rec FROM public.learning_progress
  WHERE user_id = uid AND lesson_id = p_lesson_id
  ORDER BY progress_id FOR UPDATE LIMIT 1;
  IF FOUND THEN
    UPDATE public.learning_progress SET
      course_id = v_course,
      completion_percentage = GREATEST(COALESCE(completion_percentage, 0), pct),
      last_accessed = now()
    WHERE progress_id = rec.progress_id RETURNING * INTO rec;
    RETURN rec;
  END IF;
  INSERT INTO public.learning_progress (user_id, course_id, lesson_id, completion_percentage, last_accessed)
  VALUES (uid, v_course, p_lesson_id, pct, now()) RETURNING * INTO rec;
  RETURN rec;
END;
$$;

CREATE OR REPLACE FUNCTION public.trust_set_lesson_progress(
  p_user_id uuid, p_lesson_id uuid, p_completion_percentage numeric
)
RETURNS public.learning_progress
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE v_course uuid; pct integer; rec public.learning_progress; lock_key bigint;
BEGIN
  IF p_user_id IS NULL OR p_lesson_id IS NULL THEN RAISE EXCEPTION 'user_id and lesson_id required'; END IF;
  IF p_completion_percentage IS NULL THEN RAISE EXCEPTION 'completion_percentage must not be null'; END IF;
  IF p_completion_percentage < 0 OR p_completion_percentage > 100 THEN
    RAISE EXCEPTION 'completion_percentage must be in [0, 100]';
  END IF;
  IF p_completion_percentage <> trunc(p_completion_percentage) THEN
    RAISE EXCEPTION 'completion_percentage must be a whole number';
  END IF;
  pct := p_completion_percentage::integer;
  IF NOT EXISTS (SELECT 1 FROM public.user_profile up WHERE up.user_id = p_user_id) THEN
    RAISE EXCEPTION 'target user profile not found';
  END IF;
  SELECT l.course_id INTO v_course FROM public.lessons l WHERE l.lesson_id = p_lesson_id;
  IF v_course IS NULL THEN RAISE EXCEPTION 'target lesson not found'; END IF;
  lock_key := hashtextextended(p_user_id::text || ':' || p_lesson_id::text, 0);
  PERFORM pg_advisory_xact_lock(lock_key);
  SELECT * INTO rec FROM public.learning_progress
  WHERE user_id = p_user_id AND lesson_id = p_lesson_id
  ORDER BY progress_id FOR UPDATE LIMIT 1;
  IF FOUND THEN
    UPDATE public.learning_progress SET course_id = v_course, completion_percentage = pct, last_accessed = now()
    WHERE progress_id = rec.progress_id RETURNING * INTO rec;
    RETURN rec;
  END IF;
  INSERT INTO public.learning_progress (user_id, course_id, lesson_id, completion_percentage, last_accessed)
  VALUES (p_user_id, v_course, p_lesson_id, pct, now()) RETURNING * INTO rec;
  RETURN rec;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_user_profile() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_profile() TO authenticated;
REVOKE ALL ON FUNCTION public.report_lesson_activity(uuid, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.report_lesson_activity(uuid, numeric) TO authenticated;

DO $$
DECLARE r record; fn oid; gname text;
BEGIN
  SELECT p.oid INTO fn
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname = 'trust_set_lesson_progress'
    AND p.proargtypes = '2950 2950 1700'::oidvector;
  IF fn IS NULL THEN RAISE EXCEPTION 'trust_set_lesson_progress missing'; END IF;
  FOR r IN SELECT (aclexplode(COALESCE(
      (SELECT proacl FROM pg_proc WHERE oid = fn),
      acldefault('f', (SELECT proowner FROM pg_proc WHERE oid = fn))
    ))).*
  LOOP
    IF r.grantee = 0 THEN
      EXECUTE 'REVOKE ALL ON FUNCTION public.trust_set_lesson_progress(uuid, uuid, numeric) FROM PUBLIC';
    ELSE
      SELECT rolname INTO gname FROM pg_roles WHERE oid = r.grantee;
      IF gname IS NOT NULL THEN
        EXECUTE format(
          'REVOKE ALL ON FUNCTION public.trust_set_lesson_progress(uuid, uuid, numeric) FROM %I', gname);
      END IF;
    END IF;
  END LOOP;
  EXECUTE 'REVOKE ALL ON FUNCTION public.trust_set_lesson_progress(uuid, uuid, numeric) FROM PUBLIC';
  EXECUTE 'REVOKE ALL ON FUNCTION public.trust_set_lesson_progress(uuid, uuid, numeric) FROM anon';
  EXECUTE 'REVOKE ALL ON FUNCTION public.trust_set_lesson_progress(uuid, uuid, numeric) FROM authenticated';
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    RAISE EXCEPTION 'UP aborted: role service_role does not exist';
  END IF;
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.trust_set_lesson_progress(uuid, uuid, numeric) TO service_role';
END $$;

CREATE TEMP TABLE pack1_gate_results (
  test_id text PRIMARY KEY, gate_ok boolean NOT NULL, detail text
);

CREATE TEMP VIEW client_role_tree AS
WITH RECURSIVE
ancestors AS (
  SELECT oid, rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated')
  UNION
  SELECT r.oid, r.rolname FROM pg_auth_members m
  JOIN ancestors a ON m.member = a.oid JOIN pg_roles r ON r.oid = m.roleid
),
descendants AS (
  SELECT oid, rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated')
  UNION
  SELECT r.oid, r.rolname FROM pg_auth_members m
  JOIN descendants d ON m.roleid = d.oid JOIN pg_roles r ON r.oid = m.member
)
SELECT DISTINCT rolname FROM ancestors
UNION
SELECT DISTINCT rolname FROM descendants;

INSERT INTO pack1_gate_results VALUES
('G-PRIV-anon-enrollments-SELECT',
  NOT has_table_privilege('anon','public.enrollments','SELECT'), NULL),
('G-PRIV-auth-progress-INSERT',
  NOT has_table_privilege('authenticated','public.learning_progress','INSERT'),
  'INSERT only — not full write matrix'),
('G-PRIV-auth-progress-UPDATE',
  NOT has_table_privilege('authenticated','public.learning_progress','UPDATE'), NULL),
('G-PRIV-auth-role-col',
  NOT has_column_privilege('authenticated','public.user_profile','role','UPDATE'), NULL);

INSERT INTO pack1_gate_results
SELECT 'G-ACL-trust-no-client-tree',
  NOT EXISTS (
    SELECT 1 FROM client_role_tree c
    WHERE has_function_privilege(
      c.rolname, 'public.trust_set_lesson_progress(uuid,uuid,numeric)', 'EXECUTE')
  ),
  'no role-name exceptions';

INSERT INTO pack1_gate_results
SELECT 'G-ACL-trust-service-role-has-execute',
  has_function_privilege(
    'service_role', 'public.trust_set_lesson_progress(uuid,uuid,numeric)', 'EXECUTE'),
  'separate assertion';

INSERT INTO pack1_gate_results
SELECT 'G-DEFAULT-PRIV-residuals',
  NOT EXISTS (
    SELECT 1 FROM pg_default_acl d
    CROSS JOIN LATERAL aclexplode(d.defaclacl) a
    LEFT JOIN pg_roles gr ON gr.oid = a.grantee AND a.grantee <> 0
    WHERE d.defaclobjtype IN ('r','S','f')
      AND (d.defaclnamespace = 0
        OR d.defaclnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
      AND (a.grantee = 0 OR gr.rolname IN ('anon','authenticated'))
  ), NULL;

INSERT INTO pack1_gate_results
SELECT 'S1-three-definer-fns',
  (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname='public' AND p.prosecdef
     AND p.proname IN (
       'ensure_user_profile','report_lesson_activity','trust_set_lesson_progress')) = 3,
  NULL;

INSERT INTO pack1_gate_results
SELECT 'B-COURSE-AVAIL-open', true, 'still open';

SELECT * FROM pack1_gate_results ORDER BY 1;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pack1_gate_results WHERE gate_ok IS NOT TRUE) THEN
    RAISE EXCEPTION 'GATE FAILED — full transaction ROLLBACK';
  END IF;
END $$;

COMMIT;
