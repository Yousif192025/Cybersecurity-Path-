# C09 — CyberPath Production Remediation Risk Register

**Status:** OPEN — PRODUCTION NOT READY
**Scope:** Phase 3 identity, access control, and learning continuity
**Last package review:** 2026-11-24

---

## 1. Purpose

Record security, operational, architectural, and recovery risks associated with the proposed Production remediation.

This register records risks and required evidence. It does not authorize remediation or Production changes.

## 2. Risk rating

- **Critical:** Could expose sensitive records, enable account takeover, or compromise privileged access.
- **High:** Could cause unauthorized changes, loss of trusted progress, or failure of essential identity functions.
- **Medium:** Could cause operational inconsistency, incomplete controls, or future privilege exposure.
- **Open:** No accepted closure evidence has been recorded.

Risk ratings are preliminary planning assessments, not the result of a new Production audit.

## 3. Risk register

| ID | Risk | Rating | Required mitigation / evidence | Status |
|---|---|---|---|---|
| R01 | Public or overly permissive policies expose enrollment or learner data | Critical | Verify RLS, policies, table ACLs, and column ACLs after isolated remediation | Open |
| R02 | Authenticated users may change protected profile fields or roles | Critical | Prove direct role escalation is denied and protected data remains unchanged | Open |
| R03 | Academic profiles may be linked using email or identifier matching alone | Critical | Approve independent institutional verification and validate conflict handling | Open |
| R04 | Function EXECUTE privileges may expose privileged operations | Critical | Verify exact signatures, owners, SECURITY DEFINER behavior, and effective EXECUTE ACLs | Open |
| R05 | Existing SECURITY DEFINER functions may have unsafe search_path or ownership | High | Review exact definitions, dependencies, owners, and fixed search_path | Open |
| R06 | Trigger behavior may silently link profiles or create ambiguous enrollments | High | Review trigger dependencies and approve deterministic target behavior | Open |
| R07 | Default privileges may grant unintended access to future objects | High | Capture and review defaults for actual owners; prepare tested remediation and rollback | Open |
| R08 | Incomplete rollback could leave Production partially secured or unavailable | Critical | Produce executable C06 from verified snapshots and pass isolated restore comparison | Open |
| R09 | C07 test specifications may not match the actual schema or application path | High | Implement and execute tests against a representative isolated database | Open |
| R10 | Trusted progress path may expose service_role or accept unauthorized calls | Critical | Validate a real server-side path; prove credentials never reach the browser | Open |
| R11 | Public learning content may become inaccessible during remediation | Medium | Verify anonymous access to approved public courses and lessons | Open |
| R12 | Enrollment semantics may mix open learning with institutional enrollment | High | Approve distinct product and data semantics before implementation | Open |
| R13 | Existing application dependencies may break after policy or function changes | High | Complete dependency review and application smoke tests | Open |
| R14 | Backup restoration may be mistaken for a tested transactional rollback | High | Keep recovery procedure separate from C06 and verify restore capability | Open |
| R15 | Production schema may differ from historical audit evidence | High | Capture fresh pre-change snapshots and compare exact definitions | Open |

## 4. Existing evidence and limitations

The following evidence is already recorded in the project history:

- A read-only Production catalog audit was performed on 2026-11-22.
- The audit identified broad table privileges and incomplete RLS coverage.
- Local isolated Migration Pack 1 testing was completed and accepted.
- Migration Pack 1 did not apply repairs to Production.
- A Production backup was created and its archive integrity was checked.
- A public-schema-only local restoration was used for isolated testing.
- No current Gate C migration has been executed on Production.
- The current Gate C C05–C08 files are planning or blocked artifacts.
- C07 tests have not been executed as a complete suite.

Historical evidence must not be treated as proof of current Production state.

## 5. External blockers

### B01 — Verified rollback

C06 does not contain an executable rollback.

**Required closure evidence:** Exact pre-change snapshots, executable DOWN migration, isolated UP/DOWN cycle, and catalog comparison proving restoration.

### B02 — Academic verification authority

C03 does not yet identify an approved institutional verification source or authorized decision-maker.

