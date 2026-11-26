-- ============================================================================
-- CyberPath Gate C — reviewed replacement blocks
-- IMPORTANT: Draft only. NOT executed. Do not run against Production.
-- Apply only in an isolated non-production test database after schema review.
-- ============================================================================

-- --------------------------------------------------------------------------
-- C05_UP.sql: replace the existing sections 6, 6b, and 6c with this block.
-- This fixes the PUBLIC pseudo-role quoting issue and checks effective
-- privileges through anon/authenticated (which inherit PUBLIC privileges).
-- --------------------------------------------------------------------------

-- 6) Revoke explicit column-level privileges from PUBLIC, anon, authenticated.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT DISTINCT table_name, column_name, grantee, privilege_type
    FROM information_schema.column_privileges
    WHERE table_schema = 'public'
      AND table_name IN
        ('user_profile','enrollments','learning_progress','courses','lessons')
      AND grantee IN ('PUBLIC','anon','authenticated')
      AND privilege_type IN ('SELECT','INSERT','UPDATE','DELETE','REFERENCES')
  LOOP
    IF r.grantee = 'PUBLIC' THEN
      EXECUTE format(
        'REVOKE %s (%I) ON TABLE public.%I FROM PUBLIC',
        r.privilege_type, r.column_name, r.table_name
      );
    ELSE
      EXECUTE format(
        'REVOKE %s (%I) ON TABLE public.%I FROM %I',
        r.privilege_type, r.column_name, r.table_name, r.grantee
      );
    END IF;
  END LOOP;
END $$;

-- 6b) Re-apply only the intended table-level SELECT grants.
GRANT SELECT ON TABLE public.user_profile TO authenticated;
GRANT SELECT ON TABLE public.enrollments TO authenticated;
GRANT SELECT ON TABLE public.learning_progress TO authenticated;
GRANT SELECT ON TABLE public.courses TO anon, authenticated;
GRANT SELECT ON TABLE public.lessons TO anon, authenticated;

-- 6c) Strict ACL and effective-privilege assertions.
-- PUBLIC is checked by inspecting ACL entries with grantee OID 0.
-- Effective privileges for PUBLIC inheritance and role memberships are
-- checked through anon/authenticated using has_*_privilege().
DO $$
DECLARE
  t record;
  c record;
  v_has_service_role boolean;
