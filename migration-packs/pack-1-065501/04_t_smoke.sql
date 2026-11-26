\set ON_ERROR_STOP on
BEGIN;
SELECT set_config('request.jwt.claim.sub', trim(both '''' from :'test_uid'), true);
SELECT set_config('request.jwt.claim.role', 'authenticated', true);
SELECT set_config('pack1.test_lesson', trim(both '''' from :'test_lesson'), true);
SET ROLE authenticated;
DO $$
DECLARE u uuid; lesson uuid; rec public.learning_progress;
BEGIN
  u := auth.uid();
  IF u IS NULL THEN RAISE EXCEPTION 'T-SMOKE fail: auth.uid() null (M1)'; END IF;
  IF u::text IS DISTINCT FROM current_setting('request.jwt.claim.sub', true) THEN
    RAISE EXCEPTION 'T-SMOKE fail: auth.uid() mismatch';
  END IF;
  lesson := current_setting('pack1.test_lesson', true)::uuid;
  rec := public.report_lesson_activity(lesson, 10.9);
  IF rec.completion_percentage IS DISTINCT FROM 10 THEN
    RAISE EXCEPTION 'T-SMOKE fail: expected 10 got %', rec.completion_percentage;
  END IF;
  IF rec.user_id IS DISTINCT FROM u THEN
    RAISE EXCEPTION 'T-SMOKE fail: user_id mismatch';
  END IF;
  BEGIN
    PERFORM public.report_lesson_activity(lesson, 100);
    RAISE EXCEPTION 'T-SMOKE fail: expected rejection of 100';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%self-reported percentage must be in [0, 100)%' THEN
      RAISE EXCEPTION 'T-SMOKE fail: unexpected on 100: % (%)', SQLERRM, SQLSTATE;
    END IF;
  END;
  BEGIN
    PERFORM public.trust_set_lesson_progress(u, lesson, 100);
    RAISE EXCEPTION 'T-SMOKE fail: trust_set should be denied';
  EXCEPTION
    WHEN insufficient_privilege THEN NULL;
    WHEN OTHERS THEN
      IF SQLSTATE <> '42501' THEN
        RAISE EXCEPTION 'T-SMOKE fail: unexpected on trust_set: % (%)', SQLERRM, SQLSTATE;
      END IF;
  END;
END $$;
RESET ROLE;
ROLLBACK;
\echo T-SMOKE passed with ROLLBACK
