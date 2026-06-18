# AI Agent Prompts — Approval Automation System

This document contains structured prompts for guiding AI agents through building the Multi-Stage Approval Automation System on Power Platform.

---

## Prompt 1: Core Approval Routing Engine

### Context
You are a Power Automate solution architect building an enterprise approval system. The system must handle serial, parallel, and conditional approval routing using Dataverse as the data store.

### Prompt
```
Design the core approval routing engine as a Power Automate cloud flow. This is the heart of the system — it determines who approves what, in what order, under what conditions.

SYSTEM CONTEXT:
- Dataverse tables: appr_request (header), appr_approval_stage (instances), appr_approval_type (config)
- Approval types are configured in appr_approval_type with JSON routing rules
- Need to support: Serial, Parallel, and Conditional routing
- Must integrate with Azure AD for org chart lookups
- Must handle delegation (out-of-office) before sending notifications

FLOW SPECIFICATION:
Name: appr_Flow_ApprovalRouter
Trigger: When a row is added (Dataverse appr_request)

DETAILED STEPS:

STEP 1 — Initialization
- Parse trigger outputs to get request ID
- Initialize variables: currentStage = 1, approvalChain = empty array, isComplete = false
- Retrieve the full request record with expanded approval type configuration

STEP 2 — Load Configuration
- Lookup appr_approval_type using request.appr_requesttype
- Parse the routing_rules JSON from the approval type config
- Extract SLA configuration, reminder schedule, and field definitions

STEP 3 — Evaluate Conditional Rules
- For each rule in routing_rules:
  * Evaluate the condition expression against request data
  * Example conditions: "amount < 5000", "department = 'IT'", "priority = 'Critical'"
  * Use Dataverse query or compose actions for evaluation
- Determine which chain configuration applies

STEP 4 — Build Approval Chain
- Parse the selected chain array from routing rules
- For each stage in the chain:
  * Resolve the approver:
    - "requester.manager" → Query Microsoft Graph for manager
    - "lookup('Finance Manager')" → Query Dataverse lookup table
    - "requester.manager.manager" → Skip-level manager
    - Static email → Direct assignment
  * Check delegation rules (see STEP 5)
  * Create appr_approval_stage record with:
    - stage_number, approver, due_date (business hours + SLA)
    - stage_type (serial/parallel), status = "Pending"

STEP 5 — Delegation Check (Per Approver)
- Query Exchange Online via Microsoft Graph for OOF status
- Check appr_delegation_rule table for active delegation
- If delegated: set original_approver + delegatee on stage record
- Log delegation in audit log

STEP 6 — Execute Stage
- If Serial:
  * Send approval notification to approver (Outlook + Teams)
  * Wait for response (Dataverse trigger on stage update)
  * On response: log action, evaluate outcome
  * If approved: increment currentStage, repeat
  * If rejected: mark request rejected, stop chain
  * If delegated: update stage with delegatee, send to delegatee

- If Parallel:
  * Send approval notification to all approvers simultaneously
  * Wait for responses (track count)
  * Parse parallel_config: {required_approvals: N, total_approvers: M}
  * When N approvals received (or M rejections): evaluate outcome
  * If threshold met: proceed to next stage
  * If threshold not met: mark request rejected

- If Conditional (stage-level):
  * Evaluate condition before creating stage
  * If condition true: create and execute stage
  * If condition false: mark stage as "Skipped", proceed

STEP 7 — Completion
- On final approval:
  * Update appr_request: status = "Approved", completed_date = now
  * Send approval confirmation to requester
  * Trigger post-approval actions (if configured)
  * Log final audit entry

- On rejection:
  * Update appr_request: status = "Rejected", completed_date = now
  * Send rejection notification to requester with comments
  * Log rejection audit entry

- On escalation:
  * Create new escalation stage record
  * Mark original stage as "Escalated"
  * Notify original approver + escalation target

ERROR HANDLING:
- Try-catch scope around entire flow
- On error: update request status to "Error", store error message
- Send admin alert via Teams
- Dead-letter to error queue table

DELIVERABLES:
1. Complete flow design with all actions specified
2. Variable initialization list with types and defaults
3. Expression formulas for condition evaluation
4. JSON parsing schemas for routing rules
5. Error handling scope design
6. Connection reference requirements
```

