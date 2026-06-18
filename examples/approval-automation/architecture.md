# Approval Automation System — Architecture Document

## 1. System Architecture Overview

The Multi-Stage Approval Automation System is built on an event-driven architecture where approval requests flow through a state machine defined in Dataverse and orchestrated by Power Automate. The system is designed for high configurability — new approval types and routing rules can be added by administrators without code changes.

### 1.1 Architecture Diagram (Detailed)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REQUEST INPUT LAYER                                  │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │   Power Apps     │  │  Teams Adaptive  │  │   SharePoint List        │  │
│  │   Canvas App     │  │   Card Submit    │  │   (via Power Automate)   │  │
│  │   (Submit)       │  │   (via Copilot   │  │   (Item creation)        │  │
│  │                  │  │   or Flow bot)   │  │                          │  │
│  │ • Request form   │  │ • Quick submit   │  │ • Auto-created on        │  │
│  │ • Attachments    │  │   from Teams     │  │   item creation          │  │
│  │ • Draft/Save     │  │ • Pre-filled     │  │ • Department-specific    │  │
│  │ • Request list   │  │   templates      │  │   lists                  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └───────────┬──────────────┘  │
│           │                     │                        │                  │
│           └─────────────────────┼────────────────────────┘                  │
│                                 ▼                                           │
│                    ┌──────────────────────┐                                 │
│                    │   Dataverse Request  │                                 │
│                    │   Registry Table     │                                 │
│                    │   (appr_request)     │                                 │
│                    └──────────┬───────────┘                                 │
└───────────────────────────────┼─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROUTING ENGINE LAYER                                 │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              "Approval Router" — Power Automate Cloud Flow           │    │
│  │                                                                     │    │
│  │  [Trigger] New request created in Dataverse                        │    │
│  │       │                                                             │    │
│  │       ▼                                                             │    │
│  │  [Action] Load Approval Type Configuration                         │    │
│  │       │  • Get routing rules for this request type                   │    │
│  │       │  • Get approver assignments                                  │    │
│  │       │  • Get conditional thresholds                                │    │
│  │       ▼                                                             │    │
│  │  [Action] Evaluate Conditional Rules                               │    │
│  │       │  • Amount thresholds ($5K, $50K, $500K)                    │    │
│  │       │  • Department overrides                                      │    │
│  │       │  • Requester level (exec requests skip certain levels)       │    │
│  │       ▼                                                             │    │
│  │  [Action] Resolve Approvers                                        │    │
│  │       │  • Lookup org chart for manager chain                      │    │
│  │       │  • Check delegation rules (out-of-office)                  │    │
│  │       │  • Apply substitution matrix                               │    │
│  │       ▼                                                             │    │
│  │  [Action] Build Approval Chain                                     │    │
│  │       │  • Stage 1: Manager (Serial)                               │    │
│  │       │  • Stage 2: Director (Serial)                              │    │
│  │       │  • Stage 3: Finance + Legal (Parallel)                     │    │
│  │       │  • Stage 4: VP (Serial, conditional >$100K)                │    │
│  │       ▼                                                             │    │
│  │  [Loop] For Each Stage in Approval Chain                           │    │
│  │       │                                                             │    │
│  │       ├──► [If Serial] Send to single approver, wait for response  │    │
│  │       ├──► [If Parallel] Send to all approvers, wait for N of M    │    │
│  │       ├──► [If Conditional] Evaluate rule, skip or include stage   │    │
│  │       │                                                             │    │
│  │       └──► [On Response] Log action, move to next stage            │    │
│  │                                                                     │    │
│  │  [Action] On Final Approval → Update status, notify requester      │    │
│  │  [Action] On Rejection → Stop chain, notify requester, log reason  │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION LAYER                                   │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  Outlook         │  │  Teams           │  │  Power Apps              │  │
│  │  Actionable      │  │  Adaptive        │  │  Approval                │  │
│  │  Messages        │  │  Cards           │  │  Center                  │  │
│  │                  │  │                  │  │                          │  │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌────────────────────┐ │  │
│  │ │ Approve      │ │  │ │ [Approve]    │ │  │ │ Pending Approvals  │ │  │
│  │ │ [Reject]     │ │  │ │ [Reject]     │ │  │ │ Gallery            │ │  │
│  │ │ [Delegate]   │ │  │ │ [Comment]    │ │  │ │ Filter/Sort        │ │  │
│  │ │ [Comment]    │ │  │ │ [ViewDetails]│ │  │ │ Action Buttons     │ │  │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ │ History Timeline   │ │  │
│  │                  │  │                  │  │ │ Delegation Setup   │ │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Reminder & Escalation Engine                   │    │
│  │                                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │    │
│  │  │  Reminder    │  │  Escalation  │  │  Out-of-Office           │ │    │
│  │  │  Service     │  │  Service     │  │  Delegation Service      │ │    │
│  │  │              │  │              │  │                          │ │    │
│  │  │ • Day 1:     │  │ • Day 3:     │  │ • Sync with Exchange     │ │    │
│  │  │   Initial    │  │   Escalate   │  │   OOF calendar           │ │    │
│  │  │   request    │  │   to mgr     │  │ • Detect OOF status      │ │    │
│  │  │ • Day 2:     │  │ • Day 5:     │  │ • Lookup delegate        │ │    │
│  │  │   Reminder   │  │   Escalate   │  │ • Auto-reassign pending  │ │    │
│  │  │ • Day 3:     │  │   to skip-   │  │ • Notify requester of    │ │    │
│  │  │   Final      │  │   level mgr  │  │   delegation             │ │    │
│  │  │   reminder   │  │ • Day 7:     │  │ • Revert on OOF end      │ │    │
│  │  │              │  │   Alert exec │  │                          │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATAVERSE DATA LAYER                                 │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  appr_request    │  │ appr_approval_   │  │  appr_approval_type      │  │
│  │  (Request Header)│  │ stage            │  │  (Configuration)         │  │
│  │                  │  │ (Stage Instances)│  │                          │  │
│  │ • requestid (PK) │  │ • stageid (PK)   │  │ • typeid (PK)            │  │
│  │ • request_type   │  │ • requestid (FK) │  │ • type_name              │  │
│  │ • requester      │  │ • stage_number   │  │ • type_description       │  │
│  │ • title          │  │ • approver       │  │ • routing_rules (JSON)   │  │
│  │ • description    │  │ • stage_type     │  │ • amount_thresholds      │  │
│  │ • amount         │  │ • status         │  │ • sla_hours              │  │
│  │ • department     │  │ • due_date       │  │ • is_active              │  │
│  │ • status         │  │ • responded_date │  │ • department             │  │
│  │ • priority       │  │ • response       │  │ • requires_attachments   │  │
│  │ • current_stage  │  │ • comments       │  │ • parallel_config        │  │
│  │ • submitted_date │  │ • delegatee      │  │ • escalation_rules       │  │
│  │ • completed_date │  │ • escalation_to  │  │ • reminder_schedule      │  │
│  │ • final_decision │  │ • correlation_id │  │ • created_by             │  │
│  │ • correlation_id │  │                  │  │ • modified_date          │  │
│  └────────┬─────────┘  └──────────────────┘  └──────────────────────────┘  │
│           │                                                                  │
│  ┌────────▼─────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  appr_audit_log  │  │ appr_delegation  │  │  appr_org_chart          │  │
│  │  (Audit Trail)   │  │ _rule            │  │  (Reporting Lines)       │  │
│  │                  │  │                  │  │                          │  │
│  │ • auditid (PK)   │  │ • ruleid (PK)    │  │ • entryid (PK)           │  │
│  │ • requestid (FK) │  │ • delegator      │  │ • employee_email         │  │
│  │ • stageid (FK)   │  │ • delegatee      │  │ • manager_email          │  │
│  │ • action         │  │ • start_date     │  │ • department             │  │
│  │ • performed_by   │  │ • end_date       │  │ • job_level              │  │
│  │ • performed_date │  │ • approval_type  │  │ • is_active              │  │
│  │ • old_value      │  │ • is_active      │  │ • skip_level_mgr         │  │
│  │ • new_value      │  │ • auto_from_oof  │  │ • department_head        │  │
│  │ • comments       │  │                  │  │ • vp_email               │  │
│  │ • ip_address     │  │                  │  │                          │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INTEGRATION & ANALYTICS LAYER                           │
│                                                                              │
│  ┌────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐    │
│  │  Power BI          │  │  Azure AD /      │  │  Exchange Online     │    │
│  │  Dashboard         │  │  Microsoft Graph │  │  (OOF Detection)     │    │
│  │                    │  │                  │  │                      │    │
│  │ • Cycle time       │  │ • User lookup    │  │ • Read OOF settings  │    │
│  │ • Bottleneck       │  │ • Manager chain  │  │ • Calendar sync      │    │
│  │   analysis         │  │ • Group lookup   │  │ • OOF event webhook  │    │
│  │ • Approver load    │  │ • User photo     │  │                      │    │
│  │ • Compliance       │  │                  │  │                      │    │
│  │ • SLA tracking     │  │                  │  │                      │    │
│  └────────────────────┘  └──────────────────┘  └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Approval Flow Data Flow

