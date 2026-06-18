# Risk Register — Multi-Stage Approval Automation System

## Risk Register Summary

| Category | Count | High Severity | Medium Severity | Low Severity |
|----------|-------|--------------|-----------------|--------------|
| Technical Risks | 6 | 2 | 3 | 1 |
| Business Risks | 7 | 3 | 3 | 1 |
| Operational Risks | 5 | 2 | 2 | 1 |
| Compliance Risks | 3 | 1 | 2 | 0 |
| **Total** | **21** | **8** | **10** | **3** |

---

## 1. Technical Risks

### RISK-T001: Approval Flow Race Conditions

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T001 |
| **Category** | Technical |
| **Severity** | **HIGH** |
| **Probability** | Medium (30%) |
| **Impact** | High — Two approvers in a parallel stage responding simultaneously could corrupt stage records or cause duplicate processing. |

**Description:**
In parallel approval scenarios, multiple approvers may respond within seconds of each other. Power Automate flows triggered by Dataverse row updates may execute concurrently, leading to race conditions where: (a) both responses are processed as the "deciding" vote, (b) the request incorrectly advances or rejects, or (c) duplicate audit entries are created.

**Mitigation Strategies:**
1. Implement optimistic concurrency control using Dataverse row versioning (RowVersion property)
2. Use Power Automate's "Configure run after" to sequence dependent actions
3. Add a "processing lock" field to stage records — set to true at start of response flow, check before processing
4. Implement idempotency keys for all approval actions (same action ID = same outcome, processed once)
5. Use child flows for critical sections to enforce sequential execution
6. Add post-processing validation: after parallel stage completes, re-query all stage responses to verify correct tally

**Contingency Plan:**
If race conditions persist, implement a queue-based architecture where all approval responses are written to a queue table first, then processed sequentially by a single polling flow.

**Owner:** Integration Architect
**Review Date:** Weekly during testing phase

---

### RISK-T002: Email Deliverability and Actionable Message Support

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T002 |
| **Category** | Technical |
| **Severity** | **HIGH** |
| **Probability** | Medium (35%) |
| **Impact** | High — Approval notifications landing in spam or actionable messages not rendering prevents approvers from acting on requests. |

**Description:**
Outlook actionable messages require specific registration with Microsoft and correct originator verification. If not configured properly, approval emails may: (a) land in Junk/Spam folders, (b) show action buttons that don't work, (c) not render adaptive cards at all. Additionally, some email clients (mobile Gmail, Apple Mail) don't support actionable messages.

**Mitigation Strategies:**
1. Register the actionable message originator in Microsoft 365 admin center
2. Implement DKIM, DMARC, and SPF records for the sending domain
3. Design fallback: every email includes a direct link to the Approval Center app
4. Send parallel Teams notifications (not dependent on email delivery)
5. Test actionable messages across clients: Outlook desktop, Outlook web, Outlook mobile, Outlook Mac
6. Monitor email delivery metrics via Exchange Online Message Trace
7. Whitelist sending address in organizational spam filters
8. Provide approvers with an "Approval Center" bookmark that doesn't depend on email links

**Contingency Plan:**
If email deliverability issues persist, switch to Teams-first notification strategy with email as backup only. Ensure all approvers have Teams installed and notifications enabled.

**Owner:** Exchange Administrator
**Review Date:** Weekly during pilot

---

### RISK-T003: Org Chart Resolution Failures

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T003 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | Medium (30%) |
| **Impact** | Medium — Approval requests cannot be routed if manager information is missing or incorrect in Azure AD. |

**Description:**
The approval system depends on accurate manager information in Azure AD/Microsoft Graph. Common issues: (a) employee has no manager set, (b) manager field points to someone who left, (c) matrix organizations where "manager" doesn't equal "approval authority", (d) contractors/external users not in Azure AD.

**Mitigation Strategies:**
1. Pre-deployment audit: scan all users for missing manager fields, report to HR for correction
2. Build fallback logic: if manager not found, route to department head from appr_org_chart table
3. Allow manual approver override in admin app for edge cases
4. Maintain a local appr_org_chart table in Dataverse as cache/fallback (synced from Azure AD nightly)
5. Handle external requesters: use a "submitted on behalf of" field with internal sponsor
6. Build an admin dashboard showing org chart coverage and gaps

**Contingency Plan:**
If org chart data quality cannot be improved, switch to explicit approver assignment (stored in Dataverse lookup tables) rather than dynamic manager resolution.

**Owner:** Azure AD Administrator + HR Systems
**Review Date:** Pre-deployment and monthly