---

## Prompt 2: Approval Center Canvas App

### Context
Build a Power Apps canvas app that serves as the single pane of glass for approvers to view and act on all their pending approvals.

### Prompt
```
Create a Power Apps canvas app called "Approval Center" with the following specifications:

APP OVERVIEW:
- Purpose: Unified approval inbox for all pending approval requests
- Audience: Managers, Directors, VPs — anyone who approves requests
- Data: Dataverse (appr_request, appr_approval_stage)
- Design: Professional, clean, responsive (tablet + desktop optimized)

SCREEN 1 — APPROVAL INBOX (Gallery)
- Header: "My Approvals" with count badge
- Gallery showing pending approval stages assigned to current user
- Each item shows:
  * Request title
  * Request type badge (color-coded by department)
  * Requester name and photo
  * Amount (if applicable, highlighted for high values)
  * Days pending indicator (green < 24h, yellow 24-48h, red > 48h)
  * SLA due date countdown
  * Quick action buttons: Approve, Reject (inline, no navigation)
- Filters: All, Overdue, High Priority, By Type, By Department
- Sort: Due date (default), Submitted date, Amount (high to low), Priority
- Search: By request title, requester name, or request ID

SCREEN 2 — APPROVAL DETAIL
- Split-pane layout:
  LEFT SIDE (60%):
    * Request title and metadata (type, department, priority)
    * Requester info card (name, photo, department, email)
    * Full description (scrollable)
    * Attachments list (click to preview)
    * Approval chain visualization (timeline showing completed, current, pending stages)

  RIGHT SIDE (40%):
    * Action buttons: [Approve] [Reject] [Delegate] [Comment]
    * Comment input (required for reject)
    * Approval history list (who approved when, with comments)
    * Related requests (if requester has other pending requests)

SCREEN 3 — DELEGATION SETUP
- Calendar date picker for delegation start/end
- People picker for delegatee
- Approval type multi-select (which types to delegate)
- Active delegation list
- Save/Cancel buttons

SCREEN 4 — MY REQUESTS
- Gallery of requests submitted by current user
- Status indicators: Submitted, In Progress, Approved, Rejected, Escalated
- Search and filter capabilities
- Drill to request detail with full approval timeline

SCREEN 5 — HISTORY
- Completed approvals (approved or rejected by current user)
- Date range filter
- Export to Excel
- Statistics: total processed, avg response time, approval rate

TECHNICAL REQUIREMENTS:
- Use Concurrent() for parallel data loading
- Delegation-safe queries (Filter, Sort, FirstN)
- Responsive design for 1280x800+ and mobile
- Loading states for all async operations
- Error handling for network failures
- Keyboard shortcuts: A (approve), R (reject), D (delegate), C (comment), Tab (next item)
- Auto-refresh every 60 seconds

DELIVERABLES:
1. Screen-by-screen design with control specifications
2. Power Fx formulas for galleries, filters, and actions
3. Data connection and delegation-safe query patterns
4. Component library design (approval card, action buttons, timeline)
5. Performance optimization notes
```

---

## Prompt 3: Dataverse Table Design and Security Model

### Context
Design the complete Dataverse schema for the approval automation system with security considerations.

