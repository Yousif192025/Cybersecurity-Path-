# C01 — Production Remediation Plan

**Project:** CyberPath  
**Gate:** C — Production Remediation Readiness  
**Status:** NOT READY FOR PRODUCTION EXECUTION  
**Document type:** Planning and governance only  
**Date:** 2026-11-24

---

## 1. Purpose

This document defines the controlled remediation plan for the previously identified
Production database security issues.

It does not authorize or perform any Production database operation.

Gate C separates:
- remediation design;
- isolated test validation;
- rollback readiness;
- explicit Production execution approval.

Passing a design review is not equivalent to passing execution readiness.

## 2. Governing decisions

This plan must preserve the approved Architecture Decisions AD-01 through AD-13.

In particular:

- Public learning content remains accessible without mandatory registration.
- `/` remains the public front door.
- `/academy/` remains the identity and education center.
- Identity, subscription, and entitlements remain separate concepts.
- Academic identity linking requires independent secure verification.
- `learning_progress` is for course and lesson progress only.
- Lab progress remains separate from course progress.
- Guest/local progress is untrusted and cannot establish completion, certification,
  permissions, or commercial/security entitlements.
- No payment, subscription, billing, or multi-tenant implementation is introduced
  by this remediation.
- Existing Production data must be preserved.

## 3. Scope

### 3.1 P0 tables

The initial remediation scope is limited to:

1. `public.user_profile`
2. `public.enrollments`
3. `public.learning_progress`
4. `public.courses`
5. `public.lessons`

The intended access model is defined in C02.

### 3.2 P1 functions and triggers

The review includes:

- `ensure_user_profile()`
- `report_lesson_activity(...)`
- `trust_set_lesson_progress(...)`
- the profile-trigger path involving `enroll_student_in_path_courses()`
- the existing academic-linking path involving `handle_student_linking()`

No function or trigger may be changed merely because it appears in this list.
Each change requires a documented purpose, dependency review, and rollback evidence.

### 3.3 Default privileges

Production default privileges remain a separate security concern.
They are not considered remediated by table-level grants or policies in C05.

Any proposed default-privilege change requires:
- identification of the affected owner roles;
- exact before-state capture;
- impact analysis for future objects;
- explicit validation;
- a verified rollback procedure.

### 3.4 Out of scope

The following are not authorized by this plan:

- `quiz_answers` remediation;
- unrelated application tables;
- Labs 1–8 or lab runners;
- `simulation.js` and `fixed-data.js`;
- payment/subscription implementation;
- broad Auth configuration changes;
- new Supabase projects or plan upgrades;
- application deployment;
- Production SQL execution.

## 4. Evidence baseline

The plan relies on the previously supplied evidence:

- Production catalog audit dated 2026-11-22.
- Production Auth settings review supplied on 2026-11-23.
- Production backup created on 2026-11-23 and verified with `pg_restore --list`.
- Public schema-only extraction and local schema restoration.
- Pack 1 local validation and rollback evidence, revision 065501-R2.
- Gate B closure minutes.

The backup contains sensitive Production data. It must remain protected and must not
be uploaded to GitHub or shared.

The local Pack 1 validation does not prove that a proposed Gate C migration is safe
on Production.

## 5. Remediation sequence

### S0 — Freeze and preserve

- Do not change Production.
- Preserve the verified backup and its recorded checksum.
- Preserve Pack 1 snapshots and closure evidence.
- Do not overwrite or regenerate historical evidence.

### S1 — Confirm schema and dependency contracts

- Verify every referenced table, column, constraint, function signature, trigger,
  owner, and grant against the target schema.
- Do not infer column names or function return types.
- Stop if the supplied schema evidence is insufficient.

### S2 — Finalize the access-control matrix

- Complete C02.
- Ensure direct client writes cannot modify protected identity or progress fields.
- Preserve public read access to approved course content.
- Define server-only operations explicitly.

### S3 — Finalize identity and linking behavior

- Complete C03.
- Do not use email local-part or national/student number alone as proof of academic
  identity.
