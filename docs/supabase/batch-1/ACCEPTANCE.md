# B1 Acceptance (corrected package)

## Scope of this package
- SQL for B1 tables + progress/enroll RPCs only.
- **Does not modify application source files.** Files under `app-patches/` are optional examples for developers; they are not applied by running SQL.
- Does not change B0 (`user_profile`, `get_my_role`).
- Does not drop academic enrollment triggers.
- Does not delete historical `learning_progress` rows.

## enroll_self_in_course availability condition
- Caller must be authenticated (`auth.uid()` present).
- `p_course_id` must exist in `public.courses`.
- No publish-flag check (no proven column required).
- No extra client table privileges: EXECUTE on the RPC only.

## Apply order (owner)
1. `00_preflight.sql` in Supabase SQL Editor
2. `01_snapshot_b1.sql` — save each result set
3. Approval
4. `02_up_b1.sql`
5. `03_validate_b1.sql`

## Rollback honesty
`04_rollback_b1.sql` is a **partial undo helper**, not a complete self-contained rollback.
Full ACL/policy restore needs saved snapshot sections **A, B, C, and E** (column grants) or a DB backup.
Without Section E output, column privileges are a **known restore gap**.

## Not executed / not tested against live DB by the packaging agent
