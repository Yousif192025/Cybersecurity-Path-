# C04 — Functions and Triggers Remediation Plan

**Status:** DESIGN BASELINE — NOT READY FOR PRODUCTION
**Scope:** Phase 3 security remediation for in-scope functions and triggers
**Related decisions:** AD-06, AD-08, AD-13

---

## 1. Purpose

Define the required security behavior, execution permissions, and remediation controls for database functions and triggers relevant to Phase 3.

This document is a design plan only. It does not authorize Production SQL, function replacement, trigger changes, grants, revokes, or deployment.

## 2. Governing principles

All function and trigger remediation must follow these principles:

- Authentication does not imply authorization.
- Client-supplied user IDs must not be trusted as proof of identity.
- Sensitive writes must be performed only through explicitly authorized server-side paths.
- SECURITY DEFINER functions must use a fixed and safe search_path.
- Function ownership and execution privileges must be reviewed before deployment.
- No function may grant academic identity or entitlements based only on email or identifier matching.
- Existing behavior must be captured before any replacement.
- Every proposed change must have a tested rollback procedure.

## 3. Function inventory and intended behavior

### 3.1 ensure_user_profile()

**Target behavior:** Lookup only.

The function may return the profile already associated with the authenticated user.

It must:

- Derive the account ID from the verified authentication context.
- Return only the profile associated with that account.
- Avoid exposing another user's profile.
- Raise or return `profile_requires_provisioning` if no profile exists.

It must not:

- Create a profile.
- Claim an unlinked academic profile.
- Match profiles by email or email local-part.
- Modify `user_id`, role, track, student type, or academic verification status.

Profile provisioning requires a separate trusted server-side workflow.

### 3.2 report_lesson_activity()

**Target behavior:** Limited self-reported progress.

The function may accept authenticated learner activity for the caller's own account.

Required controls:

- Derive the user ID from the verified authentication context.
- Reject attempts to submit progress for another user.
- Accept only values within the approved self-reported range.
- Reject 100% completion when that value is reserved for trusted verification.
- Apply the agreed numeric normalization consistently.
- Prevent unauthorized changes to another user's progress.
- Avoid granting certificates, exam passes, or commercial entitlements.

Self-reported progress is not proof of verified completion.

### 3.3 trust_set_lesson_progress()

**Target behavior:** Trusted server-side progress update.

This function is reserved for an authorized server-side execution path.

Required controls:

- Deny execution to PUBLIC, anon, and authenticated client roles.
- Grant execution only to the approved server-side role.
- Validate user, lesson, and progress inputs.
- Enforce the approved 0–100 range.
- Record sufficient audit information for trusted updates.
- Never expose service_role credentials to browsers or client-side code.

A local `SET ROLE service_role` test is not sufficient evidence of a real server-side integration. The backend execution path must be tested separately in an isolated environment.

## 4. Function execution privilege matrix

| Function | PUBLIC | anon | authenticated | service_role |
|---|---|---|---|---|
| ensure_user_profile() | Deny | Deny | Allow | Allow |
| report_lesson_activity() | Deny | Deny | Allow | Allow |
| trust_set_lesson_progress() | Deny | Deny | Deny | Allow |

The matrix is the intended target, subject to verification of actual function signatures, ownership, overloads, and effective privileges.

No broad EXECUTE grants may be assumed safe.

## 5. SECURITY DEFINER requirements

For every SECURITY DEFINER function:

1. Use a fixed, explicitly reviewed search_path.
2. Schema-qualify referenced tables and functions where appropriate.
3. Review the function owner and its privileges.
4. Avoid dynamic SQL unless strictly necessary and safely parameterized.
5. Validate all inputs.
6. Derive identity from trusted server-side context.
7. Prevent callers from changing protected ownership, role, or entitlement fields.
8. Review EXECUTE grants for every overload.
9. Verify behavior under anon, authenticated, and service_role contexts.
10. Capture the original function definition and ACL before modification.

A fixed search_path alone does not establish that a SECURITY DEFINER function is safe.

## 6. Trigger inventory and required decisions

### 6.1 handle_student_linking()

**Current concern:** Existing behavior matches academic identifiers to an email local-part and may link an unlinked profile.

**Target decision:** Block this automatic linking mechanism from Production use until an independently verified academic-linking workflow is approved and implemented.

The function must not be considered proof of academic identity.

Any future replacement must follow C03 and must use an authorized institutional verification process.

### 6.2 on_auth_user_created

This trigger is associated with Auth user creation and invokes the existing student-linking behavior.

Before any Production change:

- Capture the exact trigger definition.
- Capture the exact function definition.
- Identify dependencies and application behavior.
- Confirm the replacement or removal strategy.
- Test signup and profile provisioning in isolation.
- Verify that no unverified academic profile is linked.
- Prepare a tested rollback.

No trigger change is authorized by this document.

### 6.3 enroll_student_in_path_courses()

**Current concern:** The trigger function selects a learning path using `NEW.track` with `LIMIT 1`. If multiple rows match, the selected path may be nondeterministic.

Required future decisions:

- Confirm whether automatic enrollment is still a product requirement.
- Confirm the authoritative learning-path selection rule.
- Define behavior when zero or multiple paths match.
- Confirm whether enrollment is academic, open-course following, or another entitlement.
- Ensure that a trigger cannot create unauthorized academic enrollment.
- Test duplicate and concurrent profile creation.

Do not silently preserve ambiguous enrollment behavior during remediation.

### 6.4 log_role_changes()

This function is an audit mechanism, not an authorization control.

Required controls:

- Prevent users from changing their own role through client-accessible paths.
- Ensure role changes occur only through an authorized server-side process.
- Preserve useful audit information.
- Review SECURITY DEFINER ownership and search_path.
- Avoid unnecessarily logging national identifiers or other sensitive data.
- Verify that audit records cannot be modified by ordinary users.

An audit trigger does not prevent privilege escalation by itself.

## 7. Trigger and function change sequence

Any future remediation must follow this sequence:

1. Capture pre-change function definitions, owners, ACLs, trigger definitions, and dependencies.
2. Confirm the approved target behavior for each function.
3. Confirm the approved target behavior for each trigger.
4. Prepare the UP migration.
5. Prepare an executable DOWN migration based on captured pre-change state.
6. Test both migrations in an isolated non-Production environment.
7. Run automated privilege and behavior tests.
8. Run application-level signup, login, and progress smoke tests.
9. Review the evidence and obtain separate Production approval.

Do not combine unrelated trigger changes into one unreviewed operation.

## 8. Required validation

The isolated test suite must demonstrate:

- anon cannot execute restricted functions.
- authenticated can execute only the approved learner-facing functions.
- authenticated cannot execute trust_set_lesson_progress().
- service_role can execute the trusted progress function through an isolated backend path.
- ensure_user_profile() never creates or claims a profile.
- report_lesson_activity() cannot update another user's progress.
- report_lesson_activity() rejects the reserved 100% completion value.
- trust_set_lesson_progress() enforces its approved range.
- email local-part matching cannot link academic profiles.
- Auth signup cannot silently claim an academic record.
- role changes cannot be performed by ordinary authenticated users.
- ambiguous learning-path matches do not produce arbitrary enrollment.
- rollback restores the captured pre-change definitions and trigger behavior.

## 9. Current blockers

The following evidence is still required:

- Exact current definitions and ACLs for all affected functions.
- Exact current definitions and dependencies for affected triggers.
- Approved academic verification authority and workflow.
- Product decision on automatic learning-path enrollment.
- Verified service-side integration path.
- Complete executable rollback with validated pre-change snapshots.
- Successful isolated tests against a schema representative of Production.

## 10. Scope boundaries

This document does not authorize:

- Production SQL execution.
- Function or trigger changes.
- GRANT or REVOKE operations.
- Supabase Auth configuration changes.
- New tables, columns, or constraints.
- Service role credentials in frontend code.
- Changes to public access to open learning content.
- Payment or subscription implementation.

## 11. Acceptance status

**C04 status: DESIGN BASELINE — NOT READY FOR PRODUCTION**

C04 is a planning document. Implementation remains blocked until the function and trigger inventory, target behavior, privilege model, isolated validation, and rollback evidence are complete and separately approved.


## Review Addendum — Complete Function Privilege Inventory

Before implementation, capture and review:

- Every function signature and overload in the affected schemas.
- Function owner, SECURITY DEFINER/INVOKER mode, configuration settings, and exact definition.
- Effective EXECUTE privileges for PUBLIC, anon, authenticated, and service_role.
- Schema USAGE privileges and dependencies required to invoke each function.
- Fixed and safe search_path behavior for SECURITY DEFINER functions.
- Trigger-to-function relationships and all dependent application call paths.

The intended privilege matrix must be tested against actual effective privileges. Testing with SET ROLE alone is not proof of a real authenticated PostgREST or server-side execution path.


## Addendum — Function and Trigger Security Baseline

Status: DESIGN REQUIREMENT — NOT IMPLEMENTED OR PRODUCTION-APPROVED

### 1. Complete function inventory

Before any remediation, inventory every function in the affected schemas,
including every overload and exact identity argument signature.