BEGIN
  v_has_service_role :=
    EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role');

  IF NOT v_has_service_role THEN
    RAISE EXCEPTION
      'C05 assertion failed: required Supabase role service_role is missing';
  END IF;

  FOR t IN
    SELECT c.oid, c.relname, c.relowner, c.relacl
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname IN
        ('user_profile','enrollments','learning_progress','courses','lessons')
      AND c.relkind IN ('r','p')
    ORDER BY c.relname
  LOOP
    -- Explicit PUBLIC table ACL entries must not grant these privileges.
    IF EXISTS (
      SELECT 1
      FROM aclexplode(COALESCE(t.relacl, acldefault('r', t.relowner))) x
      WHERE x.grantee = 0
        AND x.privilege_type IN
          ('SELECT','INSERT','UPDATE','DELETE','REFERENCES','TRUNCATE','TRIGGER','MAINTAIN')
    ) THEN
      RAISE EXCEPTION
        'C05 assertion failed: PUBLIC has a table ACL grant on %', t.relname;
    END IF;

    -- Effective anon privileges: SELECT only for courses/lessons; no writes.
    IF has_table_privilege('anon', t.oid, 'INSERT')
       OR has_table_privilege('anon', t.oid, 'UPDATE')
       OR has_table_privilege('anon', t.oid, 'DELETE')
       OR has_table_privilege('anon', t.oid, 'TRUNCATE')
       OR has_table_privilege('anon', t.oid, 'REFERENCES')
       OR has_table_privilege('anon', t.oid, 'TRIGGER')
       OR has_table_privilege('anon', t.oid, 'MAINTAIN') THEN
      RAISE EXCEPTION
        'C05 assertion failed: anon has write privilege on %', t.relname;
    END IF;

    IF t.relname IN ('courses','lessons') THEN
      IF NOT has_table_privilege('anon', t.oid, 'SELECT') THEN
        RAISE EXCEPTION
          'C05 assertion failed: anon lacks SELECT on %', t.relname;
      END IF;
    ELSIF has_table_privilege('anon', t.oid, 'SELECT') THEN
      RAISE EXCEPTION
        'C05 assertion failed: anon unexpectedly has SELECT on %', t.relname;
    END IF;

    -- Effective authenticated privileges: SELECT only.
    IF NOT has_table_privilege('authenticated', t.oid, 'SELECT') THEN
      RAISE EXCEPTION
        'C05 assertion failed: authenticated lacks SELECT on %', t.relname;
    END IF;

    IF has_table_privilege('authenticated', t.oid, 'INSERT')
       OR has_table_privilege('authenticated', t.oid, 'UPDATE')
       OR has_table_privilege('authenticated', t.oid, 'DELETE')
       OR has_table_privilege('authenticated', t.oid, 'TRUNCATE')
       OR has_table_privilege('authenticated', t.oid, 'REFERENCES')
       OR has_table_privilege('authenticated', t.oid, 'TRIGGER')
       OR has_table_privilege('authenticated', t.oid, 'MAINTAIN') THEN
      RAISE EXCEPTION
        'C05 assertion failed: authenticated has write privilege on %', t.relname;
    END IF;

    -- service_role must have the explicitly approved backend DML privileges.
    IF NOT (
      has_table_privilege('service_role', t.oid, 'SELECT')
      AND has_table_privilege('service_role', t.oid, 'INSERT')
      AND has_table_privilege('service_role', t.oid, 'UPDATE')
      AND has_table_privilege('service_role', t.oid, 'DELETE')
    ) THEN
      RAISE EXCEPTION
        'C05 assertion failed: service_role lacks approved DML on %', t.relname;
    END IF;

    -- Explicit PUBLIC column ACL entries must not grant table data privileges.
    FOR c IN
      SELECT a.attname, a.attacl
      FROM pg_attribute a
      WHERE a.attrelid = t.oid
        AND a.attnum > 0
        AND NOT a.attisdropped
    LOOP
      IF EXISTS (
        SELECT 1
        FROM aclexplode(COALESCE(c.attacl, '{}'::aclitem[])) x
        WHERE x.grantee = 0
          AND x.privilege_type IN ('SELECT','INSERT','UPDATE','REFERENCES')
      ) THEN
        RAISE EXCEPTION
          'C05 assertion failed: PUBLIC has a column ACL grant on %.%',
          t.relname, c.attname;
      END IF;

      IF has_column_privilege('anon', t.oid, c.attname, 'INSERT')
         OR has_column_privilege('anon', t.oid, c.attname, 'UPDATE')
         OR has_column_privilege('anon', t.oid, c.attname, 'REFERENCES')
         OR (t.relname NOT IN ('courses','lessons')
             AND has_column_privilege('anon', t.oid, c.attname, 'SELECT')) THEN
        RAISE EXCEPTION
          'C05 assertion failed: anon has disallowed column privilege on %.%',
          t.relname, c.attname;
      END IF;

      IF has_column_privilege('authenticated', t.oid, c.attname, 'INSERT')
         OR has_column_privilege('authenticated', t.oid, c.attname, 'UPDATE')
         OR has_column_privilege('authenticated', t.oid, c.attname, 'REFERENCES') THEN
        RAISE EXCEPTION
          'C05 assertion failed: authenticated has disallowed column privilege on %.%',
          t.relname, c.attname;
      END IF;
    END LOOP;
  END LOOP;
END $$;


-- --------------------------------------------------------------------------
-- C07_VALIDATION.sql — one coherent rollback-only test harness.
-- Prerequisites:
--   * Run ONLY in an isolated non-production test DB.
--   * Apply the proposed Gate C UP in that isolated DB first.
--   * The test DB must contain at least one lesson with a non-NULL course_id.
--   * The known schema contract must include auth.users(id,email), user_profile
--     (user_id, role, track, student_type), enrollments(user_id,course_id), and
--     learning_progress(user_id,course_id,lesson_id,completion_percentage).
--   * If the actual test schema differs, stop and adapt fixtures from its
--     catalog; do not guess columns or run this against Production.
-- All fixture writes and progress changes are rolled back at the end.
-- --------------------------------------------------------------------------

BEGIN;

DO $$
DECLARE
  v_runner_role text := current_user;
  v_uid_a uuid := '11111111-1111-4111-8111-111111111111';
  v_uid_b uuid := '22222222-2222-4222-8222-222222222222';
  v_lesson uuid;
  v_course uuid;
  v_count bigint;
  v_denied boolean;
  v_table text;
  v_role_before text;
  v_role_after text;
  v_pct integer;
  v_progress public.learning_progress%ROWTYPE;
