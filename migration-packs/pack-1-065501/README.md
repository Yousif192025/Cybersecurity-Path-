# Migration Pack 1 — FINAL EXECUTION CANDIDATE — Revision 065501

**Status:** Prepared for local test only. Not production-approved.  
**Scope:** Phase 3 security hardening (P0 tables, trusted progress RPC, gates).  
**Open blockers (unchanged):** B-TRACK · B-FOLLOW-SEP · B-COURSE-AVAIL · M1

This directory materializes the desk-reviewed pack **065501** as executable files. No SQL from this pack has been run as part of packaging.

## Requirements (local Codespaces)

- PostgreSQL with database `cyberpath_test` (or equivalent local review DB)
- Roles: `anon`, `authenticated`, `service_role` (Supabase-like)
- `psql` with `\copy ... FROM PROGRAM` (client-side `grep`/`sed`)
- Working directory = this pack directory when running scripts (so `pack1_snapshots/` resolves)
- Optional for T-SMOKE: UUID with `user_profile` row + valid `lesson_id`; JWT GUC / `auth.uid()` (else M1)

**Do not** point these scripts at Supabase Production.

## Run order

```bash
cd migration-packs/pack-1-065501
mkdir -p pack1_snapshots

# 1) Capture pre-state into pack1_snapshots/
psql -v ON_ERROR_STOP=1 -d cyberpath_test -f 00_snapshot_all.sql

# 2) Content integrity: live catalog vs snapshot files
psql -v ON_ERROR_STOP=1 -d cyberpath_test -f 01_validate_snapshots.sql

# 3) UP + Gate in one transaction (failure => full ROLLBACK)
psql -v ON_ERROR_STOP=1 -d cyberpath_test -f 02_up_and_gate.sql

# 4) SET ROLE probes (expect permission denied; non-zero exit)
psql -v ON_ERROR_STOP=1 -d cyberpath_test -f 03b_setrole_anon.sql
psql -v ON_ERROR_STOP=1 -d cyberpath_test -f 03c_setrole_authenticated.sql

# 5) Smoke (self ROLLBACK)
psql -v ON_ERROR_STOP=1 -d cyberpath_test \
  -v test_uid="'<uuid-with-profile>'" \
  -v test_lesson="'<lesson-uuid>'" \
  -f 04_t_smoke.sql

# Rollback path (after successful UP, or if SET ROLE unexpectedly succeeds)
psql -v ON_ERROR_STOP=1 -d cyberpath_test -f 05_down.sql
psql -v ON_ERROR_STOP=1 -d cyberpath_test -f 06_verify_restored.sql
```

## Generated artifacts (by `00_snapshot_all.sql`)

| File | Role |
|------|------|
| `pack1_snapshots/pre_rls_state.sql` | ENABLE/DISABLE + FORCE/NO FORCE |
| `pack1_snapshots/pre_policies.sql` | CREATE POLICY statements |
| `pack1_snapshots/pre_grants_tables.sql` | REVOKE/GRANT table ACL (all grantees) |
| `pack1_snapshots/pre_grants_columns.sql` | Column GRANT lines |
| `pack1_snapshots/pre_function_defs.sql` | Multi-line function bodies + OWNER (DOWN restore) |
| `pack1_snapshots/pre_function_content.tsv` | One line per fn: `regprocedure\tmd5(def)\towner` (validation) |
| `pack1_snapshots/pre_grants_functions.sql` | Function ACL REVOKE/GRANT |
| `pack1_snapshots/pre_triggers.sql` | Trigger defs + tgenabled |
| `pack1_snapshots/pre_default_privileges.sql` | Full default-priv REVOKE then GRANT |

These files are **outputs**, not hand-edited inputs. Empty `pack1_snapshots/` before first `00` is expected.

## Rollback

1. If Gate fails inside `02_up_and_gate.sql`, the transaction rolls back; no durable UP changes.
2. After a committed UP: run `05_down.sql` then `06_verify_restored.sql` (reuses content checks from `01`).

## Pack scripts (committed)

| File | Purpose |
|------|---------|
| `00_snapshot_all.sql` | Snapshot generator |
| `01_validate_snapshots.sql` | Live ↔ file content match |
| `02_up_and_gate.sql` | UP + gates + COMMIT/ROLLBACK |
| `03b_setrole_anon.sql` | anon SELECT enrollments (expect deny) |
| `03c_setrole_authenticated.sql` | authenticated INSERT progress (expect deny) |
| `04_t_smoke.sql` | RPC smoke with ROLLBACK |
| `05_down.sql` | Restore from snapshots |
| `06_verify_restored.sql` | `\i 01_validate_snapshots.sql` |

## Notes

- `03b`/`03c` prove limited cases only, not a full write matrix.
- B-COURSE-AVAIL remains an open catalog-read risk by design in this pack.
- Host/port (e.g. `127.0.0.1:55432`) are environment-specific; set via `PGHOST`/`PGPORT` or `psql` flags.
