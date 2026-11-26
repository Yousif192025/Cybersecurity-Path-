-- =============================================================================
-- B1 partial undo helper — NOT a self-contained full rollback.
-- =============================================================================
-- Removes B1 policies, B1 RPCs, and client table grants on the four tables.
-- Does NOT auto-restore pre-B1 policies, table grants, column grants, or RLS.
--
-- For a complete return to pre-B1 ACL/policy state the operator must, after this
-- script, run saved outputs from 01_snapshot_b1.sql:
--   Section A (RLS + FORCE), B (policies with USING/WITH CHECK),
--   C (table grants), E (column grants).
-- Or restore a database backup taken before 02_up_b1.sql.
--
-- Limitation: if Section E was empty at snapshot time, column ACLs cannot be
-- reconstructed from the snapshot alone. Backup remains the authoritative path.
-- Does NOT touch: user_profile, get_my_role, academic triggers, or row data.
-- =============================================================================

BEGIN;

DROP POLICY IF EXISTS enrollments_select_own ON public.enrollments;
DROP POLICY IF EXISTS learning_progress_select_own ON public.learning_progress;
DROP POLICY IF EXISTS courses_select_public ON public.courses;
DROP POLICY IF EXISTS lessons_select_public ON public.lessons;

DROP FUNCTION IF EXISTS public.report_lesson_activity(uuid, numeric);
DROP FUNCTION IF EXISTS public.trust_set_lesson_progress(uuid, uuid, numeric);
DROP FUNCTION IF EXISTS public.enroll_self_in_course(uuid);

REVOKE ALL ON TABLE public.enrollments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.learning_progress FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.courses FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.lessons FROM PUBLIC, anon, authenticated;

COMMIT;

-- Manual next step for fuller ACL restore: paste Section A, B, C, E from snapshot.
