# AI Agent Prompts — Dataverse Case Management System

This document contains structured prompts for guiding AI agents through building the Dataverse Case Management System on Power Platform.

---

## Prompt 1: Dataverse Table Design and Schema

### Context
You are a Dataverse solution architect designing the complete data model for a multi-department case management system.

### Prompt
```
Design the complete Dataverse data model for a case management system that handles 5 case types across multiple departments.

CASE TYPES:
1. Customer Support — IT help desk, product support, general inquiries
2. Legal Matters — Contracts, litigation, compliance reviews
3. Compliance Incidents — Regulatory violations, policy breaches, audits
4. Field Service — On-site repairs, installations, maintenance
5. Quality Defects — Product defects, process failures, CAPA

TABLES TO DESIGN:

1. cm_case (Main case table)
   - All columns specified with type, length, required, description
   - Support for all 5 case types with type-specific fields
   - Status model per case type (different status options per type)
   - Auto-numbering for case numbers
   - Audit fields (CreatedOn, ModifiedOn, CreatedBy, ModifiedBy, OwnerId)

2. Contact (Use standard Dataverse Contact table)
   - Customizations: add department, job title, customer tier, preferred language
   - Relationship to Account

3. Account (Use standard Dataverse Account table)
   - Customizations: add industry, customer tier, region, SLA tier

4. cm_activity (Case activities)
   - Activity types: PhoneCall, Email, Task, Meeting, Research, OnSite, RemoteSession
   - Duration tracking, scheduling, ownership

5. cm_queue (Work queues)
   - Queue configuration, members, capacity, skills

6. cm_sla (SLA instances)
   - Per-case SLA tracking with response/resolution deadlines

7. cm_sladef (SLA definitions)
   - Configurable SLA rules per case type and priority

8. cm_escalation (Escalation records)
   - Escalation level, trigger, actions, resolution

9. cm_auditlog (Audit trail)
   - Comprehensive change tracking

10. cm_holiday (Holiday calendar)
    - Regional holidays for business hours calculation

11. cm_document (Document references)
    - File metadata, SharePoint links, versioning

FOR EACH TABLE:
- Complete column schema (name, type, length, required, description)
- Relationships (1:N, N:N) with cascade rules
- Business rules (no-code validation)
- Indexes for performance
- Choice column options
- Security considerations (sensitive fields marked)

RELATIONSHIPS:
- Case → Contact (customer)
- Case → Account (customer organization)
- Case → Case (parent/child)
- Case → Activity (1:N)
- Case → Queue (N:1)
- Case → SLA (1:1)
- Case → Escalation (1:N)
- Case → Document (1:N)
- Activity → User (owner)
- Queue → User/Team (members)

DELIVERABLES:
1. Complete ER diagram description
2. Table schemas for all 11 tables with all columns
3. Choice column option sets
4. Relationship definitions with cascade rules
5. Business rule specifications
6. Index recommendations
7. Security-sensitive field identification
8. Data retention recommendations
```

---

## Prompt 2: Security Model Design

### Context
Design the complete security model for the case management system with role-based access, column-level security, and business unit isolation.