### 2.1 Happy Path — Serial Approval

```
Requester submits request via App
    │
    ▼
┌─────────────────────────┐
│ Dataverse: appr_request │ ◄── Status: "Submitted"
│ record created          │     Current Stage: 1
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Approval Router Flow    │ ◄── Loads approval type config
│ triggered               │     Builds approval chain
└──────────┬──────────────┘
           │
           ├──► Creates Stage 1 record (appr_approval_stage)
           │    Approver: Requester's Manager
           │    Status: "Pending"
           │    Due: Now + SLA hours
           │
           ├──► Sends notification to Approver 1
           │    (Outlook + Teams + Approval Center)
           │
           └──► Sets request status: "Awaiting Approval"
           │
Approver 1 receives notification
    │
    ├──► Views request details in Approval Center
    │
    └──► Clicks "Approve" with optional comment
           │
           ▼
┌─────────────────────────┐
│ Approval Response Flow  │ ◄── Triggered on response
│ processes approval      │
└──────────┬──────────────┘
           │
           ├──► Updates Stage 1: Status="Approved", Response recorded
           ├──► Logs audit entry
           │
           ├──► Creates Stage 2 record
           │    Approver: Director
           │    Status: "Pending"
           │
           ├──► Sends notification to Approver 2
           │
           └──► Request status: "Awaiting Approval" (Stage 2)
           │
[Stage 2 Approves] → [Stage 3] → ... → [Final Stage]
           │
           ▼
Final Stage Approved:
    ├──► Updates request: Status="Approved", Completed Date=Now
    ├──► Sends approval confirmation to requester
    ├──► Logs final audit entry
    └──► Triggers downstream actions (if configured)
```

