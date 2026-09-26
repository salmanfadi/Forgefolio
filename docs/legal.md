# SkillPath — Legal & Compliance Guide

**Jurisdiction:** India (primary)  
**Applicable Laws:** DPDPA 2023 + DPDP Rules 2025 · IT Act 2000 · IT Rules 2021  
**Audience:** Developers, product team, and any AI agent building features for this platform  
**Last Reviewed:** June 2026

> **Disclaimer:** This document is an internal compliance reference, not legal advice. The DPDPA 2023 is being enforced in phases (full enforcement by May 13, 2027). Consult a qualified Indian law practitioner before launch and when major features ship.

---

## Part 1 — The Laws That Apply to SkillPath

### 1.1 Digital Personal Data Protection Act, 2023 (DPDPA) + DPDP Rules 2025

The **most important law** governing this platform. Enacted August 11, 2023. DPDP Rules notified November 13, 2025. Full enforcement by **May 13, 2027**, but the Data Protection Board (DPB) is already active and organisations are expected to build toward compliance now.

**What it governs:** The collection, storage, processing, and transfer of any digital personal data of Indian residents. Applies to SkillPath because:
- Users are Indian residents.
- Data is collected digitally (registration, OAuth, progress tracking).
- The platform processes data on behalf of users for a defined purpose.

**Key terms:**
- **Data Principal:** The individual whose data is collected. On SkillPath, this is every learner, mentor, and working professional.
- **Data Fiduciary:** The entity that determines the purpose and means of processing. SkillPath (as a legal entity) is the Data Fiduciary.
- **Data Processor:** Any third party processing data on SkillPath's behalf (e.g., Resend for email, Anthropic API for AI analysis). SkillPath must contractually bind data processors to comply.

---

### 1.2 Information Technology Act, 2000 (IT Act)

Governs electronic commerce, cybercrime, and digital records in India. Key provisions:
- **Section 43:** Civil liability for unauthorised access or damage to computer systems.
- **Section 66:** Criminal penalty for computer-related offences (hacking, data theft).
- **Section 72:** Breach of confidentiality — applies to misuse of user data by platform employees.
- **Section 79:** Intermediary liability — SkillPath qualifies as an **intermediary** because it hosts user-generated content (roadmap contributions, project submissions, mentor feedback). This section provides safe harbour protection under conditions described in Section 1.3 below.

---

### 1.3 IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021

Delegated legislation under the IT Act. Defines due-diligence obligations for intermediaries. Key obligations:

- Publish Terms of Use and Privacy Policy in English.
- Periodically inform users of the rules (at least once every three months).
- Appoint a **Grievance Officer** resident in India to handle user complaints.
- Acknowledge complaints within **24 hours**; resolve them within **15 days**.
- Remove unlawful content **within 36 hours** of receiving a valid government/court order.
- Preserve removed content and related data for **180 days**.
- Assist law enforcement with required information within **72 hours** of a lawful request.

> SkillPath is not a Significant Social Media Intermediary (SSMI) until it reaches 5 million registered Indian users. Below that threshold, the more burdensome SSMI obligations (Chief Compliance Officer, monthly transparency reports, etc.) do not apply.

---

## Part 2 — Consent Requirements (DPDPA Section 6)

This is the most operationally demanding requirement. Every agent building features must understand this.

### 2.1 The Standard

Consent must be:
- **Free** — no coercion or bundled consent for unrelated purposes.
- **Specific** — tied to an exact, described purpose. One consent cannot cover unrelated uses.
- **Informed** — the user must understand what data is collected and why, in plain language.
- **Unconditional** — consent cannot be made a condition of service unless the data is strictly necessary for that service.
- **Unambiguous** — must be an affirmative act. Pre-ticked boxes are prohibited.

### 2.2 What This Means for SkillPath Features

| Feature | Data Collected | Consent Required? | Notes |
|---|---|---|---|
| Account registration | Email, name, avatar | Yes — at registration | Purpose: account creation and platform services |
| GitHub OAuth | GitHub profile, public repos, commit history | Yes — explicit at connection | Purpose: skill verification. User can disconnect at any time |
| LeetCode username | Problem-solving stats (public API) | Yes — at submission | Purpose: employability score computation |
| LinkedIn OAuth (V2) | Name, employer, designation | Yes — at professional registration | Purpose: identity verification. Scope limited to what LinkedIn allows |
| Roadmap progress | Steps completed, timestamps | Bundled with registration consent | Necessary for core service |
| Employability score | Computed from above inputs | Bundled with registration consent | Explain in privacy notice that score is derived |
| Contact form email relay | Message content from professional | Learner consented at registration; professional consents at message send | Learner email never shown to professional |
| AI analysis of GitHub repos | Code structure, commit history | Bundled with verification consent | Must mention third-party AI processor (Anthropic) |
| Cookies | Session, preferences | Opt-in banner required | No analytics cookies without consent |

