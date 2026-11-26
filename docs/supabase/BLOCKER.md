# CyberPath — Gate C Production Blockers

**Overall status:** BLOCKED — NO-GO
**Target:** Existing Supabase Production project `suvpaunulhqfoclepwoz`
**Review date:** 2026-11-24

---

## 1. Decision

Gate C is not ready for Production execution.

This document consolidates the outstanding blockers. It does not authorize Production access, SQL execution, database changes, Auth configuration changes, or deployment.

## 2. Mandatory blockers

### BLOCKER-01 — Executable and verified rollback

**Severity:** Critical  
**Artifact:** C06_DOWN.sql

C06 is currently a blocked rollback specification, not an executable rollback.

Required before proceeding:
- Capture exact pre-change catalog snapshots.
- Produce a rollback that restores the actual prior state.
- Test UP followed by DOWN in an isolated representative database.
- Compare policies, RLS, ACLs, function definitions, triggers, and default privileges before and after.

### BLOCKER-02 — Migration validation

**Severity:** Critical  
**Artifact:** C05_UP.sql

C05 remains deliberately disabled.

Required before proceeding:
- Resolve all schema and privilege assumptions.
- Review the final migration against the actual schema.
- Execute it only in an isolated representative environment.
- Verify expected permissions and denied operations.

Do not remove the execution guard merely to make the file executable.

### BLOCKER-03 — Complete validation evidence

**Severity:** Critical  
**Artifact:** C07_VALIDATION.sql

C07 is a test specification. Its tests have not been accepted as a completed validation suite.

Required before proceeding:
- Execute anonymous-access and authenticated-access tests.
- Prove cross-user isolation.
- Prove role and protected-profile escalation are denied.
- Validate function EXECUTE boundaries.
- Test triggers and default privileges.
- Record actual results and investigate every failure.

### BLOCKER-04 — Academic identity verification

**Severity:** Critical  
**Artifact:** C03_IDENTITY_LINKING_DESIGN.md

The institutional verification authority and workflow remain unresolved.

Email matching, email local-part matching, student number, or national ID alone must not establish academic identity.

Required before proceeding:
- Approve an independent institutional verification source.
- Define authorized reviewers and conflict handling.
- Test linking, unlinking, duplicate, and recovery scenarios.

### BLOCKER-05 — Functions and triggers

**Severity:** High  
**Artifact:** C04_FUNCTIONS_TRIGGERS_PLAN.md

The target function and trigger behavior has not been fully validated against actual dependencies.

Required before proceeding:
- Review exact function definitions, ownership, ACLs, and dependencies.
- Resolve SECURITY DEFINER and search_path concerns.
- Resolve ambiguous enrollment selection.
- Validate trigger behavior in isolation.

### BLOCKER-06 — Default privileges

**Severity:** High

Fresh owner-specific default privilege evidence and an approved remediation/rollback plan are still required.

### BLOCKER-07 — Production approval

**Severity:** Critical

No Production execution approval has been granted by this package.

Any future Production execution requires separate, explicit approval after all technical blockers are closed.

## 3. Current artifact status

| Artifact | Status |
|---|---|
| C01_PRODUCTION_REMEDIATION_PLAN.md | Planning document |
| C02_POLICY_MATRIX.md | Design baseline |
| C03_IDENTITY_LINKING_DESIGN.md | Institutional decision pending |
| C04_FUNCTIONS_TRIGGERS_PLAN.md | Design baseline |
| C05_UP.sql | Disabled draft |
| C06_DOWN.sql | Blocked; not executable |
| C07_VALIDATION.sql | Test specification; not run |
| C08_PRODUCTION_RUNBOOK.md | Runbook draft |
| C09_RISK_REGISTER.md | Open |
| C10_ACCEPTANCE_REPORT.md | Not accepted |

## 4. Prohibited actions while blocked

Until all blockers are closed and separate approval is granted:

- Do not execute C05 or any proposed remediation on Production.
- Do not execute C06 on Production.
- Do not apply GRANT or REVOKE.
- Do not alter RLS, policies, functions, or triggers.
- Do not change Supabase Auth settings.
- Do not deploy application changes as part of this remediation.
- Do not represent local tests or historical audit evidence as current Production validation.

## 5. Closure requirements

A blocker may be closed only when:
1. Its required evidence exists.
2. The evidence has been reviewed.
3. The reviewer and review date are recorded.
4. Remaining limitations are documented.
5. C10 acceptance criteria are satisfied.

Closing this document or creating the listed files does not close any technical blocker.

## 6. Final decision

**GATE C: BLOCKED — NO-GO — PRODUCTION EXECUTION NOT AUTHORIZED**

