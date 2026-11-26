# C02 — Production Policy Matrix

**Project:** CyberPath  
**Gate:** C — Production Remediation Readiness  
**Status:** DESIGN BASELINE — NOT EXECUTION APPROVAL  
**Date:** 2026-11-24

---

## 1. Purpose

This document defines the intended access-control model for the Gate C P0 scope.

It is a target design, not evidence that Production currently enforces these controls.
Actual policies, grants, column privileges, ownership, and API exposure must be
verified against the target database before implementation.

## 2. Principals

| Principal | Meaning | Trust boundary |
|---|---|---|
| `PUBLIC` | PostgreSQL pseudo-role applying to all roles | Must not receive unintended access |
| `anon` | Unauthenticated Supabase API role | Public content only |
| `authenticated` | Signed-in client session | Own permitted reads; no privileged direct writes |
| `service_role` | Privileged server-side Supabase role | Server only; never expose to browser |
| Object owner / migration operator | Database object owner or authorized operator | Controlled administrative access |

A role name alone does not prove that a request is safe. API exposure, effective
privileges, RLS, function EXECUTE grants, and server-side credential handling must
all be considered.

## 3. P0 table access matrix

| Table | anon | authenticated | service_role |
|---|---|---|---|
| `public.user_profile` | No direct access | SELECT own profile only | Server-side access as explicitly granted |
| `public.enrollments` | No direct access | SELECT own enrollment rows only | Server-side access as explicitly granted |
| `public.learning_progress` | No direct access | SELECT own course/lesson progress only | Server-side access as explicitly granted |
| `public.courses` | SELECT published/public content only, subject to publication contract | Same public content read | Server-side access as explicitly granted |
| `public.lessons` | SELECT lessons belonging to published/public courses only, subject to publication contract | Same public content read | Server-side access as explicitly granted |

### 3.1 Client writes

For the five P0 tables:

- `anon` receives no direct INSERT, UPDATE, or DELETE.
- `authenticated` receives no direct INSERT, UPDATE, or DELETE.
- `authenticated` must not change profile role, track, student type, academic
  identifiers, ownership fields, or other protected identity attributes directly.
- `authenticated` must not directly write trusted completion values.
- No client receives TRUNCATE, REFERENCES, TRIGGER, or MAINTAIN privileges.
- Any necessary write must use a narrowly scoped server-side operation with explicit
  validation and authorization.

### 3.2 Public course content

Public access to `courses` and `lessons` must remain available without mandatory
registration.

The current evidence does not establish a verified publication column or exact
publication-state contract. Therefore:

- Do not invent a column such as `is_published`, `published`, or `status`.
- Do not equate every existing course row with approved public content.
- Do not implement a publication filter until the actual schema and product semantics
  are verified.
- If publication cannot be distinguished safely, mark the public-content policy as
  a blocker rather than silently exposing draft or private content.

## 4. Row-level security requirements

### 4.1 `user_profile`

- RLS must be enabled.
- Authenticated SELECT must be restricted to the row whose `user_id` equals
  `auth.uid()`.
- No direct authenticated INSERT, UPDATE, or DELETE policy is permitted in this
  target design.
- Administrative profile changes must use a separately authorized server-side path.
- A policy must not query `user_profile` recursively to decide whether the current
  user is an administrator.
- Unlinked rows where `user_id IS NULL` must not become visible to all authenticated
  users.

### 4.2 `enrollments`

- RLS must be enabled.
- Authenticated SELECT must be restricted to rows owned by `auth.uid()`.
- No direct client INSERT, UPDATE, or DELETE is permitted.
- Open course discovery must not be represented by creating ambiguous enrollment
  records.
- Academic enrollment and optional open-course following must remain distinct
  concepts unless the schema explicitly models both.

### 4.3 `learning_progress`

- RLS must be enabled.
- Authenticated SELECT must be restricted to rows owned by `auth.uid()`.
- No direct client INSERT, UPDATE, or DELETE is permitted.
- Self-reported activity and trusted completion must remain distinct.
- A self-reported progress operation must not accept 100 percent as proof of
  completion or examination success.
- Trusted progress updates must be restricted to a separately authorized server path.

### 4.4 `courses` and `lessons`

- RLS must be enabled if these tables are exposed through the Supabase API.
- Public SELECT is permitted only for content verified as public.
- No client writes are permitted.
- Lesson visibility must not bypass the visibility rules of its parent course.
- Exact publication predicates remain blocked pending schema and product verification.

## 5. Function execution matrix

The following is the intended function contract. Exact signatures and return types
must be confirmed from the database catalog before grants or tests are written.

| Function | anon | authenticated | service_role | Intended behavior |
|---|---|---|---|---|
| `ensure_user_profile()` | Denied | Allowed | Allowed | Return the caller's existing profile only; do not create or link a profile |
| `report_lesson_activity(...)` | Denied | Allowed | Allowed if required by server workflow | Record bounded self-reported activity; reject 100 as trusted completion |
| `trust_set_lesson_progress(...)` | Denied | Denied | Allowed | Server-only trusted progress update after independent validation |

For every function:

- Revoke unintended EXECUTE privileges from `PUBLIC` and `anon`.
- Grant only the exact intended roles.
- Verify effective privileges after the change.
- SECURITY DEFINER functions must use a fixed safe `search_path`.
- Validate caller identity and authorization inside the function.
- Do not trust caller-supplied user IDs when the operation should act for `auth.uid()`.
- Do not expose `service_role` credentials to client-side code.