### 2.2 Parallel Approval Flow

```
Request reaches Parallel Stage (e.g., Stage 3)
    │
    ▼
┌─────────────────────────┐
│ Router creates multiple │ ◄── Stage 3A: Finance Review
│ parallel stage records  │     Stage 3B: Legal Review
│ simultaneously          │     Stage 3C: Security Review
└──────────┬──────────────┘     Config: Require 2 of 3 approvals
           │
           ├──► All 3 approvers notified simultaneously
           │
           └──► Request status: "Awaiting Parallel Approvals"
           │
Approver A approves → Stage 3A: "Approved" (1 of 3)
Approver B rejects  → Stage 3B: "Rejected" (decision logged)
Approver C approves → Stage 3C: "Approved" (2 of 3 → threshold met)
           │
           ▼
┌─────────────────────────┐
│ Parallel Evaluator      │ ◄── 2 of 3 approvals received
│ determines outcome      │     Threshold met = Proceed
└──────────┬──────────────┘     (Even though B rejected, threshold is met)
           │                    Note: Can also configure "Unanimous" or "All Must Approve"
           ├──► If threshold met: Proceed to Stage 4
           │
           └──► If threshold NOT met: Request rejected, notify requester
```

### 2.3 Escalation Flow

```
Stage created with Due Date = Now + SLA hours
    │
    ▼
┌─────────────────────────┐
│ Reminder Flow           │ ◄── Runs every hour
│ (Scheduled)             │     Checks all pending stages
└──────────┬──────────────┘
           │
           ├──► Due Date - 24h: First reminder to approver
           │
           ├──► Due Date - 12h: Second reminder to approver + cc manager
           │
           ├──► Due Date reached: ESCALATE
           │    ├──► Notify original approver (escalation notice)
           │    ├──► Reassign to escalation target (skip-level manager)
           │    ├──► Create new stage record for escalated approver
           │    ├──► Mark original stage as "Escalated"
           │    └──► Log escalation audit entry
           │
           └──► Due Date + 48h: ESCALATE AGAIN
                ├──► Notify department head
                └──► Flag for executive attention
```

