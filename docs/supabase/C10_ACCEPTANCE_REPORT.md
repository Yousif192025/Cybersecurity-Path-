# C10 — CyberPath Gate C Acceptance Report

**Status:** NOT ACCEPTED — PRODUCTION NOT READY
**Target:** Existing Supabase Production project `suvpaunulhqfoclepwoz`
**Review date:** 2026-11-24

---

## 1. Purpose

Define the acceptance criteria and evidence required to close Gate C — Production Remediation Readiness.

This report records current package status. It is not evidence that the proposed remediation has been implemented or validated.

## 2. Acceptance principles

Gate C can be accepted only when:

- Every critical security requirement has verified evidence.
- The migration and rollback have both passed in an isolated representative environment.
- Cross-user and anonymous-access boundaries have been tested.
- Function and trigger behavior has been reviewed and tested.
- Academic identity linking has an approved independent verification workflow.
- Default privileges have been inspected and addressed.
- Operational recovery and monitoring procedures are documented.
- All remaining risks have explicit dispositions.
- Production execution, if later desired, receives separate explicit approval.

Documentation alone does not satisfy an implementation or test requirement.

## 3. Deliverable status

| Deliverable | Current status | Acceptance |
|---|---|---|
| C01 Production remediation plan | Documented | Pending review |
| C02 policy matrix | Design baseline | Pending implementation evidence |
| C03 identity linking design | Design baseline | Institutional decision pending |
| C04 functions and triggers plan | Design baseline | Dependency and test evidence pending |
| C05 UP migration | Disabled draft | Not accepted |
| C06 DOWN rollback | Blocked; no executable rollback | Not accepted |
| C07 validation | Test specification only | Not accepted |
| C08 Production runbook | Draft | Pending technical gates |
| C09 risk register | Open | Not accepted |
| C10 acceptance report | Current report | Not accepted |

## 4. Security acceptance criteria

| ID | Acceptance criterion | Required evidence | Status |
|---|---|---|---|
| AC01 | Anonymous users can access only approved public content | Anonymous tests and effective ACL/RLS evidence | Not tested |
| AC02 | Private learner data is inaccessible to anon | Negative tests for every scoped table | Not tested |
| AC03 | Authenticated users cannot read another user's private records | Cross-user isolation test results | Not tested |
| AC04 | Users cannot change their own protected roles or identity fields | Denial result and unchanged-row evidence | Not tested |
| AC05 | Academic linking requires independent verification | Approved institutional workflow and conflict tests | Pending |
| AC06 | Function EXECUTE privileges follow the approved matrix | Exact function ACL snapshots and role tests | Not tested |
| AC07 | SECURITY DEFINER functions use safe ownership and search_path | Definition and ownership review | Not tested |
| AC08 | Trigger behavior is deterministic and safe | Trigger inventory and isolated behavior tests | Not tested |
| AC09 | Default privileges do not expose future objects | Owner-specific default ACL evidence | Not tested |
| AC10 | Trusted progress cannot be self-awarded by a client | Actual server-side authorization tests | Not tested |
| AC11 | Course progress remains separate from lab progress | Schema and application-path evidence | Pending |
| AC12 | Rollback restores the original effective security state | Isolated UP/DOWN catalog comparison | Blocked |

## 5. Operational acceptance criteria

| ID | Criterion | Current status |
|---|---|---|
| OP01 | Verified Production backup and recovery procedure | Historical backup evidence exists; current recovery gate pending |
| OP02 | Exact pre-change snapshots are available | Fresh snapshots required |
| OP03 | Isolated migration execution succeeds | Not run for Gate C |
| OP04 | Isolated rollback execution succeeds | Blocked by C06 |
| OP05 | Application smoke tests pass | Not run for Gate C |
| OP06 | Monitoring and stop conditions are defined | Drafted in C08 |
| OP07 | Separate Production authorization is recorded | Not granted |

## 6. Evidence rules

Every accepted criterion must include:

- Criterion ID.
- Evidence file or command output reference.
- Environment identifier.
- Test date.
- Test method.
- Expected result.
- Actual result.
- Reviewer and disposition.
- Any limitations or exclusions.

Do not include passwords, service_role keys, connection strings, access tokens, or other secrets in evidence files.

Production catalog evidence must be read-only unless a separate explicit authorization is granted for a specific change.

## 7. Outstanding blockers

1. C06 has no executable rollback derived from verified pre-change state.
2. C07 has not been executed against a representative isolated database.
3. C03 requires an approved institutional verification authority and workflow.
4. C04 requires exact function and trigger dependency review.
5. Default privileges require fresh owner-specific inspection and tested remediation.
6. Application-level and server-side trusted-progress paths require validation.
7. C05 remains deliberately disabled.
8. No separate Production execution approval exists.

## 8. Acceptance decision

<badge color="danger">NOT ACCEPTED — NO-GO</badge>

Gate C is not accepted for Production remediation.

This decision does not invalidate the documentation work. It means the required technical, recovery, and institutional evidence has not yet been completed.

## 9. Production authorization boundary

This report does not authorize:

- Production SQL execution.
- DDL or DML.
- GRANT or REVOKE.
- RLS or policy changes.
- Function or trigger replacement.
- Supabase Auth configuration changes.
- Deployment or application release.

Any future Production change requires its own explicit approval after all acceptance gates are satisfied.

## 10. Final status

**C10 status: ACCEPTANCE PENDING — PRODUCTION NOT READY**

**Gate C decision: NO-GO**

No Production changes are authorized by this report.


### AC13 — Sensitive profile fields are not exposed

**Required evidence:** Effective column ACL/RLS review and negative tests proving `national_id` and `student_number` are not exposed through unauthorized profile-read paths.  
**Status:** Not tested

### AC14 — Complete effective database privileges match the approved matrix

**Required evidence:** Schema USAGE, table ACL, column ACL, sequence ACL, and every function signature EXECUTE privilege reviewed and tested for relevant roles.  
**Status:** Not tested

### AC15 — Concurrent and repeated operations preserve correct state

**Required evidence:** Isolated concurrency, retry, and idempotency tests for enrollment and course progress, including verification of the final stored state.  
**Status:** Not tested

### OP08 — Actual authenticated and privileged application paths are validated

**Required evidence:** Representative isolated Backend/PostgREST tests using authenticated JWT identities, plus evidence that service_role credentials never reach browser-visible code or responses.  
**Status:** Not tested

### Addendum — Acceptance Status Reconciliation

Status: NOT ACCEPTED — NO-GO

The additional acceptance criteria remain explicitly outstanding:

| Criterion | Linked risk / dependency | Current status |
|---|---|---|
| AC13 — Sensitive profile fields are not exposed | R16 | Not tested |
| AC14 — Effective privileges match the approved matrix | R17 | Not tested |
| AC15 — Concurrent and repeated operations preserve correct state | R18 | Not tested |
| OP08 — Actual authenticated and privileged application paths are validated | C04, C07 and trusted server boundary | Not tested |

Acceptance evidence must identify the environment, exact test method,
expected and actual result, stored-state verification, date, and reviewer.

A design requirement or planned test is not execution evidence. No criterion
may be marked PASS until its required evidence is captured and reviewed.
C06 rollback remains blocked, C07 remains NOT RUN, and separate Production
authorization has not been granted.

Gate C remains NOT ACCEPTED. This addendum grants no Production authorization.