- Do not enable an insecure automatic profile-linking path.
- Preserve the distinction between profile lookup and profile provisioning.

### S4 — Finalize function and trigger changes

- Complete C04.
- Verify SECURITY DEFINER functions use a fixed safe search_path.
- Define exact EXECUTE privileges.
- Document trigger dependencies and any intended removal or replacement.

### S5 — Prepare the migration

- Complete C05 only after S1-S4 are accepted.
- Use explicit, narrow privilege changes.
- Do not silently change unrelated objects or privileges.
- Capture before-state snapshots before any test application.

### S6 — Establish a real rollback

- Complete C06 with an executable rollback or a formally verified restoration
  procedure.
- Capture and validate the exact pre-change state.
- Demonstrate rollback in an isolated test database.
- Until this is complete, execution readiness remains NOT READY.

### S7 — Validate in isolation

- Complete and run C07 only against an isolated non-Production test database.
- Validate positive and negative access paths.
- Verify fixture cleanup and rollback.
- Record actual output, environment, and limitations.
- A written test plan without execution evidence is not a passed test.

### S8 — Operational readiness and acceptance

- Complete C08-C10.
- Resolve all blocking risks.
- Obtain a separate, explicit Production execution approval.
- Define the authorized operator, maintenance window, monitoring, stop conditions,
  and post-change verification before any Production work.

## 6. Mandatory stop conditions

Stop the process if any of the following occurs:

- The actual schema differs from the documented assumptions.
- A migration would affect objects outside the approved scope.
- The rollback is incomplete or unverified.
- A test produces an unexplained result.
- A required privilege or dependency cannot be established.
- A change risks loss of Production data or learner progress.
- A proposed identity path relies only on email or an unverified identifier.
- The operator cannot verify the target project and environment.
- Explicit Production approval has not been granted.

## 7. Current blockers

The following remain open:

1. F1-F11 are not closed by the local Pack 1 test; closure requires applicable
   remediation and post-change evidence.
2. Production default privileges remain unresolved.
3. Academic identity linking requires a secure, independently verified design.
4. Course publication and track semantics require schema/product evidence.
5. C06 has no executable, verified rollback at this stage.
6. The Gate C patch has not been validated against an isolated database.
7. No Gate C SQL has been executed on Production or on `cyberpath_test`.

## 8. Current decision

**NOT READY FOR PRODUCTION EXECUTION.**

This document establishes the remediation plan only. It does not close security
findings, approve a migration, authorize database writes, or authorize Production
execution.

A separate written approval is required before any Production change.

## Addendum — Consolidated Gate C Blockers

Status: OPEN — NO-GO — PRODUCTION EXECUTION NOT AUTHORIZED

The following additional evidence requirements are explicit blockers:

1. Sensitive profile reads: AC13 and risk R16 remain open. Own-row RLS
   isolation is not sufficient; an approved profile projection and effective
   column-access review are required.
2. Effective privileges: AC14 and risk R17 remain open. Review schema USAGE,
   table and column ACLs, sequence ACLs, every function signature, inherited
   privileges, and actual role behavior.
3. Concurrency and retries: AC15 and risk R18 remain open. Isolated tests
   must prove deterministic, idempotent enrollment and progress behavior.
4. Application identity context: OP08 remains untested. Representative
   authenticated Backend/PostgREST requests and the real server-side
   privileged path must be validated without exposing service_role.
5. Academic identity: C03 now defers academic linking until an authoritative
   institutional verification process is identified and approved.
6. Test prerequisites: C07 remains a specification, not executed evidence.
   Its Auth context, fixture creation, and function contracts must be
   verified against the actual isolated environment before execution.
7. Rollback: C06 remains blocked. No executable rollback may be invented
   without exact pre-change snapshots and successful isolated comparison.

These blockers supplement section 7 and do not close F1-F11 or any historical
finding. Gate C remains NOT READY FOR PRODUCTION EXECUTION.

No SQL, DDL, DML, GRANT, REVOKE, Auth configuration, or Production change
is authorized by this addendum.