### Prompt
```
Design the complete Dataverse data model for a multi-stage approval automation system.

TABLES REQUIRED:

1. appr_request — The main request header table
2. appr_approval_stage — Individual approval stage instances
3. appr_approval_type — Approval type configuration
4. appr_routing_rule — Routing rule definitions
5. appr_delegation_rule — User delegation settings
6. appr_org_chart — Reporting line mappings
7. appr_audit_log — Immutable audit trail
8. appr_reminder_schedule — Reminder configuration

FOR EACH TABLE, PROVIDE:
- Complete column schema (name, type, required, description)
- Relationships to other tables
- Business rules (if any)
- Indexes for performance
- Choice column options

SECURITY MODEL:

Define security roles with table-level permissions:
1. Approval Requester — Can create/read/update own requests
2. Approval Approver — Can read/update assigned stages
3. Approval Manager — Can read team requests, reassign stages
4. Approval Admin — Full CRUD on config tables, read on all data
5. Approval Auditor — Read-only on all tables
6. System — Service account with full access

COLUMN-LEVEL SECURITY:
- Identify which fields contain sensitive data (salary, SSN, etc.)
- Define column security profiles
- Specify which roles can read sensitive fields

OTHER REQUIREMENTS:
- Business hours calculation (exclude weekends, holidays)
- SLA due date calculation formulas
- Correlation ID generation for audit tracing
- Cascade rules for delete (archival, not hard delete)
- Duplicate detection rules
- Data retention and archival strategy

DELIVERABLES:
1. Complete ER diagram description
2. Table schemas for all 8 tables
3. Security role permission matrix
4. Column security profile definitions
5. Business rule specifications
6. Data retention policy
```

---

## Prompt 4: Reminder and Escalation Flow

### Context
Build the scheduled flows that handle reminders and escalations for pending approvals.

### Prompt
```
Design the reminder and escalation system for the approval automation platform using Power Automate.

REQUIREMENTS:
- Check all pending approval stages every hour
- Send reminders at configurable intervals
- Escalate when SLA is breached
- Support business hours calculation
- Handle weekends and holidays

FLOW 1: Reminder Service (Scheduled)
Trigger: Every hour during business hours (8 AM - 6 PM)

Steps:
1. List all appr_approval_stage records where status = "Pending"
2. For each pending stage:
   a. Calculate hours since assigned
   b. Compare to reminder schedule from approval type config
   c. If reminder due:
      - Send reminder email to approver
      - Send Teams adaptive card
      - If second reminder: CC approver's manager
   d. If SLA deadline reached:
      - Trigger escalation
      - Log escalation audit entry
      - Create escalation stage record
      - Notify original approver (escalation notice)
      - Notify escalation target
      - Notify requester

FLOW 2: Escalation Service (Scheduled)
Trigger: Every hour

Steps:
1. List all stages past due date
2. For each overdue stage:
   a. Determine escalation target:
      - First escalation: skip-level manager (manager's manager)
      - Second escalation: department head
      - Third escalation: executive team
   b. Create new escalation stage
   c. Mark original stage as "Escalated"
   d. Send notifications to all parties
   e. Log escalation audit entry

FLOW 3: Delegation Sync (Scheduled)
Trigger: Twice daily (8 AM, 1 PM)

Steps:
1. Query Exchange Online for all users with active OOF
2. For each OOF user:
   a. Check if delegation rule exists in Dataverse
   b. If no rule exists:
      - Parse OOF message for delegate info
      - Create temporary delegation rule
   c. Update pending stages to reflect delegation
3. For expired delegation rules:
   a. Mark as inactive
   b. Revert any pending delegated stages

BUSINESS HOURS CALCULATION:
- Business hours: 8:00 AM - 6:00 PM, Monday-Friday
- Holidays: Query from Dataverse holiday table (configurable per region)
- SLA calculation: Add business hours to assigned date, skipping non-business time
- Example: Assigned Friday 4 PM with 24h SLA → Due Monday 4 PM

DELIVERABLES:
1. Complete flow designs for all 3 flows
2. Expression formulas for business hours calculation
3. Holiday table schema
4. Reminder schedule JSON schema
5. Escalation target resolution logic
6. Email and Teams message templates
```