### Prompt
```
Design a comprehensive Dataverse security model for a case management system used by multiple departments.

SECURITY ROLES (6 roles):

1. Case Agent
   - CRUD on own cases and team cases
   - Read contacts and accounts in business unit
   - CRUD on own activities
   - Read queues
   - Cannot delete cases
   - Cannot view confidential cases unless authorized
   - Cannot view billable hours

2. Case Manager
   - CRUD on all cases in business unit
   - CRUD on contacts and accounts in business unit
   - CRUD on all activities in business unit
   - Can reassign cases across teams
   - Can view SLA configuration (read-only)
   - Can view audit logs for BU
   - Can view escalation rules (read-only)

3. System Administrator
   - Full CRUD on all tables
   - Can configure SLA definitions, queues, assignment rules
   - Can manage security roles and users
   - Can view all audit logs
   - Can configure business rules and plug-ins
   - Can manage holiday calendars

4. Customer (Portal User)
   - Read only own cases
   - Read only own contact record
   - Read only own account record
   - Create new cases
   - Add comments to own cases
   - Cannot view internal notes or activities
   - Cannot view other customers' data

5. Auditor
   - Read-only on all tables
   - Can view audit logs
   - Can view confidential cases
   - Can view billable hours
   - Cannot modify any data
   - Can export reports

6. Field Technician
   - CRUD on cases assigned to them
   - Read contacts and accounts (limited fields)
   - CRUD on own activities
   - Can update case status and add notes
   - Can add attachments (photos)
   - Cannot reassign cases
   - Cannot view confidential cases

COLUMN-LEVEL SECURITY:
Identify fields requiring column-level security:
- cm_isconfidential flag
- cm_billable and billing-related fields
- cm_actualhours (sensitive for some roles)
- cm_satisfactioncomment (privacy)
- Custom fields with PII

BUSINESS UNITS:
Design business unit structure:
- Root: Contoso
  - Customer Support BU
  - Legal BU
  - Compliance BU
  - Field Services BU (with regional child BUs)
  - Quality Assurance BU

TEAMS:
- Queue-based teams (e.g., "L1-Support-Team", "Legal-Contracts-Team")
- Regional teams for field service
- Cross-functional teams for escalations

DELIVERABLES:
1. Security role permission matrix (Role x Table x CRUD)
2. Column security profile definitions
3. Business unit hierarchy diagram
4. Team structure and membership rules
5. Hierarchy security model (manager visibility)
6. Record ownership strategy
7. Access team templates for collaboration
8. Security testing scenarios
```

---

## Prompt 3: Model-Driven App Design

### Context
Design the model-driven Power Apps experience for case agents and managers.

### Prompt
```
Design a model-driven Power Apps case management application with the following specifications:

APP NAME: Case Management Hub
PRIMARY USERS: Case Agents, Case Managers, System Administrators

SITE MAP DESIGN:

Area 1: My Work
- Subarea: My Cases (view: cases owned by current user, sorted by priority)
- Subarea: My Activities (view: open activities owned by current user)
- Subarea: My Queue (view: cases in my queues)
- Subarea: My Dashboard (personal productivity dashboard)

Area 2: Cases
- Subarea: All Cases (system view with advanced find)
- Subarea: New Cases Today
- Subarea: Escalated Cases
- Subarea: SLA Breach Risk
- Subarea: Resolved Today

Area 3: Customers
- Subarea: Contacts
- Subarea: Accounts
- Subarea: Customer Directory

Area 4: Activities
- Subarea: All Activities
- Subarea: Phone Calls
- Subarea: Emails
- Subarea: Tasks

Area 5: Service (Admin)
- Subarea: Queues
- Subarea: SLA Definitions
- Subarea: Escalation Rules
- Subarea: Holiday Calendar
- Subarea: Assignment Rules

Area 6: Analytics
- Subarea: Reports (links to Power BI)
- Subarea: Audit Log

FORMS:

Form 1: Case Main Form (3 tabs)
Tab 1 — General
- Case number (read-only, prominent)
- Title
- Description
- Case Type (locked after creation)
- Category/Subcategory (cascading dropdowns)
- Priority/Severity
- Status/Status Reason
- Origin/Source
- Owner/Queue
- Customer (Contact + Account lookups)
- Confidential flag
- Tags

Tab 2 — Details
- SLA section: SLA definition, Response By, Resolve By, warning status
- Escalation section: Current level, escalation count, escalation history
- Resolution section: Resolution type, Resolution notes, Resolved date
- Satisfaction: Score, Comment
- Custom fields per case type (conditional visibility)

Tab 3 — Related
- Activities subgrid
- Notes subgrid
- Documents subgrid
- Related Cases subgrid
- Audit History subgrid

VIEWS:

1. My Active Cases
   - Columns: Case Number, Title, Priority, Status, Response By, Owner
   - Filter: Owner = current user, Status != Resolved/Closed
   - Sort: Priority desc, Response By asc

2. Today's New Cases
   - Columns: Case Number, Title, Type, Priority, Customer, Created On
   - Filter: Created Today
   - Sort: Created On desc

3. SLA Breach Risk
   - Columns: Case Number, Title, Priority, Response By, Resolve By, Warning Status
   - Filter: Warning Status = Warning OR Breach
   - Sort: Response By asc
   - Conditional formatting: Red for breached, Yellow for warning

4. Escalated Cases
   - Columns: Case Number, Title, Escalation Level, Escalated To, Escalation Reason
   - Filter: Escalation Count > 0, Status != Closed
   - Sort: Escalation Level desc

5. Resolved This Week
   - Columns: Case Number, Title, Type, Owner, Resolved On, Resolution Type
   - Filter: Resolved On = This Week
   - Sort: Resolved On desc

BUSINESS PROCESS FLOW:

Process: Case Resolution
Stages:
1. New (Identify)
   - Fields: Title, Description, Type, Category, Priority, Customer
   - Exit criteria: Title and Description filled

2. Assigned (Acknowledge)
   - Fields: Owner, Queue, First Response
   - Exit criteria: Owner assigned, First Response sent

3. In Progress (Investigate)
   - Fields: Status, Activities, Notes
   - Exit criteria: Investigation complete

4. Resolve (Resolve)
   - Fields: Resolution, Resolution Type, Resolved On
   - Exit criteria: Resolution filled, Status = Resolved

5. Close (Close)
   - Fields: Satisfaction, Close Notes
   - Exit criteria: Satisfaction captured, Status = Closed

DASHBOARDS:

1. Agent Dashboard
   - My open cases count
   - Cases by priority (pie chart)
   - My SLA compliance gauge
   - Today's activities
   - Overdue cases list

2. Manager Dashboard
   - Team case volume
   - SLA compliance by agent (bar chart)
   - Average resolution time trend
   - Escalation count
   - Queue depth

DELIVERABLES:
1. Complete site map XML structure
2. Form layouts with field positions
3. View FetchXML definitions
4. Business process flow stage definitions
5. Dashboard configuration
6. Security role-to-area mapping
```

