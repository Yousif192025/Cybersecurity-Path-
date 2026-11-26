\set ON_ERROR_STOP on
BEGIN;

DROP POLICY IF EXISTS user_profile_select_own ON public.user_profile;
DROP POLICY IF EXISTS enrollments_select_own ON public.enrollments;
DROP POLICY IF EXISTS learning_progress_select_own ON public.learning_progress;
DROP POLICY IF EXISTS courses_select_public ON public.courses;
DROP POLICY IF EXISTS lessons_select_public ON public.lessons;

DROP FUNCTION IF EXISTS public.report_lesson_activity(uuid, numeric);
DROP FUNCTION IF EXISTS public.trust_set_lesson_progress(uuid, uuid, numeric);
DROP FUNCTION IF EXISTS public.ensure_user_profile();

\i pack1_snapshots/pre_function_defs.sql
\i pack1_snapshots/pre_grants_functions.sql
DROP TRIGGER IF EXISTS trigger_enroll_on_new_profile ON public.user_profile;
\i pack1_snapshots/pre_triggers.sql
\i pack1_snapshots/pre_rls_state.sql
DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('enrollments', 'user_profile')
  LOOP
    EXECUTE format(
      'DROP POLICY %I ON %I.%I',
      p.policyname, p.schemaname, p.tablename
    );
  END LOOP;
END
$$;

\i pack1_snapshots/pre_policies.sql

-- Remove grants introduced by UP before restoring snapshot ACLs.
REVOKE ALL ON TABLE public.user_profile FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.enrollments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.learning_progress FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.courses FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.lessons FROM PUBLIC, anon, authenticated;

\i pack1_snapshots/pre_grants_tables.sql
\i pack1_snapshots/pre_grants_columns.sql
\i pack1_snapshots/pre_default_privileges.sql

COMMIT;