BEGIN
  -- Refuse to overwrite any pre-existing test identities.
  IF EXISTS (SELECT 1 FROM auth.users WHERE id IN (v_uid_a, v_uid_b))
     OR EXISTS (SELECT 1 FROM public.user_profile
                WHERE user_id IN (v_uid_a, v_uid_b))
     OR EXISTS (SELECT 1 FROM public.enrollments
                WHERE user_id IN (v_uid_a, v_uid_b))
     OR EXISTS (SELECT 1 FROM public.learning_progress
                WHERE user_id IN (v_uid_a, v_uid_b)) THEN
    RAISE EXCEPTION
      'C07 fixture collision: remove or choose new synthetic UUIDs in the isolated test DB';
  END IF;

  SELECT l.lesson_id, l.course_id
    INTO v_lesson, v_course
  FROM public.lessons l
  WHERE l.lesson_id IS NOT NULL
    AND l.course_id IS NOT NULL
  ORDER BY l.lesson_id
  LIMIT 1;

  IF v_lesson IS NULL OR v_course IS NULL THEN
    RAISE EXCEPTION
      'C07 setup failed: isolated test DB needs a lesson linked to a course';
  END IF;

  -- Seed minimal Auth identities, then valid profile rows.
  INSERT INTO auth.users (id, email)
  VALUES
    (v_uid_a, 'gate-c-user-a@example.invalid'),
    (v_uid_b, 'gate-c-user-b@example.invalid');

  INSERT INTO public.user_profile (user_id, role, track, student_type)
  VALUES
    (v_uid_a, 'guest', 'Cybersecurity', 'skill_dev'),
    (v_uid_b, 'guest', 'Cybersecurity', 'skill_dev'),
    (NULL,    'guest', 'Cybersecurity', 'skill_dev');

  INSERT INTO public.enrollments (user_id, course_id)
  VALUES (v_uid_a, v_course), (v_uid_b, v_course);

  INSERT INTO public.learning_progress
    (user_id, course_id, lesson_id, completion_percentage)
  VALUES
    (v_uid_a, v_course, v_lesson, 20),
    (v_uid_b, v_course, v_lesson, 80);

  -- Prove fixture creation before any RLS assertions.
  IF (SELECT count(*) FROM public.user_profile WHERE user_id = v_uid_a) <> 1
     OR (SELECT count(*) FROM public.user_profile WHERE user_id = v_uid_b) <> 1
     OR (SELECT count(*) FROM public.user_profile WHERE user_id IS NULL) < 1
     OR (SELECT count(*) FROM public.enrollments WHERE user_id = v_uid_a) < 1
     OR (SELECT count(*) FROM public.enrollments WHERE user_id = v_uid_b) < 1
     OR (SELECT count(*) FROM public.learning_progress WHERE user_id = v_uid_a) < 1
     OR (SELECT count(*) FROM public.learning_progress WHERE user_id = v_uid_b) < 1 THEN
    RAISE EXCEPTION 'C07 setup failed: one or more synthetic fixture rows are missing';
  END IF;

  -- A1: anon can execute SELECT on the public catalog.
  PERFORM set_config('role', 'anon', true);
  EXECUTE 'SELECT count(*) FROM public.courses' INTO v_count;
  EXECUTE 'SELECT count(*) FROM public.lessons' INTO v_count;
  PERFORM set_config('role', v_runner_role, true);

  -- A2: each restricted table is tested independently. A permission error
  -- is accepted; otherwise the query must return zero visible rows.
  FOREACH v_table IN ARRAY
    ARRAY['user_profile','enrollments','learning_progress']
  LOOP
    v_denied := false;
    v_count := NULL;

    BEGIN
      PERFORM set_config('role', 'anon', true);
      EXECUTE format('SELECT count(*) FROM public.%I', v_table)
        INTO v_count;
    EXCEPTION
      WHEN insufficient_privilege THEN
        v_denied := true;
    END;

    PERFORM set_config('role', v_runner_role, true);

    IF NOT v_denied AND COALESCE(v_count, 0) <> 0 THEN
      RAISE EXCEPTION
        'A2 failed: anon could see % rows in public.%', v_count, v_table;
    END IF;
  END LOOP;

  -- Set User A JWT context and test row isolation.
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', v_uid_a::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  IF (SELECT count(*) FROM public.user_profile WHERE user_id = v_uid_a) <> 1
     OR (SELECT count(*) FROM public.user_profile WHERE user_id = v_uid_b) <> 0
     OR (SELECT count(*) FROM public.user_profile WHERE user_id IS NULL) <> 0
     OR (SELECT count(*) FROM public.enrollments WHERE user_id = v_uid_a) < 1
     OR (SELECT count(*) FROM public.enrollments WHERE user_id = v_uid_b) <> 0
     OR (SELECT count(*) FROM public.learning_progress WHERE user_id = v_uid_a) < 1
     OR (SELECT count(*) FROM public.learning_progress WHERE user_id = v_uid_b) <> 0 THEN
    RAISE EXCEPTION
      'A3 failed: own-row visibility or cross-user/NULL isolation is incorrect';
  END IF;

  -- A4: direct role escalation must be denied or ineffective.
  SELECT role::text INTO v_role_before
  FROM public.user_profile WHERE user_id = v_uid_a;

  v_denied := false;
  BEGIN
    UPDATE public.user_profile
       SET role = 'admin'
     WHERE user_id = v_uid_a;
  EXCEPTION
    WHEN insufficient_privilege THEN
      v_denied := true;
  END;

  PERFORM set_config('role', v_runner_role, true);
  SELECT role::text INTO v_role_after
  FROM public.user_profile WHERE user_id = v_uid_a;

  IF NOT v_denied
     OR v_role_after IS DISTINCT FROM v_role_before
     OR v_role_after = 'admin' THEN
    RAISE EXCEPTION
      'A4 failed: direct role change occurred (before %, after %)',
      v_role_before, v_role_after;
  END IF;

  -- A5: authenticated RPCs must work for a pre-provisioned User A.
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', v_uid_a::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  PERFORM public.ensure_user_profile();
  PERFORM public.report_lesson_activity(v_lesson, 45.5);

  PERFORM set_config('role', v_runner_role, true);
  SELECT count(*), min(completion_percentage)
    INTO v_count, v_pct
  FROM public.learning_progress
  WHERE user_id = v_uid_a AND lesson_id = v_lesson;

  IF v_count <> 1 OR v_pct IS DISTINCT FROM 45 THEN
    RAISE EXCEPTION
      'A5 failed: expected self-reported progress 45 after FLOOR(45.5), got %',
      v_pct;
  END IF;

  -- A6: self-reported 100 must be rejected with the intended validation error.
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', v_uid_a::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  v_denied := false;
  BEGIN
    PERFORM public.report_lesson_activity(v_lesson, 100);
  EXCEPTION
    WHEN OTHERS THEN
      IF SQLERRM = 'self-reported percentage must be in [0, 100)' THEN
        v_denied := true;
      ELSE
        RAISE;
      END IF;
  END;

  IF NOT v_denied THEN
    RAISE EXCEPTION 'A6 failed: report_lesson_activity accepted 100';
  END IF;

  -- A7: authenticated must not execute the trusted completion RPC.
  v_denied := false;
  BEGIN
    PERFORM public.trust_set_lesson_progress(v_uid_a, v_lesson, 100);
  EXCEPTION
    WHEN insufficient_privilege THEN
      v_denied := true;
  END;

  IF NOT v_denied THEN
    RAISE EXCEPTION
      'A7 failed: authenticated executed trust_set_lesson_progress';
  END IF;

  -- A8: service_role can execute the trusted completion RPC.
  -- Restore the original runner role before attempting the privileged role.
  PERFORM set_config('role', v_runner_role, true);

  -- Fail explicitly if the test runner cannot assume this database role.
  BEGIN
    PERFORM set_config('role', 'service_role', true);
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE EXCEPTION
        'A8 setup failed: test runner cannot assume service_role; run only in an isolated test DB with an authorized runner';
  END;

  SELECT * INTO v_progress
  FROM public.trust_set_lesson_progress(v_uid_a, v_lesson, 100);

  PERFORM set_config('role', v_runner_role, true);

  IF v_progress.user_id IS DISTINCT FROM v_uid_a
     OR v_progress.lesson_id IS DISTINCT FROM v_lesson
     OR v_progress.completion_percentage IS DISTINCT FROM 100 THEN
    RAISE EXCEPTION
      'A8 failed: service_role trusted completion result is incorrect';
  END IF;

  RAISE NOTICE
    'C07 passed in isolated test transaction; all fixtures and progress changes will be rolled back';
END
$$;

ROLLBACK;

-- Manual checks still required outside this SQL harness:
-- 1. PostgREST requests using real anon, User A, and User B JWTs in staging.
-- 2. Confirm lab progress remains separate from public.learning_progress.
-- 3. Verify academic linking cannot be triggered by email/national_id alone.
-- 4. Verify default-privilege ownership and remediation separately (B1).
-- 5. Verify server-side service_role credential path; never expose it to browser.
-- 6. Complete and evidence C06 rollback/restore drill before any Production apply.