### 2.3 How to Implement Consent

**At Registration:**
```
Show a clear consent notice BEFORE creating an account:

"By creating an account, you allow SkillPath to:
- Store your name and email address to manage your account
- Track your roadmap progress to show you your learning journey
- Compute an Employability Score using your learning activity
- Contact you with platform notifications (you can unsubscribe anytime)

We will not sell your data or share it with advertisers.
[Read our full Privacy Policy]

[ ] I agree to the above  ← must be un-ticked by default, affirmative act required"
```

**At GitHub Connection:**
```
"Connecting your GitHub account lets SkillPath:
- Analyse your public repositories to verify your coding skills
- Include your GitHub activity in your Employability Score
- Your code is processed by an AI system (Anthropic Claude) for analysis

[ ] I agree to connect my GitHub account for skill verification"
```

**At Contact Form (V2) — Professional side:**
```
"By submitting this message, you confirm:
- You are a genuine employed professional
- You will not use this form for unsolicited commercial messages
- Your name, company, and role will be included in the email sent to the learner"
```

### 2.4 Consent Records

The platform MUST store proof of consent. Create a `ConsentRecord` table:

```prisma
model ConsentRecord {
  id          String   @id @default(cuid())
  userId      String
  purpose     String   // 'account_registration' | 'github_connection' | 'leetcode_connection' | 'contact_form'
  consentedAt DateTime @default(now())
  ipAddress   String   // Hashed — not stored in plaintext
  userAgent   String
  version     String   // Version of the privacy policy shown at time of consent

  @@index([userId])
}
```

Why: Under DPDPA Section 6(10), if a dispute arises, the **Data Fiduciary must prove** that notice was given and consent was obtained. Records are the evidence.

---

## Part 3 — Data Principal Rights (DPDPA Chapter III)

Users have the following rights under the DPDPA. Every right must be exercisable from within the platform settings.

| Right | What It Means for SkillPath | Implementation |
|---|---|---|
| **Right to access** | User can request a summary of all personal data held and how it is being used | "Download my data" button → exports JSON of all user records |
| **Right to correction** | User can correct inaccurate personal data | Profile edit page for name, bio, etc. |
| **Right to erasure** | User can request deletion of all personal data | Account deletion flow — see Section 4 |
| **Right to grievance redressal** | User can raise a complaint about data handling | Grievance Officer contact published on platform |
| **Right to nominate** | User can nominate someone to exercise rights on their behalf in case of death/incapacity | Optional nomination form in settings (can be V2) |
| **Right to withdraw consent** | User can withdraw consent at any time; withdrawal cannot be punished | Disconnect GitHub/LeetCode independently; account deletion |

---

## Part 4 — Data Erasure (Right to Be Forgotten)

### 4.1 What Must Be Deleted

When a user requests account deletion, the following must be permanently erased:

- `User` record (all fields including email, name, OAuth IDs)
- All `UserProgress` records
- All `UserSkill` records
- All `Project` records
- `EmployabilityScore` record
- All `UserBadge` records
- All `Streak` records
- All `ConsentRecord` records
- `WorkingProfessional` record (V2)
- All `ContactMessage` records where this user is the professional (V2)

### 4.2 What May Be Retained

- `VerificationRequest` records for audit/legal purposes — but **pseudonymised**: replace `learnerId` with an anonymous ID, remove all personal data, retain only the verification outcome and timestamp. Retain for 3 years.
- `MentorFeedback` with the personal identifier removed. Retain for 3 years.
- `ContactMessage` records where the user is the learner (i.e., they received messages) — **anonymised**: remove `learnerId`, retain professional's ID and spam flag for anti-abuse purposes for 6 months.
- `RoadmapContribution` — the contribution content can be retained (it is public community content) but the `userId` must be anonymised.

### 4.3 Timeline

- Platform must **acknowledge** the deletion request immediately (in-app + email confirmation).
- Erasure must be completed within **72 hours**.
- Third-party processors (Resend, Anthropic) must also delete data — check contractual deletion obligations in their DPAs.