---

### RISK-T004: Flow Timeout on Long Approval Chains

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T004 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | Low (20%) |
| **Impact** | Medium — Cloud flows have a 30-day timeout limit. Serial approval chains that take weeks could exceed this. |

**Description:**
Power Automate cloud flows timeout after 30 days. For serial approval chains with 5+ stages, each potentially taking several days, the total flow execution time could approach the 30-day limit. If a flow times out, the approval state becomes inconsistent.

**Mitigation Strategies:**
1. Design flows as state machines, not long-running sequential flows
2. Use Dataverse as the state store — each stage completion triggers a new flow instance
3. Break chains into per-stage flows: Stage N completion triggers Stage N+1 creation
4. Never use "Wait for approval" actions inside a single flow for multi-stage chains
5. Implement a "state polling" pattern: scheduled flow checks request state and advances as needed
6. Monitor flow run durations and alert if approaching timeout

**Contingency Plan:**
If timeout issues occur, refactor to fully event-driven architecture where no single flow runs longer than the processing of one stage.

**Owner:** Power Automate Architect
**Review Date:** Architecture review and monthly

---

### RISK-T005: Power Platform API Throttling

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T005 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | Medium (25%) |
| **Impact** | Medium — Approval processing slows down or fails during peak usage periods. |

**Description:**
At 500+ approvals per day with multiple flows per approval (router, notifications, reminders, escalations), the system may hit Power Platform API throttling limits. Dataverse has per-connection limits (typically 6,000 requests per 5 minutes).

**Mitigation Strategies:**
1. Use Service Principal authentication for flows (higher API limits than per-user)
2. Batch operations where possible (bulk create stage records)
3. Implement retry policies with exponential backoff on all connectors
4. Monitor API consumption in Power Platform Admin Center
5. Use Dataverse bulk API for large operations
6. Cache frequently accessed configuration data in variables
7. Schedule non-urgent flows (analytics sync) during off-peak hours

**Owner:** Power Platform Administrator
**Review Date:** Weekly during rollout

---

### RISK-T006: Teams Adaptive Card Compatibility

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T006 |
| **Category** | Technical |
| **Severity** | Low |
| **Probability** | Medium (25%) |
| **Impact** | Low — Adaptive cards may render differently across Teams clients. |

**Description:**
Teams adaptive cards render differently across platforms: desktop, web, iOS, Android. Action buttons may not work consistently, and card layouts may break on mobile. This affects the approval experience for mobile users.

**Mitigation Strategies:**
1. Use Adaptive Cards schema 1.5 (widely supported)
2. Test cards on all platforms before deployment
3. Use fallback text for unsupported actions
4. Keep card designs simple — avoid complex layouts
5. Provide "View in App" fallback button on every card
6. Use Universal Actions for consistent cross-platform behavior

**Owner:** Power Apps Developer
**Review Date:** Per release

---

## 2. Business Risks

### RISK-B001: Approval Bottleneck — Overloaded Approvers

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B001 |
| **Category** | Business |
| **Severity** | **HIGH** |
| **Probability** | High (55%) |
| **Impact** | Critical — If approvers receive too many requests or lack time to process them, approval times will not improve and user adoption will suffer. |

**Description:**
In the current state, approvers receive approval requests via email and often ignore them or process them in batches. The new system sends more visible notifications and tracks response times, but if approvers are overloaded (some managers have 20+ pending approvals), SLA breaches will be common.

**Mitigation Strategies:**
1. Pre-deployment analysis: identify approvers with highest volume, redesign chains to distribute load
2. Implement workload balancing: alert managers when team members have >10 pending approvals
3. Enable reassign functionality so managers can redistribute approvals
4. Implement approval thresholds so low-value requests don't reach senior approvers
5. Gamification: show approver response time leaderboards (opt-in)
6. Executive mandate: communicate that approval responsiveness is a performance metric
7. Provide mobile approval options so approvers can act while away from desk

**Contingency Plan:**
If bottlenecks persist with specific approvers, implement automatic reassignment rules that trigger after 48 hours, routing to their delegates or backup approvers.

**Owner:** Department Managers + Change Management Lead
**Review Date:** Daily during first month

---

### RISK-B002: Change Management and User Adoption

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B002 |
| **Category** | Business |
| **Severity** | **HIGH** |
| **Probability** | High (50%) |
| **Impact** | High — If employees and approvers don't use the new system, the investment is wasted and dual processes create confusion. |