### 2.4 Delegation Flow (Out-of-Office)

```
Request assigned to Approver
    │
    ▼
┌─────────────────────────┐
│ Delegation Check Flow   │ ◄── Runs before sending notification
│ (part of Router)        │     Queries delegation rules
└──────────┬──────────────┘
           │
           ├──► Check 1: Is approver marked Out-of-Office in Exchange?
           │    └──► YES → Read OOF message for delegate info
           │
           ├──► Check 2: Is there an active delegation rule in Dataverse?
           │    └──► YES → Use configured delegatee
           │
           ├──► Check 3: Is approver on vacation in shared calendar?
           │    └──► YES → Lookup department backup
           │
           └──► Resolution:
                ├──► If delegate found: Send to delegatee, log delegation
                ├──► If no delegate: Escalate immediately to skip-level
                └──► Notify requester of delegation
```

## 3. Component Specifications

### 3.1 Approval Types and Routing Rules

**Invoice Approval (Type: INV-001)**

| Condition | Approval Chain | SLA |
|-----------|---------------|-----|
| Amount < $5,000 | Auto-approved | Immediate |
| Amount $5,000-$25,000 | Manager → Finance Reviewer | 24 hours |
| Amount $25,000-$100,000 | Manager → Director → Finance Manager | 48 hours |
| Amount $100,000-$500,000 | Manager → Director → VP Finance → CFO | 72 hours |
| Amount > $500,000 | Manager → Director → VP Finance → CFO → CEO | 120 hours |
| Vendor = "New" (not in approved vendor list) | + Procurement Review (parallel) | +24 hours |
| Department = "IT" | + IT Security Review (parallel, >$50K) | +24 hours |

**Employee Change Request (Type: HR-001)**

| Condition | Approval Chain | SLA |
|-----------|---------------|-----|
| Title change only | Manager → HR Business Partner | 48 hours |
| Salary increase < 10% | Manager → Director → HR Director | 72 hours |
| Salary increase > 10% | Manager → Director → VP → CHRO → CFO | 120 hours |
| Department transfer | Current Manager → New Manager → HR Director | 96 hours |
| Termination | Manager → HR Director → Legal | 48 hours |

**Purchase Request (Type: PUR-001)**

| Condition | Approval Chain | SLA |
|-----------|---------------|-----|
| Amount < $1,000 | Manager auto-approve | 12 hours |
| Amount $1,000-$10,000 | Manager → Department Head | 24 hours |
| Amount $10,000-$50,000 | Manager → Department Head → Procurement | 48 hours |
| Amount > $50,000 | Manager → Dept Head → Procurement → VP → CFO | 96 hours |
| Category = "Software/License" | + IT Review (parallel) | +24 hours |
| Category = "Professional Services" | + Legal Review (parallel, >$25K) | +48 hours |

### 3.2 Power Automate Flows