---

## Prompt 5: Teams and Outlook Integration

### Context
Build the notification layer that delivers approval actions through Outlook actionable messages and Teams adaptive cards.

### Prompt
```
Design the notification integration for the approval system using Outlook actionable messages and Teams adaptive cards.

OUTLOOK ACTIONABLE MESSAGES:

Design the approval request email template with these features:
1. Hero section: Request title, requester info, priority badge
2. Details section: Key fields (amount, description, department)
3. Action bar: [Approve] [Reject] [View Details] buttons
4. Approve/Reject should work WITHOUT opening a browser (actionable message)
5. On approve: Show confirmation card in email with option to add comment
6. On reject: Show comment input field (required)
7. Fallback: If actionable messages not supported, link to Approval Center app

Teams ADAPTIVE CARDS:

Design adaptive cards for:
1. New Approval Request card:
   - Request summary
   - Key metadata
   - Approve/Reject/Delegate buttons
   - View Details button (opens Approval Center)

2. Reminder Card:
   - "This approval is overdue" banner
   - Request summary
   - Approve/Reject buttons
   - Snooze option (remind me in 4 hours)

3. Escalation Card (for managers):
   - "Approval has been escalated to you" notice
   - Original approver name and reason for escalation
   - Request details
   - Approve/Reject/Reassign buttons

4. Status Update Card (for requesters):
   - "Your request was approved/rejected" notice
   - Approver name and comments
   - Approval chain summary

5. Daily Digest Card:
   - List of pending approvals (up to 5)
   - Count of remaining approvals
   - Link to Approval Center

POWER AUTOMATE FLOW:

Design the Teams notification flow:
- Trigger: When approval stage is created
- Actions:
  1. Get approver's Teams chat ID
  2. Post adaptive card to 1:1 chat
  3. If no response after configured time, post to Teams Activity feed
  4. Store message ID for update (when approved/rejected, update the card)

Design the Outlook notification flow:
- Trigger: When approval stage is created
- Actions:
  1. Get approver's email
  2. Send actionable message with adaptive card
  3. Track message for response handling

DELIVERABLES:
1. Outlook actionable message JSON schema
2. Teams adaptive card JSON templates (all 5 card types)
3. Power Automate flow designs for notification delivery
4. Card update logic (when approval is acted upon)
5. Fallback behavior for non-supported clients
```

---

## Prompt 6: Testing Approval Scenarios

### Context
Create comprehensive test scenarios covering all approval types, edge cases, and failure modes.