---

## Prompt 4: Assignment Engine and SLA Automation

### Context
Build the automation layer that handles intelligent case assignment and SLA management.

### Prompt
```
Design the assignment engine and SLA automation for the Dataverse case management system.

PART 1: ASSIGNMENT ENGINE

Requirements:
- Automatically assign new cases to appropriate queues/agents
- Support workload-based balancing
- Support skill-based matching
- Handle VIP customer routing
- Respect agent availability and capacity

Dataverse Plug-in: CaseAssignmentPlugin
Event: Pre-Operation on cm_case Create
Stage: Synchronous

Logic:
1. Read case properties: Type, Category, Subcategory, Priority, Customer
2. Lookup customer tier from Contact/Account
3. Find matching queues:
   a. Match case type to queue category
   b. Match category to queue specialization
   c. Filter active queues only
4. If multiple queues match, score each:
   - Exact category match: +10 points
   - Type match: +5 points
   - Priority match: +3 points
   - Language match: +2 points
5. Select highest-scoring queue
6. If auto-assignment enabled for queue:
   a. Get queue members
   b. Filter: active users, not OOO, under capacity
   c. Calculate workload: count of open cases per agent
   d. Select agent with lowest workload
   e. If tie, round-robin based on last assignment time
7. Set cm_case.OwnerId = selected agent or queue
8. Set cm_case.cm_queueid = selected queue
9. If assigned to agent: set status = "Assigned"
10. If assigned to queue only: set status = "New"
11. Log assignment decision to trace log

Fallback Logic:
- If no queue matches: assign to default queue "General"
- If no agent available in queue: leave in queue, alert queue manager
- If customer tier = VIP: override to senior agent queue
- If case type = Critical: bypass workload, assign immediately

PART 2: SLA ENGINE

Power Automate Flow: cm_Flow_SLACalculation
Trigger: When cm_case is assigned (OwnerId changes)

Steps:
1. Get case record with expanded SLA definition lookup
2. Lookup cm_sladef where:
   - cm_sladef.cm_casetype = case.cm_casetype
   - cm_sladef.cm_priority = case.cm_priority
   - cm_sladef.cm_isactive = true
3. If no SLA def found: use default SLA
4. Calculate business hours:
   a. Get business hours profile for queue
   b. Load holidays from cm_holiday (matching region)
   c. Function: AddBusinessMinutes(startTime, minutes, holidays)
      - Loop: add minutes, skip weekends, skip holidays, respect business hours
5. Calculate deadlines:
   - Response By = AddBusinessMinutes(AssignedTime, sladef.ResponseMinutes)
   - Resolve By = AddBusinessMinutes(AssignedTime, sladef.ResolveMinutes)
   - Warning At = AddBusinessMinutes(AssignedTime, sladef.ResolveMinutes * sladef.WarningPct)
6. Create cm_sla record:
   - cm_caseid = case.id
   - cm_sladefid = sladef.id
   - cm_starttime = AssignedTime
   - cm_responseby = calculated
   - cm_resolveby = calculated
   - cm_warningat = calculated
   - cm_status = "InProgress"
7. Update case: cm_slainstanceid = new SLA record

Power Automate Flow: cm_Flow_SLAMonitor
Trigger: Recurrence (every 15 minutes)

Steps:
1. List all cm_sla where status = "InProgress"
2. For each:
   a. If now >= warningat AND status != "Warning":
      - Update status = "Warning"
      - Send warning email to case owner + manager
   b. If now >= responseby AND responsestatus != "Breached":
      - Update responsestatus = "Breached"
      - Trigger Level 1 escalation
   c. If now >= resolveby AND resolvestatus != "Breached":
      - Update resolvestatus = "Breached"
      - Trigger Level 2 escalation
3. On case resolution:
   a. Calculate actual response time and resolve time
   b. Update SLA record with actuals
   c. Set status = "Met" or "Breached"

PART 3: ESCALATION FLOW

Power Automate Flow: cm_Flow_Escalation
Trigger: Manual (called from SLA monitor or by user action)

Input: CaseId, EscalationLevel, Reason

Steps:
1. Get case record
2. Create cm_escalation record:
   - cm_caseid, cm_level, cm_reason, cm_triggeredby, cm_triggeredon
3. Determine escalation target based on level:
   - Level 1: Case owner + direct manager
   - Level 2: Queue owner + department head
   - Level 3: Department VP
   - Level 4: Executive team
4. Update case: cm_escalationcount++, cm_currentescalationlevel
5. Send escalation notifications
6. If reassign required: trigger assignment engine with new queue

DELIVERABLES:
1. Complete plug-in design with C# pseudocode
2. Power Automate flow specifications
3. Business hours calculation algorithm
4. Assignment scoring matrix
5. SLA definition configuration guide
6. Escalation matrix definition
7. Error handling specifications
8. Test scenarios for assignment and SLA
```