No Production changes are authorized by this document.


## Consolidated Review Addendum — Pack 1 Evidence Boundaries

Review date: 2026-11-24
Status: OPEN — NO-GO
Scope: Documentation-only consolidation. No database or Production changes.

### 1. Pack 1 acceptance boundary

Pack 1 was accepted for its documented local preparation and validation scope.
That acceptance does not establish Gate C readiness, Production security, or
authorization to execute remediation against the Production Supabase project.

### 2. Snapshot coverage limitations

The reviewed snapshot process captures selected RLS state, policies, table
ACLs, explicit column ACLs, selected function definitions and ACLs, selected
triggers, and matching default-ACL catalog entries.

It does not capture a complete table schema and constraint inventory, including
column nullability, primary keys, foreign keys, and check constraints.

An empty column-ACL or default-ACL snapshot is not proof that all effective
privileges are absent. It only means the corresponding snapshot query returned
no explicit rows within its scope.

The snapshot comparison verifies equality within the categories collected.
It does not prove that the collection covers every security-relevant category.

### 3. Pack 1 role and privilege gate limitations

The client_role_tree view follows role membership relationships above and below
anon and authenticated. The reviewed gates do not constitute a complete
effective-privilege audit.

The table privilege checks cover selected operations and selected objects,
not the complete table and column privilege matrix.

The trust-function gate checks one function signature against the constructed
client role tree. It is not a complete inventory of every function, overload,
owner, security mode, schema privilege, or effective EXECUTE grant.

Role attributes, including superuser and RLS-bypass capabilities, are not
comprehensively validated by these gates.

### 4. Sensitive profile data

A table-level SELECT grant on user_profile can expose every selectable column
to a row-authorized user, including sensitive identity fields such as
national_id and student_number.

Row-level isolation alone does not provide column-level confidentiality.
A safe profile projection or equivalent restricted data model must be designed
and validated before granting profile reads.

The ensure_user_profile function returning the full user_profile row also
requires review for sensitive-field exposure.

### 5. Function and trigger evidence boundaries

The local snapshot contains trigger_enroll_on_new_profile invoking
enroll_student_in_path_courses. It does not contain evidence of an Auth trigger
invoking handle_student_linking or on_auth_user_created.

This local snapshot limitation does not prove that such a trigger is absent
from Production.

The captured handle_student_linking definition uses email local-part matching
against national_id and is SECURITY DEFINER without a fixed search_path.
Automatic academic identity linking remains blocked pending an independently
verified institutional process and complete function/trigger review.

The enroll_student_in_path_courses definition uses LIMIT 1 without a
deterministic ordering rule. Its intended behavior and ambiguity handling
must be decided before any Production remediation.

### 6. Default privilege limitations

The reviewed default-privilege gate checks matching explicit entries in
pg_default_acl for PUBLIC, anon, and authenticated. It does not by itself
prove complete effective privilege safety for future objects, all grantors,
all role memberships, or all object types.

Schema USAGE, sequence privileges, column privileges, and every function
signature and EXECUTE grant must be included in the final effective-privilege
review.

### 7. Validation limitations

The proposed C07 test harness is not approved for execution. Its assumptions
about user_profile constraints, direct auth.users inserts, JWT claim handling,
RPC behavior, and service_role execution context require verification.

SET ROLE service_role is not evidence that the real server-side application
path is correctly protected.

Validation must cover separate real identities, denied writes followed by
proof that stored values remain unchanged, sensitive-field isolation,
unpublished content, concurrency, retries, and idempotency.

### 8. Required closure conditions

Before Gate C can be considered ready:

- Obtain authoritative schema and constraint evidence for all in-scope tables.
- Design and validate a safe user_profile projection that excludes sensitive
  identity fields from ordinary user reads.
- Inventory schema USAGE, table and column ACLs, sequence ACLs, all function
  signatures and effective EXECUTE privileges, role attributes, and relevant
  memberships.
- Capture and review the actual Production function and trigger definitions.
- Resolve academic identity verification and automatic enrollment behavior.
- Produce an executable, independently reviewed rollback and validate it in
  an isolated environment.
- Complete C07 tests against verified schema and realistic authenticated and
  server-side application paths.
- Complete the operational and acceptance evidence required by C08 and C10.

### 9. Decision

Gate C remains NO-GO. C05 and C07 remain unapproved drafts.
No Production SQL, DDL, DML, GRANT, REVOKE, migration, or Auth configuration
change is authorized by this addendum.

This addendum records review findings; it does not certify that the listed
conditions have been remediated or tested.