| Flow Name | Trigger | Purpose | Frequency |
|-----------|---------|---------|-----------|
| Approval Router | Dataverse row created (appr_request) | Core routing logic | Per request |
| Approval Response Handler | Dataverse row modified (appr_approval_stage) | Process approve/reject/comment | Per response |
| Reminder Service | Scheduled (hourly) | Send reminders for pending stages | Hourly |
| Escalation Service | Scheduled (hourly) | Escalate overdue stages | Hourly |
| Delegation Sync | Scheduled (twice daily) | Sync Exchange OOF with delegation table | 2x daily |
| Completion Handler | Dataverse status change | Post-approval actions, notifications | Per completion |
| Audit Logger | Dataverse any change | Write to immutable audit log | Per change |
| Teams Notification | Dataverse stage created | Send adaptive card to Teams | Per stage |
| Outlook Notification | Dataverse stage created | Send actionable email | Per stage |
| Analytics Sync | Scheduled (daily) | Aggregate data for Power BI | Daily |

### 3.3 Dataverse Tables

**appr_request (Request Header)**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| requestid | Unique Identifier | Yes | Primary key |
| appr_title | Single Line Text | Yes | Request title |
| appr_description | Multiple Lines Text | No | Detailed description |
| appr_requesttype | Lookup (appr_approval_type) | Yes | Approval type |
| appr_requester | Lookup (User) | Yes | Person submitting |
| appr_department | Choice | Yes | Finance, HR, Procurement, Legal, IT, Operations |
| appr_amount | Currency | No | Financial amount if applicable |
| appr_currency | Choice | No | USD, EUR, GBP |
| appr_priority | Choice | Yes | Low, Normal, High, Critical |
| appr_status | Choice | Yes | Draft, Submitted, Awaiting Approval, Approved, Rejected, Cancelled, Escalated |
| appr_currentstage | Whole Number | Yes | Current stage number |
| appr_totalstages | Whole Number | Yes | Total stages in chain |
| appr_submitteddate | DateTime | No | Submission timestamp |
| appr_completeddate | DateTime | No | Completion timestamp |
| appr_finaldecision | Choice | No | Approved, Rejected, Escalated, Cancelled |
| appr_finalcomments | Multiple Lines Text | No | Final decision comments |
| appr_correlationid | Single Line Text | Yes | End-to-end trace ID |
| appr_sla_duedate | DateTime | No | Overall SLA deadline |
| appr_attachments | File | No | Supporting documents |
| appr_tags | Multiple Lines Text | No | Custom tags/metadata |

**appr_approval_stage (Stage Instances)**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| stageid | Unique Identifier | Yes | Primary key |
| appr_requestid | Lookup (appr_request) | Yes | Parent request |
| appr_stagenumber | Whole Number | Yes | Stage sequence number |
| appr_stagename | Single Line Text | Yes | Human-readable stage name |
| appr_stagetype | Choice | Yes | Serial, Parallel, Conditional |
| appr_approver | Lookup (User) | Yes | Assigned approver |
| appr_originalapprover | Lookup (User) | No | Original approver (if delegated) |
| appr_status | Choice | Yes | Pending, Approved, Rejected, Escalated, Skipped, Cancelled |
| appr_assigneddate | DateTime | Yes | When stage was created |
| appr_duedate | DateTime | Yes | SLA deadline |
| appr_responsedate | DateTime | No | When approver responded |
| appr_response | Choice | No | Approved, Rejected, Delegated, Reassigned |
| appr_comments | Multiple Lines Text | No | Approver comments |
| appr_delegatee | Lookup (User) | No | Who was delegated to |
| appr_escalationto | Lookup (User) | No | Escalation target |
| appr_escalationreason | Choice | No | Overdue, OutOfOffice, Reassignment |
| appr_parallelconfig | Single Line Text | No | JSON: {required_approvals: N, total_approvers: M} |
| appr_isconditional | Boolean | Yes | Whether stage was conditionally included |
| appr_conditioneval | Single Line Text | No | What condition was evaluated |