---

## Prompt 5: Plug-in Development

### Context
Develop Dataverse plug-ins for server-side business logic.

### Prompt
```
Design and develop Dataverse plug-ins for the case management system.

PLUG-IN 1: AutoNumberingPlugin
Purpose: Generate sequential case numbers
Event: Pre-Operation, cm_case Create
Logic:
- Format: CASE-YYYY-NNNNN (e.g., CASE-2024-00001)
- Use Dataverse auto-numbering column or custom counter entity
- Thread-safe: handle concurrent case creation
- Reset counter annually

PLUG-IN 2: CaseValidationPlugin
Purpose: Server-side validation
Event: Pre-Validation, cm_case Create/Update
Logic:
- Validate: Description not empty on create
- Validate: Due date >= Created On
- Validate: Resolution filled when status changes to Resolved
- Validate: Confidential cases have authorized owner
- Validate: Reopen count < 3 or manager approval present
- Return meaningful error messages

PLUG-IN 3: AuditLogPlugin
Purpose: Comprehensive change tracking
Event: Post-Operation, cm_case Create/Update/Delete
Logic:
- Capture: entity name, record ID, action, changed fields, old values, new values, user, timestamp
- Write to cm_auditlog table
- Never fail silently: if audit write fails, log to trace
- Exclude system fields from audit (unless value changed)

PLUG-IN 4: StatusTransitionPlugin
Purpose: Enforce valid status transitions
Event: Pre-Validation, cm_case Update
Logic:
- Define valid transitions per case type
- Customer Support: New→Assigned→InProgress→Pending→Resolved→Closed
- Legal: Intake→Review→Active→Discovery→Negotiation→Resolution→Closed
- Field Service: Dispatched→EnRoute→OnSite→InProgress→Resolved→Closed
- Reject invalid transitions with clear error message
- Allow admin override

PLUG-IN 5: NotificationPlugin
Purpose: Trigger notifications on key events
Event: Post-Operation, cm_case Update
Logic:
- On assignment: notify new owner
- On status change to Resolved: notify customer
- On escalation: notify all parties
- Write notification request to queue table (don't send directly from plug-in)
- Support email template selection based on event type

PLUG-IN 6: RollupPlugin
Purpose: Update parent case rollup fields
Event: Post-Operation, cm_case Update (status)
Logic:
- When child case resolved: update parent case progress
- Count of open child cases
- Aggregate satisfaction scores
- Parent case auto-close when all children closed

DELIVERABLES:
1. C# class structure for each plug-in
2. Plug-in registration details (event, stage, filter, execution order)
3. Shared utility library (business hours, logging, error handling)
4. Unit test plan for each plug-in
5. Performance considerations (async vs sync)
6. Error handling strategy
7. Deployment and versioning approach
```

