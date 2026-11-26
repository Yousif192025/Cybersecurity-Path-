# C03 — Identity and Academic Linking Design

**Status:** DESIGN BASELINE — NOT READY FOR PRODUCTION  
**Scope:** Phase 3 identity MVP and secure academic account linking  
**Related decisions:** AD-03, AD-04, AD-06, AD-13

---

## 1. Purpose

Define a secure identity and academic-linking design that prevents an account from being linked to another student's academic record based only on an email address, email local-part, student number, or national identifier.

This document is a design specification only. It does not authorize Production SQL, schema changes, Auth configuration changes, or deployment.

## 2. Security objective

An authenticated account must never gain access to an academic profile merely because the account holder:

- Uses an email address whose local-part resembles a student number.
- Knows or submits another person's university/student number.
- Supplies another person's national identifier.
- Controls an email address that happens to match data stored in an academic record.

Possession or knowledge of an identifier is not proof of ownership of the corresponding academic record.

## 3. Identity and entitlement separation

The system must maintain three separate concepts:

1. **Identity:** the authenticated account, represented by the Supabase Auth user ID.
2. **Academic verification:** a separately verified relationship between the authenticated account and an institutional student record.
3. **Entitlements:** permissions granted to the account, such as open learning access, academic enrollment, or paid services.

A successful login does not automatically establish academic verification or paid entitlements.

An academic record must not be linked merely because a user has registered or signed in.

## 4. Prohibited linking methods

The following methods are prohibited as sole proof of academic ownership:

- Matching `auth.users.email` to `user_profile.email`.
- Matching the email local-part to `national_id` or `student_number`.
- Accepting a student number submitted by the user without independent verification.
- Accepting a national identifier submitted by the user without independent verification.
- Automatically assigning an unlinked profile to the first account that submits matching information.
- Allowing a client-side request to set or change `user_profile.user_id`.
- Treating an existing profile row or an email confirmation as proof of academic identity.

The existing `handle_student_linking()` behavior based on email local-part matching must remain blocked from Production use until replaced by an independently verified process.

## 5. Required academic-linking workflow

Academic linking must be initiated by an authenticated account and completed only after independent verification by an authorized institutional process.

The intended workflow is:

1. The user signs in through Supabase Auth.
2. The user requests academic verification.
3. The server creates a pending verification request associated with the authenticated `auth.uid()`.
4. The submitted student identifier is treated as a lookup input, not as proof of ownership.
5. An authorized institutional source or designated verifier independently confirms the student's identity and record ownership.
6. The server validates that the academic record is not already linked to a different account.
7. The server performs the link atomically, recording the verification result and audit metadata.
8. The server returns only the minimum confirmation information required by the user interface.

If independent verification is unavailable, the request must remain pending or be rejected. The system must not fall back to email matching.

## 6. Linking invariants

Any future implementation must enforce all of the following:

- The authenticated account ID is obtained from the verified server-side session, not trusted from a client-supplied user ID.
- A student record can be linked to no more than one Auth user unless a formally approved institutional exception exists.
- An Auth user cannot silently replace an existing academic link.
- A failed, ambiguous, or conflicting verification must not change the existing link.
- The verification decision and link operation must be atomic.
- Concurrent linking attempts must not result in two accounts being linked to the same academic record.
- All successful links, rejected conflicts, and administrative overrides must be auditable.
- Sensitive identifiers must not be exposed in client responses or ordinary application logs.
- Administrative overrides require an authorized server-side process and an audit reason.

## 7. Profile provisioning

`ensure_user_profile()` is defined as a lookup-only operation.

It may return the profile already associated with the authenticated user. It must not:

- Create an academic profile.
- Search for a profile using email local-part matching.
- Claim an unlinked profile based on a submitted identifier.
- Change `user_id`, role, track, student type, or academic verification status.

If no profile is associated with the authenticated user, the operation must return or raise the documented `profile_requires_provisioning` condition.

Profile provisioning and academic linking must be handled by a separate trusted server-side workflow after the required verification.

## 8. Existing trigger and function restrictions

The existing `handle_student_linking()` function and its Auth trigger must not be treated as an approved academic verification mechanism.

Before any future Production change involving them:

- Capture the current function definition and trigger definition.
- Identify all dependent application behavior.
- Design and test a replacement workflow.
- Verify that the replacement cannot link records using email or identifier matching alone.
- Prepare and validate a rollback procedure.

No trigger or function is changed by this document.

## 9. Privacy and data minimization

- Do not return full national identifiers or student numbers to the browser unless strictly required and separately approved.
- Do not place sensitive identifiers in URLs, analytics events, client logs, or error messages.
- Restrict access to verification evidence to authorized server-side roles.
- Retain only the minimum verification evidence required for audit and institutional policy.
- Define retention and deletion rules before implementing a verification evidence store.

## 10. Required future validation

Before Production approval, an isolated non-Production test environment must demonstrate:

1. An account cannot claim another student's record by submitting that student's number.
2. An email local-part match cannot create an academic link.
3. An email address match cannot create an academic link.
4. A record already linked to Account A cannot be linked to Account B.
5. Two concurrent requests cannot claim the same academic record.
6. A failed verification leaves the existing record unchanged.
7. A user cannot change their own academic link through direct table access or client RPC.
8. Only the authorized server-side verification path can complete a link.
9. Audit records identify the operation and decision without unnecessarily exposing sensitive identifiers.
10. The rollback procedure restores the pre-change behavior and data safely.

## 11. Open decisions and blockers

The following decisions and evidence are still required:

- Identify the authoritative institutional source for student verification.
- Define who is authorized to approve or reject academic-linking requests.
- Define the evidence and verification method accepted by the institution.
- Define conflict handling for records already linked to an account.
- Define the audit fields and retention period.
- Confirm the production schema and dependencies before designing executable migrations.
- Produce and validate a complete rollback procedure.

Until these are resolved, academic self-service linking is not approved for Production.

## 12. Scope boundaries

This design does not authorize:

- Production SQL or database changes.
- Changes to Supabase Auth settings.
- Changes to `auth.users`, `user_profile`, functions, or triggers.
- New tables, columns, constraints, policies, or grants.
- Client-side academic linking.
- Paid subscription or payment implementation.
- Changes to public access to open learning content.

## 13. Acceptance status

**C03 status: DESIGN BASELINE — NOT READY FOR PRODUCTION**

C03 may be considered design-complete only after the institutional verification authority and workflow are explicitly approved. Production implementation remains blocked until the required security validation and rollback evidence are available.


## Addendum — Institutional Verification and Safe Linking

Status: DESIGN REQUIREMENT — NOT IMPLEMENTED OR PRODUCTION-APPROVED

### 1. Identity separation

An email address, email local-part, national identifier, student number,
display name, or user-supplied claim is not sufficient proof of academic
identity or ownership of an institutional record.

Account authentication and academic identity verification are separate
processes. Successful email signup must never silently establish student
status, academic affiliation, or institutional entitlement.

### 2. Required independent verification

Academic linking requires an independently verified assertion from an
authoritative institution-controlled source or an explicitly approved
institutional verification process.

Before implementation, the project owner must identify:
- The authoritative institution or verification provider.
- The person or role authorized to approve the integration.
- The exact evidence returned and how its authenticity is validated.
- How the verified institutional subject is bound to the authenticated
  CyberPath account.
- Evidence retention, access restrictions, and deletion requirements.
- Expiry, revocation, transfer, and re-verification behavior.

No provider, endpoint, institutional authority, or verification capability
is assumed to exist until documented and approved.

### 3. Linking state machine

The implementation design must distinguish at least these states:
- UNLINKED: no verified academic identity is associated with the account.
- PENDING: verification has been initiated but not completed.
- VERIFIED: independent verification succeeded and the association is active.
- REJECTED: verification failed or the institution rejected the claim.
- CONFLICT: the institutional identity is already associated with another
  account or the evidence is inconsistent.
- REVOKED: the institution or authorized process invalidated the association.

Only an authorized server-side process may transition an account into
VERIFIED. Clients must not directly set verification state or institutional
identifiers.

### 4. Conflict and recovery rules

- Never resolve conflicts by matching email local-parts or identifiers alone.
- Never silently transfer an institutional identity between accounts.
- Require an independently verified recovery or institutional support process.
- Make verification and linking operations idempotent.
- Record security-relevant outcomes without logging secrets or unnecessary
  personal identity data.
- Define rate limits, expiry, retry, and manual review behavior before launch.

### 5. Existing database function restrictions

The captured handle_student_linking() behavior that matches an email local-part
to national_id must not be used for academic identity verification.

Automatic linking remains disabled in the remediation design until the
independent verification authority and full trigger/function behavior are
approved and tested.

ensure_user_profile() remains lookup-only. It must not create, promote, link,
or verify an academic identity as a side effect.

### 6. Open-learning continuity

Visitors and email-registered independent learners retain access to public
learning content without academic verification.

If no authoritative institutional verification source is available, academic
linking is deferred. The open learning platform and ordinary optional email
registration must continue without claiming verified student status.

### 7. Required validation evidence

- Email signup alone leaves academic status UNLINKED.
- User-supplied national_id or student_number alone cannot establish VERIFIED.
- Forged, expired, replayed, or mismatched verification evidence is rejected.
- A conflict cannot transfer an institutional identity to another account.
- Concurrent and repeated linking requests are safe and idempotent.
- Only the approved server-side verification path can change linking state.
- Revocation and recovery behavior is tested and audited.
- No sensitive institutional evidence is exposed through ordinary profile APIs.

### 8. Decision

Academic identity linking is deferred until an authoritative institutional
verification process is identified, approved, implemented, and independently
validated.

This addendum records design requirements only. It does not authorize SQL,
DDL, DML, GRANT, REVOKE, Auth configuration, or Production changes.