For each function record:
- Schema, name, identity arguments, return type, and owner.
- SECURITY INVOKER or SECURITY DEFINER mode.
- Function configuration, including search_path.
- Definition hash and reviewed function body.
- Schema USAGE and effective EXECUTE privileges.
- Explicit and inherited grants to PUBLIC, anon, authenticated,
  service_role, and other relevant roles.
- Dependencies, callers, triggers, and application/API entry points.

Do not infer function safety from its name or from one overload.

### 2. SECURITY DEFINER requirements

Every SECURITY DEFINER function must have:
- A fixed, reviewed search_path with trusted schemas only.
- Explicit schema qualification for referenced objects.
- A reviewed and appropriately restricted owner.
- Explicit input validation and authorization checks.
- No reliance on caller-controlled role, email, or identity claims.
- No unsafe dynamic SQL or untrusted object-name interpolation.
- An explicit return shape that does not expose sensitive rows or columns.
- A documented and tested EXECUTE privilege matrix.

A fixed search_path is necessary but is not sufficient by itself.

### 3. Client and server execution boundary

- PUBLIC and anon must not execute privileged identity, role, entitlement,
  or trusted-progress operations.
- authenticated may execute only explicitly approved user-scoped operations.
- service_role access is restricted to trusted server-side execution.
- service_role credentials must never be shipped to browsers, public clients,
  downloadable application bundles, or client-visible logs.
- SET ROLE service_role is not proof of a protected server-side application
  path; validate the actual backend integration and credential boundary.
- Review schema USAGE and function EXECUTE together, including inherited
  privileges and every overload.

### 4. Function-specific decisions

ensure_user_profile():
- Remains lookup-only.
- Must not create, link, verify, promote, or grant an identity.
- Must not return a complete sensitive user_profile row to client callers.
- Missing profile behavior must be explicit and tested.

report_lesson_activity():
- Is self-reported activity, not trusted completion evidence.
- Must derive the user identity from the authenticated server context.
- Must reject invalid lesson references and out-of-range values.
- Must not independently award certificates, exams, paid entitlements,
  or trusted completion status.
- Must have documented concurrency, retry, and idempotency semantics.
- Its return shape must expose only approved progress fields.

trust_set_lesson_progress():
- Is a privileged server-side operation.
- Must not be executable by PUBLIC, anon, or authenticated.
- Must validate caller authorization in the trusted backend path.
- Must validate user, lesson, course relationship, and accepted values.
- Must have audited and idempotent behavior.

handle_student_linking():
- The captured email-local-part to national_id matching behavior is blocked.
- It must not establish academic identity without independent institutional
  verification.
- Its trigger and all callers must be reviewed before replacement or removal.

enroll_student_in_path_courses():
- The captured LIMIT 1 path selection is ambiguous when multiple paths match.
- Define the authoritative selection rule and behavior for zero or multiple
  matches before implementation.
- Review duplicate handling, concurrent signup, retries, and enrollment
  authorization.

log_role_changes():
- Is an audit mechanism, not an authorization mechanism.
- Clients must not be able to grant or change their own roles.
- Only an approved trusted process may change protected role attributes.
- Audit records must be protected against unauthorized alteration.

### 5. Trigger inventory and behavior

Inventory all triggers in scope, including:
- Trigger name, schema, table, timing, event, and enabled state.
- Exact invoked function signature and owner.
- Trigger function security mode and search_path.
- Trigger execution side effects and affected tables.
- Auth signup, profile provisioning, identity linking, and automatic
  enrollment interactions.
- Failure behavior, transaction boundaries, retries, and duplicate events.

Do not assume a trigger is absent from Production because it was missing
from a local snapshot. Obtain authoritative Production catalog evidence
before any future change is proposed.

### 6. Required validation evidence

- Every function overload has a recorded owner, definition, security mode,
  configuration, dependencies, and effective EXECUTE matrix.
- PUBLIC and anon are denied privileged function execution.
- authenticated cannot invoke trusted-progress or protected role operations.
- Actual authenticated API calls are tested with separate identities.
- The real server-side service_role path is verified without exposing secrets.
- SECURITY DEFINER functions resist search_path/object-shadowing attacks.
- Trigger behavior is tested for signup, duplicate events, retries, failures,
  and concurrent operations.
- Function responses do not expose sensitive profile or identity fields.
- Denied operations are followed by evidence that protected state is unchanged.

### 7. Decision

No function or trigger is approved for Production remediation solely from
the current local snapshots or Pack 1 results.

Exact Production definitions, dependencies, ownership, privileges, and
application call paths remain evidence prerequisites.

This addendum records design requirements only. It does not authorize SQL,
DDL, DML, GRANT, REVOKE, Auth configuration, or Production changes.