---

## Prompt 6: Testing Strategy

### Context
Create a comprehensive testing plan for the case management system.

### Prompt
```
Create a comprehensive test plan for the Dataverse Case Management System.

TEST CATEGORIES:

1. DATA MODEL TESTING
- CRUD operations on all tables
- Relationship validation (cascading rules)
- Business rules enforcement
- Choice column validation
- Auto-numbering sequence
- Column-level security
- Business unit isolation

2. SECURITY TESTING
- Role-based access: each role can only access authorized data
- Column security: sensitive fields hidden appropriately
- Record-level: users see only their BU/team/own records
- Customer portal: customers see only own cases
- Admin override: admins can access all
- Audit log: all changes logged, log tamper-proof

3. ASSIGNMENT ENGINE TESTING
- New case routes to correct queue
- Workload balancing distributes evenly
- VIP customer override works
- Skill-based matching
- Agent availability respected
- Fallback to default queue
- Concurrent assignment (thread safety)

4. SLA ENGINE TESTING
- SLA calculation respects business hours
- Weekend exclusion works
- Holiday exclusion works
- Warning at 80% threshold
- Breach detection accurate
- SLA pause on "Pending Customer"
- SLA override by admin
- Timezone handling

5. ESCALATION TESTING
- Level 1 escalation triggers correctly
- Level 2 escalation after repeated breach
- Manual escalation by agent/manager
- Notification delivery
- Escalation count tracking
- Max escalation depth enforced

6. EMAIL INTEGRATION TESTING
- Email-to-case creates case
- Thread matching works
- Attachment handling
- Auto-acknowledgment
- Email template merge fields
- Spam filtering

7. MOBILE APP TESTING
- Offline case viewing
- Offline editing with sync
- Photo capture
- Signature capture
- GPS check-in
- Push notifications
- Performance on 4G

8. PORTAL TESTING
- Customer registration
- Case creation
- Status tracking
- Comment/attachment
- Satisfaction survey
- Security (no cross-customer data)

9. PERFORMANCE TESTING
- 50 concurrent users
- Case creation < 3 seconds
- List view < 3 seconds
- Search < 3 seconds
- Mobile sync < 10 seconds
- 500 email-to-case per day

10. UAT SCENARIOS
- End-to-end: email arrives → case created → assigned → resolved → customer notified
- Escalation: case breaches SLA → escalated → resolved by senior agent
- Reopen: customer reopens case → agent handles → resolved
- Merge: duplicate cases identified → merged → single case resolved

DELIVERABLES:
1. Test case matrix (100+ test cases)
2. Test data requirements
3. Automated test scripts (Power Automate test, EasyRepro)
4. Performance test scripts
5. UAT scenarios with expected results
6. Regression test suite
7. UAT sign-off checklist
```

---

## Usage Notes

### Recommended AI Tools

| Task | Recommended Tool |
|------|-----------------|
| Data model design | ChatGPT 4 / Claude 3 |
| Security model | ChatGPT 4 |
| Plug-in code (C#) | GitHub Copilot |
| Power Automate flows | GitHub Copilot / ChatGPT |
| Test cases | Claude 3 |
| Documentation | Any |

> **Note:** Dataverse plug-ins require C# development expertise. AI-generated code should be reviewed by experienced developers. Always test plug-ins in a sandbox environment before production deployment.