### 3.4 Power Apps

**Request Submission Canvas App:**
- Dynamic form based on approval type selected
- Attachment upload (up to 5 files, 25MB total)
- Draft save capability
- Amount field with automatic threshold warnings
- Preview of expected approval chain before submission
- Request history for submitter

**Approval Center Canvas App:**
- My Approvals: All pending approvals for current user
- My Requests: All requests submitted by current user
- Team Approvals: For managers viewing team's requests
- Delegation Setup: Configure out-of-office delegation
- Actions: Approve, Reject, Delegate, Reassign, Comment
- Detail view: Full request details, attachment viewer, approval history timeline

**Admin Configuration Model-Driven App:**
- Approval Types management
- Routing rule configuration
- Threshold management
- SLA configuration
- Delegation rule management
- Org chart management
- Audit log viewer
- System settings

## 4. Security Model

### 4.1 Dataverse Security Roles

| Role | Request Table | Stage Table | Audit Log | Admin Functions |
|------|--------------|-------------|-----------|-----------------|
| Approval Requester | CRUD own | Read own | Read own | None |
| Approval Approver | Read (pending) | CRUD (assigned) | Read | None |
| Approval Manager | Read (team) | Read (team) | Read (team) | None |
| Approval Admin | Full CRUD | Full CRUD | Read | Full |
| Auditor | Read all | Read all | Read all | Read config |
| System | Full CRUD | Full CRUD | Create | Full |

### 4.2 Record Ownership

- **Requests**: Owned by requester
- **Stages**: Owned by assigned approver
- **Audit Log**: Owned by system service account (no user can modify)
- **Config tables**: Owned by admin team

### 4.3 Field-Level Security

| Field | Requester | Approver | Manager | Admin |
|-------|-----------|----------|---------|-------|
| Amount | Read | Read | Read | Full |
| Salary fields | Read own | Read | Read | Full |
| SSN/PII | None | None | None | Full |
| Audit entries | Read own | Read own | Read team | Full |
| Config tables | None | None | Read | Full |

## 5. Integration Points

| System | Direction | Method | Data |
|--------|-----------|--------|------|
| Exchange Online | Read | Microsoft Graph API | Out-of-office status, delegation rules |
| Azure AD | Read | Microsoft Graph API | User profile, manager chain, group membership |
| Outlook | Outbound | Office 365 Outlook connector | Actionable approval messages |
| Microsoft Teams | Outbound | Teams connector | Adaptive card notifications |
| SharePoint | Inbound/Outbound | SharePoint connector | List item sync, document storage |
| Power BI | Inbound | Dataverse DirectQuery | All approval data |
| Dynamics 365 HR | Outbound | Dataverse Virtual Table | Employee change updates |
| Dynamics 365 Finance | Outbound | Power Automate + CDS | Invoice approval status |

## 6. Performance & Scalability

| Factor | Target | Design |
|--------|--------|--------|
| New request processing | < 30 seconds | Async flow processing |
| Approval notification delivery | < 2 minutes | Parallel notification flows |
| Approval response processing | < 15 seconds | Trigger-based instant processing |
| Concurrent approvals | 100+ | Stateless flow design |
| Active approval types | 20+ | Config-driven, no code changes |
| Audit log retention | 7 years | Archival to SharePoint after 2 years |

## 7. Monitoring & Alerting

| Alert | Condition | Recipients |
|-------|-----------|------------|
| Flow failure rate | > 5% in 1 hour | Admin |
| Escalation rate | > 20% of requests in a day | Manager |
| SLA breach | Any request past due date | Admin + Requester |
| Approver overload | > 10 pending approvals per person | Manager |
| System error | Any unhandled exception | Admin |

## 8. Disaster Recovery

- **Dataverse**: Microsoft-managed backup (14-day point-in-time)
- **Flows**: Source controlled via Power Platform Pipelines
- **Approval data**: Critical — cannot be lost. Continuous backup enabled.
- **RTO**: 4 hours
- **RPO**: 15 minutes