`ensure_user_profile()` is lookup-only. If no profile exists, it must fail with a
documented provisioning error. Profile creation and academic linking require a
separate trusted provisioning workflow.

## 6. Column-level privilege requirements

Table-level revocation does not by itself prove that unintended column-level grants
are absent.

Before implementation:

- Inspect `information_schema.column_privileges`.
- Inspect PostgreSQL ACLs, including explicit `PUBLIC` ACL entries.
- Inspect effective privileges for `anon`, `authenticated`, and `service_role`.
- Verify sensitive columns in `user_profile` cannot be read through residual
  column-level grants.
- Verify no residual column-level INSERT or UPDATE grants undermine the table policy.

The final validation must cover both table-level and column-level privileges.

## 7. Service-role boundary

`service_role` is a privileged backend identity.

- It must never be embedded in browser JavaScript, static assets, or client-visible
  configuration.
- It must only be used in a trusted server environment.
- Database role-switch tests are useful for isolated SQL validation but do not prove
  the real PostgREST or application-server request path.
- A separate server-side integration test is required before Production acceptance.

## 8. Out-of-scope objects

This matrix does not authorize changes to:

- `quiz_answers`;
- other application tables outside the five P0 tables;
- unrelated functions or triggers;
- default privileges;
- Auth provider settings;
- lab progress storage;
- payment or subscription tables.

Any expansion requires a documented scope change and separate approval.

## 9. Acceptance conditions

C02 can be accepted as a design document only when its contracts are consistent
with C03, C04, and C05.

Implementation readiness additionally requires:

1. Actual schema and function signatures verified.
2. Exact public-content publication semantics established.
3. Table and column ACLs fully inspected.
4. Function EXECUTE grants verified.
5. Isolated positive and negative tests completed.
6. Service-role server path tested without exposing credentials.
7. C06 rollback independently validated.

## 10. Current decision

**DESIGN BASELINE ONLY — NOT READY FOR PRODUCTION EXECUTION.**

This matrix does not change database privileges or RLS policies and does not authorize
any Production operation.


## Review Addendum — Sensitive Fields and Effective Privileges

The policy matrix must explicitly distinguish row access from column exposure.

Required controls and evidence:

- Review exposure of `national_id` and `student_number` through every permitted SELECT path, including a user reading their own profile.
- Prefer a restricted public/profile projection or a separately protected sensitive-data structure where appropriate.
- Inspect schema USAGE, table ACLs, column ACLs, sequence ACLs, RLS policies, and function EXECUTE privileges together.
- Inventory every function signature and effective EXECUTE grant, including PUBLIC, anon, authenticated, and service_role.
- Verify that unpublished, draft, archived, or otherwise non-public courses and lessons are not exposed to anon.
- Do not assume a publication column or status value; verify the actual schema and approved publication semantics first.

Acceptance requires evidence of effective privileges and negative access tests, not merely the presence of RLS.


## Addendum — Safe User Profile Projection

Status: DESIGN REQUIREMENT — NOT IMPLEMENTED OR PRODUCTION-APPROVED

### 1. Security decision

Authenticated users must not receive unrestricted table-level SELECT access
to public.user_profile merely because row-level policies restrict them to
their own row.

RLS controls which rows are visible. It does not, by itself, restrict which
columns of an authorized row can be read.

Sensitive identity fields, including national_id and student_number, must
not be exposed through ordinary client profile reads.

### 2. Approved access design direction

- Do not grant broad client SELECT access to the complete user_profile table.
- Define an explicit allowlist of profile fields that ordinary authenticated
  clients are permitted to read.
- Keep national_id, student_number, role, and other security-sensitive or
  institution-verification fields outside ordinary client-readable projections.
- Do not permit clients to update role, identity-verification fields,
  institutional identifiers, or entitlement-related fields.
- Use a separately reviewed restricted projection or a dedicated safe-profile
  data interface. Its implementation must preserve per-user authorization
  and must not bypass RLS unintentionally.
- Any SECURITY DEFINER interface must have a fixed safe search_path, explicit
  schema qualification, a reviewed owner, explicit output columns, and an
  authorization check derived from the authenticated identity.
- Do not return the complete user_profile row from ensure_user_profile()
  to an untrusted client-facing caller.

### 3. Schema-dependent decisions still open

The authoritative user_profile column definitions, constraints, dependencies,
and application consumers have not yet been captured completely.

Therefore this document does not prescribe a final column allowlist, view
definition, function signature, or SQL migration.

Before implementation, identify every column and classify it as:
(a) ordinary user-readable,
(b) owner-readable but not client-writable,
(c) restricted to trusted server-side or institutional verification paths.

Review every API, RPC, and frontend consumer that currently expects the
complete user_profile row. Update compatibility plans before changing grants
or function return types.

### 4. Required validation evidence

- A user can read only the approved profile projection for their own identity.
- A user cannot read another user's profile projection.
- national_id and student_number are not exposed through client table reads,
  views, RPC responses, or other exposed API paths.
- A client cannot modify role, student identity, verification status, or
  entitlement-related fields.
- Any denied write is followed by a read proving the stored value is unchanged.
- The actual authenticated API path is tested; SET ROLE alone is insufficient.
- Function EXECUTE grants, view ownership/security mode, schema USAGE, table
  ACLs, column ACLs, and RLS behavior are verified together.

### 5. Decision

The safe profile projection is a mandatory Gate C condition.
This addendum records a design requirement only. It does not authorize SQL,
DDL, DML, GRANT, REVOKE, or Production changes.