**Description:**
The organization has ingrained habits: employees email their managers for approvals, managers approve via email replies. Changing this behavior requires significant change management effort. Resistance will come from: (a) employees who find the new app more complex than email, (b) senior leaders who don't want to learn a new tool, (c) departments with "the way we've always done it" mentality.

**Mitigation Strategies:**
1. Executive sponsor mandate: C-level announcement that all approvals must use the new system
2. Department-by-department rollout starting with most enthusiastic team
3. In-person training: 30-minute sessions per department
4. Super-user program: identify 1-2 champions per department
5. Make it easier than email: one-click approve from Outlook, Teams notifications
6. Communicate WIIFM (What's In It For Me): requesters get visibility, approvers get organized inbox
7. Deprecate old email approval addresses after 60-day transition
8. Help desk ready with FAQ and quick-start guides
9. Measure and celebrate early wins: "Finance reduced approval time from 8 days to 2 days!"

**Contingency Plan:**
If adoption stalls, enforce by disabling old approval email addresses and requiring the new system for all approvals. Integrate with payroll/ERP so that only system-approved requests are processed.

**Owner:** Change Management Lead + HR
**Review Date:** Weekly for first 8 weeks

---

### RISK-B003: Delegation Loops

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B003 |
| **Category** | Business |
| **Severity** | **HIGH** |
| **Probability** | Low (15%) |
| **Impact** | High — If A delegates to B, and B delegates to C, and C delegates back to A, an infinite loop is created. |

**Description:**
Delegation loops occur when circular delegation relationships are configured: Employee A delegates to B, B delegates to C, and C delegates to A (or back to B). The system could route a request indefinitely between these delegates.

**Mitigation Strategies:**
1. Loop detection algorithm: before applying delegation, trace the full delegation chain, max depth = 3
2. If loop detected: escalate to skip-level manager instead
3. Admin validation: when user configures delegation, system warns if it creates a loop
4. Maximum delegation depth: hard limit of 3 hops
5. Audit log: full delegation chain logged for troubleshooting
6. Weekly report: show all active delegation chains to admin

**Contingency Plan:**
If loop detection fails, implement a global "max processing attempts" counter (e.g., 10) on each request. If exceeded, route to admin queue.

**Owner:** System Administrator
**Review Date:** Weekly

---

### RISK-B004: Matrix Organization Routing Complexity

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B004 |
| **Category** | Business |
| **Severity** | Medium |
| **Probability** | High (60%) |
| **Impact** | Medium — In matrix organizations, an employee may have multiple managers (functional + project), causing routing ambiguity. |

**Description:**
Matrix reporting structures mean employees often have two or more managers. The approval system, which routes through "the manager," needs to know which manager is the correct approver for which type of request. A functional manager should approve HR changes, while a project manager should approve project expenses.

**Mitigation Strategies:**
1. Don't rely solely on Azure AD manager field
2. Maintain appr_org_chart table with approval-type-specific reporting lines
3. Allow approval type configuration to specify which "manager" field to use
4. For matrix orgs: route to primary functional manager by default
5. Provide "manager override" option in request form
6. Admin can configure department-specific routing rules that bypass standard org chart

**Owner:** HR Systems + Solution Architect
**Review Date:** Discovery phase and ongoing

---

### RISK-B005: Approval Authority Disputes

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B005 |
| **Category** | Business |
| **Severity** | Medium |
| **Probability** | Medium (30%) |
| **Impact** | Medium — Disputes over who should approve what can derail the project and create organizational conflict. |

**Description:**
Defining approval chains requires clear authority boundaries. Common disputes: (a) Directors who believe they should approve larger amounts than configured, (b) Department heads who want different routing than standard, (c) Finance wanting more control over procurement approvals. These disputes can delay go-live and create political friction.

**Mitigation Strategies:**
1. Executive sponsor sets authority matrix with C-level sign-off before development
2. Document approval authority in formal policy with legal/HR review
3. Make approval types configurable post-deployment (no code changes)
4. Start with conservative thresholds that can be relaxed later
5. Department-specific approval types for unique needs
6. Monthly review meeting with stakeholders to adjust routing based on real data

**Owner:** Project Sponsor (CFO/COO Office)
**Review Date:** Pre-deployment and monthly

---

### RISK-B006: Existing Approval Process Variability

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B006 |
| **Category** | Business |
| **Severity** | Medium |
| **Probability** | High (65%) |
| **Impact** | Medium — Each department has subtly different approval processes that resist standardization. |

**Description:**
During discovery, the team will find that Finance, HR, Procurement, Legal, and IT each have unique approval processes with different forms, different routing, different terminology, and different exception handling. Standardizing these into a unified system is politically and technically challenging.

**Mitigation Strategies:**
1. During discovery, map ALL existing processes with department SMEs
2. Identify common patterns and design configurable approval types (not one-size-fits-all)
3. Start with the department most similar to the standard model
4. Accept that some department-specific fields and rules are necessary
5. Use the approval type configuration to accommodate variations without code
6. Plan Phase 2 for departments with truly unique needs

**Owner:** Business Analyst + Department SMEs
**Review Date:** Discovery phase

---

### RISK-B007: ROI Not Achieved Due to Partial Rollout

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B007 |
| **Category** | Business |
| **Severity** | Low |
| **Probability** | Medium (30%) |
| **Impact** | Low — If only some departments adopt, overall savings are reduced. |

**Description:**
The business case assumes organization-wide adoption. If only 2-3 departments use the system, the savings in FTE time and cycle time reduction will be proportionally lower.

**Mitigation Strategies:**
1. Executive mandate for all departments
2. Include all departments in discovery and design
3. Department-specific rollout schedules
4. Track adoption metrics per department
5. Celebrate cross-department wins

**Owner:** Project Sponsor
**Review Date:** Monthly

---

## 3. Operational Risks

### RISK-O001: Out-of-Office Detection Failure

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O001 |
| **Category** | Operational |
| **Severity** | **HIGH** |
| **Probability** | Medium (30%) |
| **Impact** | High — If OOF detection fails, approvals sit with absent approvers causing SLA breaches. |

**Description:**
The system depends on Exchange Online integration to detect out-of-office status. This can fail due to: (a) Microsoft Graph API throttling, (b) users not setting OOF in Exchange, (c) API permission issues, (d) sync delays between Exchange and the approval system.

**Mitigation Strategies:**
1. Multiple OOF detection methods: Exchange OOF + shared vacation calendar + manual delegation
2. Graceful degradation: if OOF check fails, proceed with normal routing (don't block)
3. Daily sync of OOF status, not just on-demand
4. Encourage users to set delegation rules in advance (not rely on auto-detection)
5. Admin dashboard showing OOF detection success/failure rate
6. Fallback: if no response in 48 hours, auto-escalate regardless of OOF status

**Contingency Plan:**
If Exchange integration fails entirely, rely on manual delegation rules configured by users and escalation based on response time alone.

**Owner:** Exchange Admin + System Admin
**Review Date:** Daily during pilot

---

### RISK-O002: Holiday Calendar Mismanagement

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O002 |
| **Category** | Operational |
| **Severity** | Medium |
| **Probability** | Medium (35%) |
| **Impact** | Medium — SLA calculations include holidays as business hours, causing incorrect due dates. |

**Description:**
The system calculates SLA due dates based on business hours and must exclude holidays. If the holiday calendar is not maintained (e.g., new holidays added, regional differences not captured), SLA calculations will be wrong, causing premature escalations or missed deadlines.

**Mitigation Strategies:**
1. Maintain holiday calendar in Dataverse (configurable per country/region)
2. Annual review process: HR updates holiday calendar before year start
3. Regional variations: US holidays, UK holidays, etc. as separate calendars
4. Default to conservative calculation: when in doubt, exclude the day
5. Admin notification when holiday calendar is missing or outdated
6. Buffer days: add 1 day to SLA during holiday weeks

**Owner:** HR Admin + System Admin
**Review Date:** Annually and when holidays change

---

### RISK-O003: Approver Turnover and Role Changes

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O003 |
| **Category** | Operational |
| **Severity** | Medium |
| **Probability** | High (50%) |
| **Impact** | Medium — When approvers leave or change roles, pending approvals may be orphaned. |

**Description:**
Managers leave, get promoted, or transfer departments. If a manager with 10 pending approvals leaves the company, those approvals need to be reassigned. The system must handle: (a) disabled Azure AD accounts, (b) manager changes in org chart, (c) department transfers.

**Mitigation Strategies:**
1. Nightly sync of Azure AD user status
2. If approver account disabled: auto-reassign pending stages to their manager
3. If manager changes: only affect NEW requests (don't re-route in-flight)
4. Admin alert when user with pending approvals is disabled
5. Offboarding checklist: HR notifies admin to check for pending approvals
6. Bulk reassign capability in admin app

**Owner:** HR + System Admin
**Review Date:** Weekly

---

### RISK-O004: Configuration Drift

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O004 |
| **Category** | Operational |
| **Severity** | Low |
| **Probability** | Medium (25%) |
| **Impact** | Low — Over time, approval type configurations may diverge from business policy. |

**Description:**
As admins make changes to routing rules, thresholds, and SLAs, the configuration may drift from the originally approved business policy. This creates compliance risk and inconsistent user experiences.

**Mitigation Strategies:**
1. Version control: all config changes logged with who, what, when
2. Change approval: significant changes require manager approval
3. Quarterly configuration audit against business policy
4. Sandbox testing: test all config changes in test environment first
5. Configuration backup: export config monthly for disaster recovery

**Owner:** Approval Admin
**Review Date:** Quarterly

---

## 4. Compliance Risks

### RISK-C001: Segregation of Duties Violation

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-C001 |
| **Category** | Compliance |
| **Severity** | **HIGH** |
| **Probability** | Low (15%) |
| **Impact** | Critical — If an employee can approve their own request or manipulate the approval chain, it creates fraud risk and audit failure. |

**Description:**
The approval system must enforce segregation of duties: a requester cannot approve their own request, and no single person should have end-to-end control over a financial approval. System misconfiguration or security role assignment errors could create these vulnerabilities.

**Mitigation Strategies:**
1. Hard-coded rule: system rejects any attempt to approve own request
2. Security roles: requester role cannot have approve permission
3. Admin actions audited: any override of approver assignment is logged
4. Quarterly segregation of duties audit report
5. Alert when a user has both requester and approver roles for same approval type
6. "Four-eyes" principle: high-value requests (> $100K) require two independent approvals
7. Audit trail: every approval action linked to specific user with timestamp

**Owner:** Compliance Officer + Security Admin
**Review Date:** Quarterly

---

### RISK-C002: Incomplete Audit Trail

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-C002 |
| **Category** | Compliance |
| **Severity** | Medium |
| **Probability** | Low (15%) |
| **Impact** | Medium — Regulatory auditors require complete approval history. Missing audit entries create compliance gaps. |

**Description:**
If flows fail mid-execution or if admin actions bypass the standard audit logging, the audit trail may have gaps. Auditors (internal and external) require proof of every approval decision.

**Mitigation Strategies:**
1. Every flow action logged to appr_audit_log table
2. Admin actions logged separately with higher visibility
3. Audit log table: no delete permissions for ANY role (including system admin)
4. Audit log integrity check: weekly verification of record counts
5. Tamper-evident: store record hash for integrity verification
6. 7-year retention policy with archival to immutable storage
7. Pre-built audit report for external auditors

**Owner:** Compliance Officer
**Review Date:** Monthly

---

### RISK-C003: Data Retention and Privacy

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-C003 |
| **Category** | Compliance |
| **Severity** | Medium |
| **Probability** | Medium (25%) |
| **Impact** | Medium — Approval requests may contain personal data subject to GDPR/privacy regulations. |

**Description:**
Approval requests (especially HR-related) contain personal information: salary changes, disciplinary actions, medical leave requests. This data must be handled in compliance with GDPR, CCPA, and other privacy regulations.

**Mitigation Strategies:**
1. Column-level security on PII fields
2. Data classification tags on approval types (Public, Internal, Confidential, Restricted)
3. Retention policies: HR requests archived after 7 years, general after 3 years
4. Right-to-erasure workflow for GDPR data subject requests
5. Data Processing Addendum with Microsoft covers Dataverse storage
6. Access reviews: quarterly review of who has access to sensitive approval types
7. PII masking in reports and dashboards

**Owner:** Data Protection Officer
**Review Date:** Quarterly

---

## 5. Risk Monitoring & Governance

### 5.1 Risk Review Cadence

| Review Type | Frequency | Participants |
|-------------|-----------|--------------|
| Daily Standup | Daily | Core project team |
| Weekly Risk Review | Weekly | PM + Risk Owners |
| Steering Committee | Bi-weekly | Executive Sponsor |
| Post-Incident Review | Per incident | All stakeholders |

### 5.2 Risk Escalation Matrix

| Severity | Escalation Path | Response Time |
|----------|----------------|---------------|
| Critical | Immediate → Sponsor + CIO | 2 hours |
| High | Same day → PM + Dept Head | 24 hours |
| Medium | Weekly review → Project Team | 1 week |
| Low | Next scheduled review | Next cycle |

### 5.3 Risk Score Calculation

Risk Score = Impact × Probability

| Score | Rating | Action Required |
|-------|--------|----------------|
| 15-25 | Critical | Immediate action + executive escalation |
| 8-14 | High | Active mitigation + weekly monitoring |
| 4-7 | Medium | Planned mitigation + monthly monitoring |
| 1-3 | Low | Accept + periodic review |
