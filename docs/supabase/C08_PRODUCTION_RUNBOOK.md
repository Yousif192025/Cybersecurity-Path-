# C08 — CyberPath Production Remediation Runbook

**Status:** NOT READY — PRODUCTION EXECUTION BLOCKED  
**Target:** Existing Supabase Production project `suvpaunulhqfoclepwoz`  
**Scope:** Phase 3 identity and learning-progress security remediation

---

## 1. Purpose

Define the controlled operational procedure for a future Production remediation.

This runbook does not authorize Production access, SQL execution, database changes, Auth configuration changes, or deployment.

## 2. Current execution decision

**Production execution: NOT AUTHORIZED**

The remediation package is not ready because:

- C05 is a disabled draft, not a validated migration.
- C06 has no executable, verified rollback.
- C07 contains test specifications only; tests have not been executed.
- C03 still requires an approved institutional verification authority and workflow.
- C04 requires verified function and trigger definitions and dependencies.
- Default privilege remediation remains unresolved.
- C09 and C10 acceptance evidence is not complete.

No operator may bypass these blockers by manually executing selected SQL sections.

## 3. Scope

The intended P0 database scope is limited to:

- `public.user_profile`
- `public.enrollments`
- `public.learning_progress`
- `public.courses`
- `public.lessons`

Related function and trigger review is tracked separately in C04.

Tables and features outside this scope must not be modified without a separate approved change.

## 4. Mandatory preconditions

Before a Production change can be considered:

1. Confirm the exact target project reference and environment.
2. Obtain separate explicit written Production approval.
3. Obtain a verified backup and document its recovery point.
4. Confirm backup integrity and restoration capability.
5. Capture fresh pre-change catalog snapshots.
6. Verify table and column ACLs.
7. Verify RLS policies and RLS enabled/forced states.
8. Verify function definitions, ownership, security mode, and EXECUTE ACLs.
9. Verify trigger definitions and dependencies.
10. Resolve the academic verification workflow in C03.
11. Complete C04 function and trigger decisions.
12. Complete and test C05 in an isolated representative database.
13. Produce and test executable C06 rollback.
14. Pass C07 automated and manual validation.
15. Resolve or formally disposition C09 blockers.
16. Obtain C10 acceptance.

A historical audit or an old backup alone does not satisfy these preconditions.

## 5. Authorized roles and separation of duties

- **Product owner:** approves intended product behavior and scope.
- **Database operator:** performs approved database operations.
- **Security reviewer:** reviews policies, privileges, functions, and validation evidence.
- **Application operator:** verifies backend and application integration.
- **Acceptance authority:** records final go/no-go decision.

The same person may hold more than one role only if the organization explicitly accepts that arrangement and records it.

Credentials must be handled through approved secure channels. Never place database passwords, service_role keys, or connection URIs in repository files, terminal logs, or client code.

## 6. Pre-change checklist

The authorized operator must record:

- Change identifier and approval reference.
- Target project reference.
- Date and time in UTC.
- Operator identity and reviewer identity.
- Backup identifier, size, integrity result, and recovery point.
- Snapshot artifact names and checksums.
- C05 version and checksum.
- C06 version and checksum.
- C07 test evidence references.
- Known risks and expected application impact.
- Communication and incident escalation contacts.

If any required evidence is missing, stop.

## 7. Future execution sequence

Only after every precondition is accepted:

1. Announce the approved maintenance window.
2. Verify the target project reference independently.
3. Verify the approved backup and snapshots.
4. Reconfirm that C05 and C06 checksums match the accepted artifacts.
5. Execute only the approved migration through the authorized operator.
6. Stop immediately on any unexpected error or catalog mismatch.
7. Execute the approved automated validation.
8. Verify public course and lesson access.
9. Verify authenticated profile and enrollment isolation.
10. Verify self-reported and trusted progress paths.
11. Verify signup and login behavior.
12. Verify application server integration without exposing service_role.
13. Capture post-change catalog snapshots.
14. Record all outputs and discrepancies.
15. Obtain post-change security and product acceptance.

Do not continue after a failed mandatory assertion.

## 8. Stop conditions

Stop the operation immediately if:

- The project reference differs from the approved target.
- The backup cannot be verified.
- Snapshot generation is incomplete.
- Actual schema differs from the reviewed schema.
- Unexpected policies or ACLs are discovered.
- Function signatures or trigger dependencies differ.
- Any unauthorized access test succeeds.
- Public open learning content becomes unavailable unexpectedly.
- Signup, login, or profile provisioning fails.
- Progress is written to the wrong user or lesson.
- An unexpected database error occurs.
- The rollback procedure cannot be executed as tested.

Do not improvise SQL during a Production incident.

## 9. Rollback procedure

Rollback is permitted only through the separately approved and tested C06 procedure.

Before rollback:

- Stop further application writes if required by the approved incident plan.
- Record the failure and current database state.
- Preserve relevant logs and evidence.
- Confirm the rollback target and operator authorization.

Then:

1. Follow the exact tested C06 sequence.
2. Do not replace it with guessed GRANT, REVOKE, or policy statements.
3. Verify restored policies, ACLs, functions, and triggers.
4. Verify data integrity.
5. Run the approved application smoke tests.
6. Record rollback outcome and residual risks.

A backup restore is a separate disaster-recovery operation and requires its own authorized recovery procedure.

## 10. Post-change monitoring

After an approved change, monitor:

- Authentication and signup errors.
- Profile provisioning failures.
- Unauthorized profile or enrollment access attempts.
- Progress update failures.
- Public course and lesson availability.
- Function execution failures.
- Unexpected privilege or policy errors.
- Trigger failures and enrollment behavior.

Monitoring duration and alert thresholds must be agreed before the Production window.

## 11. Security restrictions

- Never expose service_role credentials to the browser.
- Never grant clients unrestricted access to protected tables.
- Never restore insecure policies such as `USING (true)` as an emergency workaround.
- Never infer academic ownership from email or student number alone.
- Never modify unrelated tables or features within this change.
- Never execute C05 while C06 remains blocked.
- Never treat a local `SET ROLE service_role` test as proof of real backend integration.

## 12. Current operational record

| Item | Current status |
|---|---|
| Production approval | Not granted |
| C05 migration | Disabled draft |
| C06 rollback | Blocked |
| C07 validation | Specification only |
| C03 academic workflow | Pending decision |
| C04 functions/triggers | Design baseline |
| Default privileges | Unresolved |
| Production execution | None |
| Production changes | None |

## 13. Final status

**C08 status: RUNBOOK DRAFT — NOT READY FOR PRODUCTION**

This runbook becomes operational only after all mandatory preconditions, rollback evidence, validation results, and separate Production approval are recorded.


## Review Addendum — Extended Operational Preconditions

Before any future Production approval, the accepted validation evidence must additionally include:

- Schema USAGE, sequence ACL, column ACL, and complete function EXECUTE inventory.
- Explicit verification that sensitive identity fields are not exposed through profile reads.
- Actual isolated Backend/PostgREST tests using representative authenticated JWT identities.
- Evidence that service_role credentials remain exclusively server-side and never reach browser code or public responses.
- Concurrency and idempotency tests for progress updates and enrollment operations.
- Verification that anonymous users cannot read unpublished or private course content.
- Agreed monitoring duration, alert thresholds, incident contacts, and escalation procedure before the maintenance window.

These requirements supplement, and do not replace, the mandatory preconditions in this runbook. All Production execution remains unauthorized until separate written approval is granted.

## Addendum — Gate C Evidence Status Reconciliation

Status: OPERATIONAL HOLD — PRODUCTION EXECUTION NOT AUTHORIZED

The following items are mandatory preconditions, not completed actions:

- C03 academic identity linking is deferred until an authoritative
  institution-controlled verification source and approval process exist.
  Email, email local-part, national_id, and student_number alone are not
  verification evidence.
- C04 function and trigger security requirements remain design requirements
  until exact definitions, dependencies, ownership, and effective privileges
  are captured and reviewed.
- C05 remains deliberately disabled. Its sensitive-profile read boundary
  is unresolved until the actual schema and safe response projection are
  approved.
- C06 has no executable rollback and remains blocked.
- C07 remains NOT RUN. Auth context, fixtures, and function behavior must be
  validated before executable tests are authored or accepted.
- C09 risks R16, R17, and R18 remain open.
- C10 criteria AC13, AC14, AC15, and OP08 remain untested and must not be
  represented as satisfied.

No maintenance window may be scheduled as an execution window until every
mandatory precondition is evidenced, reviewed, and separately approved.

This addendum does not authorize Production access, SQL execution, database
changes, Auth configuration changes, or deployment.