### Prompt
```
Create a comprehensive test plan for the Multi-Stage Approval Automation System.

TEST SCENARIOS:

SCENARIO GROUP 1: Serial Approval
1. Standard serial chain: Employee → Manager → Director → VP
   - All approve: Verify chain completes, requester notified
   - Manager rejects: Verify chain stops, requester notified with reason
   - Director rejects after manager approved: Verify chain stops at stage 2

2. Auto-approval threshold
   - Amount $3,000 (below $5K threshold): Verify auto-approved, no human involved
   - Amount $4,999: Verify auto-approved
   - Amount $5,001: Verify routes to manager

3. Conditional skip
   - Requester is VP: Verify stage 1 (manager) skipped
   - Department has special rules: Verify conditional stage inclusion

SCENARIO GROUP 2: Parallel Approval
4. Parallel with majority
   - 3 approvers, need 2: First 2 approve → verify proceeds
   - 3 approvers, 2 reject → verify request rejected
   - 3 approvers, 1 approves, 1 rejects, 1 pending → wait for third

5. Parallel with unanimous requirement
   - All 3 must approve: 2 approve, 1 rejects → verify rejected

SCENARIO GROUP 3: Delegation
6. Out-of-office delegation
   - Approver has OOF set: Verify request goes to delegatee
   - Delegatee approves: Verify audit log shows delegation
   - OOF ends while request pending: Verify handling

7. Manual delegation by approver
   - Approver delegates to colleague: Verify reassignment
   - Original approver can still see in delegated list

8. No delegate configured, approver OOF
   - Verify escalation to skip-level manager
   - Verify requester notified of escalation

SCENARIO GROUP 4: Escalation
9. SLA breach escalation
   - Stage pending past SLA: Verify escalation to skip-level
   - Escalated stage also past SLA: Verify second escalation
   - Verify escalation audit entries

10. Reminder sequence
    - Verify first reminder at 24 hours
    - Verify second reminder at 42 hours (with manager CC)
    - Verify no reminders after escalation

SCENARIO GROUP 5: Edge Cases
11. Approver not in org chart
    - Verify escalation to department head
    - Verify admin notification

12. Duplicate submission
    - Same user submits identical request twice
    - Verify idempotency (not double-processed)

13. Concurrent responses
    - Two approvers in parallel stage respond simultaneously
    - Verify no race conditions, correct tally

14. Flow failure mid-chain
    - Simulate flow failure after stage 2 approval
    - Verify request in consistent state on recovery
    - Verify retry logic works

15. Security
    - User tries to approve request not assigned to them
    - User tries to view request from other department
    - User tries to modify audit log
    - Verify all denied

DELIVERABLES:
1. Test case matrix (50+ test cases)
2. Test data requirements
3. Expected results for each scenario
4. Regression test suite
5. Performance test scenarios
6. UAT sign-off checklist
```

---

## Prompt 7: Admin Configuration Model-Driven App

### Context
Build a model-driven app for administrators to configure approval types, routing rules, and system settings.

### Prompt
```
Design a Power Apps model-driven app for approval system administration.

APP MODULES AND FORMS:

Module 1: Approval Types
- Main form: Approval type definition
  * Type name, code, department
  * Active/Inactive status
  * Routing rules (JSON editor with validation)
  * SLA hours by priority
  * Reminder schedule configuration
  * Required attachments
  * Field definitions (subgrid)
- Views: Active types, All types, By department

Module 2: Routing Rules
- Main form: Individual routing rule
  * Rule name, approval type
  * Condition builder (UI-based, not just JSON)
  * Chain builder (drag-and-drop stage ordering)
  * Stage details: type, resolver, SLA override
- Views: Rules by type, Active rules

Module 3: Delegation Management
- Main form: Delegation rule
  * Delegator (people lookup)
  * Delegatee (people lookup)
  * Date range
  * Approval types (multi-select)
  * Active status
- Views: Active delegations, Expired, By delegator

Module 4: Org Chart
- Main form: Reporting line entry
  * Employee email
  * Manager email
  * Department
  * Job level
  * Skip-level manager
  * Department head
- Views: By department, Hierarchy view

Module 5: Audit Log
- Read-only view of all audit entries
- Filters: Date range, Request ID, User, Action
- Export to Excel
- Drill-through to request

Module 6: System Settings
- Global configuration form:
  * Business hours start/end
  * Default reminder schedule
  * Max stages per chain
  * Auto-approve threshold (global default)
  * Notification preferences (email/Teams/both)
  * Holiday calendar (subgrid)

DELIVERABLES:
1. Site map design
2. Form layouts for all entities
3. View configurations
4. Business process flows (if applicable)
5. Dashboard design
6. Security role assignments per module
```

---

## Usage Notes

### Recommended AI Tools by Task

| Task | Recommended Tool |
|------|-----------------|
| Flow logic design | ChatGPT 4 / Claude 3 |
| Power Fx formulas | GitHub Copilot |
| JSON schemas (adaptive cards) | GitHub Copilot / ChatGPT |
| Data model design | ChatGPT 4 |
| Test case generation | Claude 3 |
| Documentation | Any |

> **Note:** AI-generated approval workflows should be thoroughly tested with real organizational hierarchies before production deployment. Always validate delegation chains with HR to ensure compliance with company policies.