### 4.4 Implementation Notes

```typescript
// Deletion must be a transaction across all affected tables.
// Prisma cascade deletes handle most relations if configured correctly.
// The anonymisation step for retained records must be explicit.

async function deleteUserAccount(userId: string) {
  await prisma.$transaction([
    prisma.userProgress.deleteMany({ where: { userId } }),
    prisma.userSkill.deleteMany({ where: { userId } }),
    prisma.project.deleteMany({ where: { userId } }),
    prisma.employabilityScore.delete({ where: { userId } }),
    prisma.userBadge.deleteMany({ where: { userId } }),
    prisma.streak.deleteMany({ where: { userId } }),
    prisma.consentRecord.deleteMany({ where: { userId } }),
    // Anonymise retained records
    prisma.verificationRequest.updateMany({
      where: { learnerId: userId },
      data: { learnerId: 'DELETED_' + cuid() }
    }),
    prisma.roadmapContribution.updateMany({
      where: { userId },
      data: { userId: 'DELETED_' + cuid() }
    }),
    // Delete the user last
    prisma.user.delete({ where: { id: userId } }),
  ])
}
```

---

## Part 5 — Children's Data (DPDPA Section 9)

This section is **non-negotiable**. Penalties for violations involving children's data reach **₹200 crore**.

### 5.1 Definition

Under the DPDPA, a **child is any individual under 18 years of age**. This is significantly stricter than GDPR (16) and US COPPA (13).

### 5.2 Obligations

1. **No processing before verifiable parental consent** — A child's personal data cannot be processed at all until a parent or lawful guardian has given verifiable consent. A simple checkbox saying "I am over 18" is not sufficient.

2. **No behavioural tracking of children** — Behavioural monitoring, interest profiling, cross-session tracking are all prohibited for users identified as under 18.

3. **No targeted advertising to children** — Any form of interest-based or demographic advertising directed at under-18 users is prohibited.

4. **Processing must not be detrimental to children's wellbeing** — Including exploitative gamification designed to maximise engagement at the expense of the child's interests.

### 5.3 SkillPath's Approach

SkillPath's target audience is graduates and job seekers, who in most cases will be 18+. However, the law requires a hard gate — you cannot assume.

**Implementation:**

At registration, before any data is collected:

```
Step 1: Age gate
"Are you 18 years of age or older?"
[ Yes, I am 18 or older ]   [ No, I am under 18 ]

If "No" is selected:
→ Platform must obtain verifiable parental consent before account creation.
→ In V1: Hard block with a message: "SkillPath currently requires users to be 18 or older.
  We are working on a verified parental consent flow. Please ask a parent or guardian
  to contact us at minors@skillpath.dev"
→ In V2: Implement a verifiable parental consent flow using Aadhaar OTP or DigiLocker
  for parent identity verification (see DPDP Rules 2025 Rule 10).
```

Self-declaration is not verified at V1 launch. The platform must clearly state in its Terms that accounts are for individuals 18+ and that providing false age information violates the Terms. This does not fully satisfy the DPDPA's intent, but is acceptable as a transitional measure while a proper verification flow is built, given the law's phased enforcement timeline (full compliance by May 2027).

---

## Part 6 — Privacy Notice Requirements (DPDPA Section 5 + DPDP Rules 2025)

The platform must publish a **Privacy Policy** that meets these specific requirements:

1. Written in **clear and plain language** (not legalese).
2. Must be available in English (and optionally in any of the 22 languages in the Eighth Schedule of the Constitution — not required at V1).
3. Must specify:
   - What personal data is collected
   - The **exact purpose** for each data element
   - How users can **withdraw consent** (specific link to the withdrawal mechanism)
   - How users can **exercise their rights** (access, correction, erasure)
   - How to **file a complaint** with the Data Protection Board
   - **Contact details of the Grievance Officer**
4. Must be presented as a standalone, independently understandable document.
5. Must be shown at the point of consent — linking to it is not sufficient. The summary must be inline.

### 6.1 Minimum Privacy Policy Sections

```
1. Who we are (SkillPath / legal entity name, registered address)
2. What data we collect and why (one row per data type + purpose)
3. How we use your data
4. Who we share your data with (name each processor: Resend, Anthropic, etc.)
5. How long we keep your data (retention periods per data type)
6. Your rights under the DPDPA 2023 (access, correction, erasure, withdrawal, nomination, grievance)
7. How to exercise your rights (specific links/forms)
8. Cookies (types used, purpose, how to opt out)
9. Changes to this policy (how we notify users)
10. How to contact us / Grievance Officer details
11. How to file a complaint with the Data Protection Board of India
```