**Required closure evidence:** Written product/institutional decision and validated workflow that does not rely on email or student number alone.

### B03 — Function and trigger dependencies

C04 defines target behavior but does not provide a verified dependency inventory or tested replacements.

**Required closure evidence:** Exact definitions, ownership, ACLs, dependencies, approved behavior, and isolated tests.

### B04 — Default privileges

Historical audit evidence identified broad default privileges.

**Required closure evidence:** Fresh owner-specific snapshots, approved target ACLs, and tested rollback.

### B05 — Validation

C07 is currently a test specification, not a completed test report.

**Required closure evidence:** Captured automated and manual results, including cross-user isolation and actual server-side privileged execution.

### B06 — Production approval

No Production execution approval is included in this package.

**Required closure evidence:** Separate explicit approval after all technical gates have passed.

## 6. Risk acceptance rules

- No Critical risk may be silently accepted.
- Any accepted residual risk must identify the accepting authority, reason, scope, and review date.
- A risk is not closed because a migration file was written.
- A risk is not closed because SQL parsed or completed without error.
- A risk is closed only when its stated evidence has been reviewed and accepted.
- Production changes require separate approval even after technical readiness.

## 7. Current go/no-go assessment

| Gate | Status |
|---|---|
| C01 remediation plan | Documented |
| C02 policy matrix | Design baseline |
| C03 identity linking | Design baseline; institutional decision pending |
| C04 functions and triggers | Design baseline |
| C05 UP migration | Disabled draft |
| C06 DOWN rollback | Blocked |
| C07 validation | Specification only |
| C08 runbook | Draft |
| C09 risk register | Open |
| C10 acceptance | Pending |

**Overall decision: NO-GO — NOT READY FOR PRODUCTION**

## 8. Review and change control

Update this register only when new evidence or an approved decision changes a risk.

Every update must record:

- Risk ID.
- Evidence reference.
- Previous status.
- New status.
- Reviewer.
- Review date.
- Remaining limitations.

Do not remove historical risk entries. Record closure evidence and retain the audit trail.

## 9. Final status

**C09 status: OPEN RISK REGISTER — PRODUCTION NOT READY**

No Production changes are authorized by this document.


### R16 — Sensitive identity fields exposed through profile reads

**Rating:** Critical  
**Risk:** `national_id` or `student_number` may be exposed through own-row or cross-user profile reads even when row-level isolation appears correct.  
**Required evidence:** Column-level access review, effective ACL/RLS review, and negative tests for every permitted profile-read path.  
**Status:** Open

### R17 — Incomplete effective privilege inventory

**Rating:** High  
**Risk:** Schema USAGE, sequence ACLs, column ACLs, or function EXECUTE grants may permit access beyond the intended policy matrix.  
**Required evidence:** Owner-aware inventory of schema, table, column, sequence, and every function signature privilege, followed by isolated role tests.  
**Status:** Open

### R18 — Concurrent or repeated operations produce inconsistent progress or enrollment state

**Rating:** High  
**Risk:** Concurrent requests or retries may create duplicate enrollment effects or inconsistent lesson progress.  
**Required evidence:** Isolated concurrency, retry, and idempotency tests with deterministic expected outcomes and stored-state verification.  
**Status:** Open

### Addendum — R16–R18 Evidence Tracking

Status: OPEN — NO RISK CLOSURE EVIDENCE ACCEPTED

The existing risks remain active and are linked to the acceptance report:

| Risk | Linked criterion | Current disposition |
|---|---|---|
| R16 — Sensitive identity fields exposed through profile reads | AC13 | Open; safe projection and negative API tests not evidenced |
| R17 — Incomplete effective privilege inventory | AC14 | Open; complete owner-aware ACL inventory and role tests not evidenced |
| R18 — Concurrent or repeated operations produce inconsistent state | AC15 | Open; isolated concurrency and idempotency tests not evidenced |

OP08 is an additional operational dependency for validating the actual
authenticated and privileged application paths.

No risk is closed by the existence of a design addendum, a drafted SQL file,
or an unexecuted test specification. Closure requires reviewed evidence
meeting the existing risk acceptance rules in section 6.

No Production changes are authorized by this addendum.