---

## Part 7 — Intermediary Obligations (IT Rules 2021)

SkillPath hosts user-generated content: roadmap contributions, project descriptions, mentor feedback, professional contact messages. This makes it an **intermediary** under the IT Act.

### 7.1 Safe Harbour (Section 79)

SkillPath is protected from liability for user-generated content **if and only if** it:
1. Does not initiate or modify the content.
2. Observes due diligence under the IT Rules 2021.
3. Removes unlawful content promptly upon a valid court order or government notice.

### 7.2 Mandatory Due Diligence

**Terms of Use must prohibit users from posting content that:**
- Is defamatory, obscene, or pornographic
- Threatens national security or public order
- Infringes intellectual property rights
- Contains malware or harmful code
- Constitutes impersonation or fraud
- Harasses or threatens other users

**Grievance Officer:**
- A named individual, resident in India, must be designated as Grievance Officer.
- Their name and contact details (email + postal address) must be published on the platform.
- They must acknowledge complaints within **24 hours**.
- They must resolve complaints within **15 days**.
- A Grievance Officer can be a founder or employee. It does not need to be a lawyer.

**Content Removal:**
- Upon receiving a valid court order or government notification: remove or disable access to the content within **36 hours**.
- Preserve the removed content and all related data for **180 days** (for potential legal proceedings).
- Do not destroy evidence while processing the order.

**User Reporting:**
- Platform must have a working report/flag mechanism on all user-generated content.
- Reports from users alone do not trigger mandatory removal (per *Shreya Singhal v. Union of India*, 2015 — actual knowledge requiring action arises only from a court order or official government notification, not private complaints). However, platform should have an internal abuse review process.

### 7.3 Quarterly User Notification

The IT Rules 2021 require intermediaries to inform users of their rules and privacy policy **at least once every three months**. Implementation:

```
Options (all acceptable):
- In-app notification banner on login (every 90 days): "Reminder: Review our [Terms of Use] and [Privacy Policy]"
- Email digest that includes a reminder link
- Footer notice: "Our policies were last updated on [date]. [Review]"
```

---

## Part 8 — Data Security Obligations (DPDPA Section 8)

The DPDPA requires Data Fiduciaries to implement "reasonable security safeguards" to prevent breaches. The DPDP Rules 2025 clarify that reasonable safeguards include technical and organisational measures.

### 8.1 Required Technical Measures

| Measure | Requirement |
|---|---|
| Encryption in transit | TLS 1.3 on all connections |
| Encryption at rest | AES-256 for stored OAuth tokens, sensitive fields |
| Access control | Role-based access to production DB and logs |
| Authentication | MFA required for admin accounts and production systems |
| Vulnerability management | Regular dependency audits (`pnpm audit`); penetration test before V1 launch |
| Incident detection | Error monitoring (Sentry or similar); anomaly alerting on login failures |
| Backup | Automated daily DB backups; tested restore procedure |

### 8.2 Breach Notification

Under the DPDPA, a data breach must be reported to the Data Protection Board **"without delay"** (DPDP Rules 2025 require a specific timeline — monitor for rule clarification). In practice, treat this as within **72 hours** of discovery.

**Breach notification must include:**
- Nature of the breach
- Categories and approximate number of data principals affected
- Approximate number of records affected
- Likely consequences
- Measures taken or proposed to address the breach

**Post-notification:** Depending on the severity, notify affected data principals (users) as well.

**Document the breach response plan now** — do not wait for an incident.

---

## Part 9 — Data Processors (Third-Party Services)

SkillPath must ensure all data processors are contractually bound to comply with the DPDPA. Check each service's Data Processing Agreement (DPA):

| Processor | Data Processed | Action Required |
|---|---|---|
| Anthropic (Claude API) | GitHub repo content, code snippets sent for analysis | Review Anthropic's DPA; ensure no training on submitted data; add processor clause to platform's privacy policy |
| Resend | User email addresses (for dispatch only) | Sign Resend's DPA; confirm they do not retain email content |
| Neon/Supabase (DB) | All user data | Sign their DPA; confirm data stored in India or under adequate transfer mechanism |
| Upstash (Redis) | Job queue data (may include user IDs) | Sign their DPA |
| Vercel | HTTP request logs (may contain user IPs) | Sign Vercel's DPA |
| Cloudflare R2 | Profile images, screenshots | Sign Cloudflare's DPA |
| LinkedIn (V2) | Name, employer, designation via OAuth | Use only the data scope granted; do not store LinkedIn profile data beyond what is needed for verification |

### Cross-Border Data Transfers

The DPDPA restricts transfer of personal data outside India. The Government will notify which countries are permitted. Until that notification:
- Prefer services with India data residency (or at minimum, contractual guarantees).
- Review each processor's data residency offering.
- Anthropic's API: data is processed in the US. This will require a valid transfer mechanism once the Government notifies transfer rules. Monitor this closely.

---

## Part 10 — The Referral Circle (V2) — Specific Legal Considerations

The Referral Circle introduces additional legal complexity because it creates a data-sharing bridge between learners and working professionals.

### 10.1 Learner Consent for Directory Inclusion

A learner's profile appearing in the public directory is **opt-in only**. The consent must be specific:

```
"Make my profile visible in the SkillPath professional directory.
This means working professionals who have verified their LinkedIn employment
can view my Employability Score, verified skills, and projects, and can send
me a message via SkillPath's contact form. Your email address will never be
shared with professionals.

[ ] Yes, I want to appear in the directory
```

This consent must be recorded in `ConsentRecord` with purpose `'directory_listing'`.

### 10.2 Professional Contact — Legal Basis

The contact form relay is lawful under the DPDPA because:
- The learner has specifically consented to being contacted through the directory opt-in.
- The platform acts as a relay — the professional never receives the learner's email.
- The professional has separately consented to the terms of use, which prohibit harassment and spam.

### 10.3 Anti-Harassment Obligations

The platform has an obligation under the IT Rules 2021 to prevent harassment on its platform. The contact form must:
- Enforce the 5-message-per-day rate limit.
- Allow learners to block professionals.
- Allow learners to report spam — 3 reports trigger admin review.
- Admin must be able to revoke professional access for abuse.
- Terms of Use must explicitly prohibit use of the contact form for unsolicited commercial messages, threats, or harassment, with account termination as a consequence.

### 10.4 LinkedIn Data Handling

- Only use LinkedIn OAuth data for the specific purpose of verifying employment status.
- Do not retain LinkedIn access tokens beyond the verification step.
- Store only: LinkedIn profile URL, company name, designation, and verification timestamp.
- Do not scrape, crawl, or access LinkedIn data beyond what the OAuth scope grants.
- LinkedIn's Terms of Service prohibit using their API for recruitment platforms without a Recruiter API agreement — SkillPath is **not** a recruitment platform; it is a skill verification platform. Ensure the use case is clearly described in the LinkedIn OAuth application.

---

## Part 11 — Key Compliance Dates

| Date | Milestone |
|---|---|
| August 11, 2023 | DPDPA enacted |
| November 13, 2025 | DPDP Rules 2025 notified; Data Protection Board established |
| November 13, 2026 | Consent manager registration provisions come into force |
| **May 13, 2027** | **All substantive DPDPA provisions, including consent, rights, and security requirements, come into full force** |

SkillPath must be **fully compliant by May 13, 2027**. Given the V1 target launch is 2026, build compliant from day one rather than retrofitting.

---

## Part 12 — Quick Reference for Developers

Rules that must be checked on every feature that touches user data:

1. **Are you collecting new personal data?** → Does the registration consent notice cover this purpose? If not, add a specific consent at the point of collection.

2. **Are you sending data to a new third-party service?** → Check if that service has a DPA. Add them to the Privacy Policy's processor list.

3. **Are you building a new API endpoint that returns user data?** → Ensure it never returns email addresses or OAuth tokens. Ensure it is protected by auth middleware.

4. **Are you adding a new user-generated content feature?** → Ensure the Terms of Use prohibit the relevant misuse cases. Ensure the Grievance Officer can action reports on this content type.

5. **Are you building anything involving users who might be under 18?** → Stop and re-read Part 5 before proceeding.

6. **Are you storing any new type of personal data?** → Add it to the data map (request this via the `data-map` GitHub label) and ensure it is covered by the deletion flow.

7. **Are you adding an analytics or tracking script?** → Cookie consent opt-in must cover it. Ensure no analytics run before consent.

8. **Breach happens — what do you do?** → Notify the CTO immediately. Report to the Data Protection Board without delay. Assess whether users need to be notified.
