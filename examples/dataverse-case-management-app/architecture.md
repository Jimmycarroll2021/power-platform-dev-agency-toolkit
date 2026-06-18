# Dataverse Case Management System — Architecture Document

## 1. System Architecture Overview

The Dataverse Case Management System is built on a layered architecture with Dataverse as the core data platform, model-driven Power Apps for desktop users, canvas Power Apps for mobile field workers, and Power Pages for customer self-service. Server-side logic is implemented through Dataverse plug-ins and Power Automate flows, with Power BI providing analytics.

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                                 │
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Model-Driven App    │  │  Canvas Mobile   │  │   Customer Portal    │  │
│  │  (Desktop)           │  │  App (Field)     │  │   (Power Pages)      │  │
│  │                      │  │                  │  │                      │  │
│  │ • Full case mgmt     │  │ • Offline sync   │  │ • Case creation      │  │
│  │ • Dashboards         │  │ • GPS capture    │  │ • Status tracking    │  │
│  │ • Business process   │  │ • Photo attach   │  │ • Knowledge base     │  │
│  │   flows              │  │ • Signature      │  │ • Community forums   │  │
│  │ • Advanced find      │  │ • Barcode scan   │  │ • Chat widget        │  │
│  │ • Reporting          │  │ • Time tracking  │  │ • Profile mgmt       │  │
│  │ • Admin config       │  │ • Push notif.    │  │ • Multi-language     │  │
│  └──────────┬───────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
│             │                       │                       │                │
│             └───────────────────────┼───────────────────────┘                │
│                                     ▼                                       │
│                    ┌────────────────────────────────┐                        │
│                    │     Unified Dataverse Layer    │                        │
│                    │     (Security + Business Logic)│                        │
│                    └──────────────┬─────────────────┘                        │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATAVERSE DATA & LOGIC LAYER                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CORE TABLES                                                         │    │
│  │                                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │    │
│  │  │   Case       │  │   Contact    │  │   Account    │            │    │
│  │  │   (cm_case)  │  │   (Contact)  │  │   (Account)  │            │    │
│  │  │              │  │              │  │              │            │    │
│  │  │ • caseid (PK)│  │ • contactid  │  │ • accountid  │            │    │
│  │  │ • casenumber │  │ • firstname  │  │ • name       │            │    │
│  │  │ • title      │  │ • lastname   │  │ • industry   │            │    │
│  │  │ • description│  │ • email      │  │ • status     │            │    │
│  │  │ • type       │  │ • phone      │  │ • owner      │            │    │
│  │  │ • category   │  │ • company    │  │ • region     │            │    │
│  │  │ • priority   │  │ • jobtitle   │  │ • tier       │            │    │
│  │  │ • status     │  │ • department │  │ • parent     │            │    │
│  │  │ • origin     │  │ • owner      │  │              │            │    │
│  │  │ • owner      │  │              │  │              │            │    │
│  │  │ • customer   │  │              │  │              │            │    │
│  │  │ • sla        │  │              │  │              │            │    │
│  │  │ • parentcase │  │              │  │              │            │    │
│  │  │ • duedate    │  │              │  │              │            │    │
│  │  │ • resolvedon │  │              │  │              │            │    │
│  │  │ • resolution │  │              │  │              │            │    │
│  │  │ • satisfaction│ │              │  │              │            │    │
│  │  │ • source     │  │              │  │              │            │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │    │
│  │         │                   │                   │                    │    │
│  │         └───────────────────┼───────────────────┘                    │    │
│  │                             │                                        │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  RELATED TABLES                                              │   │    │
│  │  │                                                             │   │    │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │    │
│  │  │  │   Activity   │  │   Note       │  │   Document   │    │   │    │
│  │  │  │   (cm_activ) │  │   (Annotation│  │   (cm_doc)   │    │   │    │
│  │  │  │              │  │   /SharePoint)│  │              │    │   │    │
│  │  │  │ • activityid │  │              │  │              │    │   │    │
│  │  │  │ • caseid(FK) │  │ • noteid     │  │ • documentid │    │   │    │
│  │  │  │ • type       │  │ • caseid(FK) │  │ • caseid(FK) │    │   │    │
│  │  │  │ • subject    │  │ • notetext   │  │ • filename   │    │   │    │
│  │  │  │ • description│  │ • attachment │  │ • filepath   │    │   │    │
│  │  │  │ • scheduled  │  │ • createdon  │  │ • filetype   │    │   │    │
│  │  │  │ • completed  │  │              │  │ • filesize   │    │   │    │
│  │  │  │ • owner      │  │              │  │ • version    │    │   │    │
│  │  │  │ • status     │  │              │  │              │    │   │    │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │    │
│  │  │                                                             │   │    │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │    │
│  │  │  │   SLA        │  │   Escalation │  │   Audit Log  │    │   │    │
│  │  │  │   (cm_sla)   │  │   (cm_escal) │  │   (cm_audit) │    │   │    │
│  │  │  │              │  │              │  │              │    │   │    │
│  │  │  │ • slaid      │  │ • escalid    │  │ • auditid    │    │   │    │
│  │  │  │ • caseid(FK) │  │ • caseid(FK) │  │ • caseid(FK) │    │   │    │
│  │  │  │ • sladefid   │  │ • level      │  │ • entity     │    │   │    │
│  │  │  │ • starttime  │  │ • triggered  │  │ • action     │    │   │    │
│  │  │  │ • warningat  │  │ • escalatedto│  │ • oldvalue   │    │   │    │
│  │  │  │ • breachat   │  │ • reason     │  │ • newvalue   │    │   │    │
│  │  │  │ • status     │  │ • status     │  │ • userid     │    │   │    │
│  │  │  │ • breached   │  │ • resolvedon │  │ • timestamp  │    │   │    │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CONFIGURATION TABLES                                                │    │
│  │                                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │    │
│  │  │   SLA Def.   │  │   Queue      │  │   Holiday    │            │    │
│  │  │   (cm_sladef)│  │   (cm_queue) │  │   (cm_hol)   │            │    │
│  │  │              │  │              │  │              │            │    │
│  │  │ • sladefid   │  │ • queueid    │  │ • holidayid  │            │    │
│  │  │ • name       │  │ • name       │  │ • name       │            │    │
│  │  │ • casetype   │  │ • category   │  │ • date       │            │    │
│  │  │ • priority   │  │ • members    │  │ • type       │            │    │
│  │  │ • responsetime│ │ • owner      │  │ • region     │            │    │
│  │  │ • resolvetime│  │ • isactive   │  │              │            │    │
│  │  │ • warningpct │  │ • capacity   │  │              │            │    │
│  │  │ • isactive   │  │ • skillreq   │  │              │            │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AUTOMATION & INTEGRATION LAYER                            │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │   Power Automate │  │   Dataverse      │  │   Power Automate         │  │
│  │   (Cloud Flows)  │  │   Plug-ins       │  │   (Email Integration)    │  │
│  │                  │  │                  │  │                          │  │
│  │ • Assignment     │  │ • Auto-numbering │  │ • Email-to-Case          │  │
│  │   Engine         │  │ • Validation     │  │ • Threading              │  │
│  │ • SLA Monitor    │  │ • Business rules │  │ • Auto-response          │  │
│  │ • Escalation     │  │ • Integration    │  │ • Notification           │  │
│  │ • Notification   │  │   triggers       │  │ • Template engine        │  │
│  │ • Reporting Sync │  │ • Rollup fields  │  │                          │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │   SharePoint     │  │   Exchange       │  │   External Systems       │  │
│  │   Document Store │  │   Online         │  │                          │  │
│  │                  │  │                  │  │ • Dynamics 365 CE        │  │
│  │ • Case docs      │  │ • Case alerts    │  │ • Dynamics 365 Finance   │  │
│  │ • Templates      │  │ • Thread sync    │  │ • SAP (customer master)  │  │
│  │ • Knowledge      │  │ • Auto-create    │  │ • Jira (dev tickets)     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REPORTING & ANALYTICS LAYER                          │
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Power BI            │  │  Dataverse       │  │  Copilot Studio      │  │
│  │  Dashboards          │  │  Reporting       │  │  (Analytics Agent)   │  │
│  │                      │  │                  │  │                      │  │
│  │ • Case volume        │  │ • Advanced Find  │  │ • Natural language   │  │
│  │ • Agent workload     │  │ • System views   │  │   case queries       │  │
│  │ • SLA performance    │  │ • Charts         │  │ • Summary generation │  │
│  │ • Resolution trends  │  │ • Excel export   │  │ • Insight extraction │  │
│  │ • Escalation analysis│  │                  │  │                      │  │
│  │ • Customer satisfaction│ │                  │  │                      │  │
│  │ • Forecasting        │  │                  │  │                      │  │
│  └──────────────────────┘  └──────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Data Model — Detailed Schema

### 2.1 Core Entity: cm_case

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| cm_caseid | Unique Identifier | Yes | Primary key (GUID) |
| cm_casenumber | Autonumber | Yes | Human-readable: CASE-2024-00001 |
| cm_title | Single Line Text (200) | Yes | Brief case title |
| cm_description | Multiple Lines Text (4000) | Yes | Detailed description |
| cm_casetype | Choice | Yes | CustomerSupport, LegalMatter, ComplianceIncident, FieldService, QualityDefect |
| cm_category | Choice | Yes | Per-type categories (20+ options) |
| cm_subcategory | Choice | No | Per-category subcategories (50+ options) |
| cm_priority | Choice | Yes | Critical, High, Normal, Low |
| cm_severity | Choice | Yes | Critical, Major, Moderate, Minor, Cosmetic |
| cm_status | Choice | Yes | New, Assigned, InProgress, PendingCustomer, PendingInternal, Resolved, Closed, Cancelled, Reopened |
| cm_statusreason | Choice | No | Detailed reason for status |
| cm_origin | Choice | Yes | Email, Phone, Web, Portal, Chat, WalkIn, Internal, SocialMedia |
| cm_source | Choice | Yes | Generated, Imported, Migrated |
| cm_customerid | Lookup (Contact) | No | Related customer contact |
| cm_accountid | Lookup (Account) | No | Related customer account |
| cm_ownerid | Lookup (User/Team) | Yes | Case owner (agent/queue) |
| cm_queueid | Lookup (cm_queue) | No | Current queue assignment |
| cm_parentcaseid | Lookup (cm_case) | No | Parent case for related cases |
| cm_slaapplicable | Boolean | Yes | Whether SLA tracking is enabled |
| cm_slainstanceid | Lookup (cm_sla) | No | Related SLA record |
| cm_responseby | DateTime | No | SLA response deadline |
| cm_resolveby | DateTime | No | SLA resolution deadline |
| cm_firstresponse | DateTime | No | Timestamp of first agent response |
| cm_resolvedon | DateTime | No | Case resolution timestamp |
| cm_resolution | Multiple Lines Text (2000) | No | Resolution description |
| cm_resolutiontype | Choice | No | Solved, Workaround, Duplicate, NoResolution, Other |
| cm_satisfaction | Choice | No | VerySatisfied, Satisfied, Neutral, Dissatisfied, VeryDissatisfied |
| cm_satisfactionscore | Decimal | No | 1-5 numeric score |
| cm_satisfactioncomment | Multiple Lines Text (1000) | No | Customer feedback text |
| cm_escalationcount | Whole Number | Yes | Number of times escalated |
| cm_currentescalationlevel | Choice | No | Level0, Level1, Level2, Level3 |
| cm_isconfidential | Boolean | Yes | Restricted access flag |
| cm_estimatedeffort | Decimal | No | Estimated hours to resolve |
| cm_actualhours | Decimal | No | Actual hours spent |
| cm_duedate | DateTime | No | Manual due date override |
| cm_tags | Multiple Lines Text (500) | No | Comma-separated tags |
| cm_relatedcases | Multiple Lines Text (500) | No | Related case numbers |
| cm_emailthreadid | Single Line Text (200) | No | Email conversation thread ID |
| cm_createdbyportal | Boolean | Yes | Whether created via customer portal |
| cm_firstcontactresolution | Boolean | No | Whether resolved on first contact |
| cm_reopencount | Whole Number | Yes | Number of times reopened |
| cm_mergedinto | Lookup (cm_case) | No | If merged, the target case |
| cm_billable | Boolean | No | Whether time is billable (legal matters) |
| cm_matternumber | Single Line Text (50) | No | Legal matter reference |
| cm_regulatoryreference | Single Line Text (100) | No | Compliance regulation reference |
| cm_riskscore | Decimal | No | Calculated risk score (1-100) |
| cm_customfield1-5 | Various | No | Extensible custom fields per deployment |
| CreatedOn | DateTime | Yes | System audit field |
| ModifiedOn | DateTime | Yes | System audit field |
| CreatedBy | Lookup (User) | Yes | System audit field |
| ModifiedBy | Lookup (User) | Yes | System audit field |
| OwnerId | Lookup (User/Team) | Yes | Record ownership |
| StateCode | State | Yes | Active/Inactive |
| StatusCode | Status | Yes | Detailed status reason |

### 2.2 Supporting Entities

**cm_activity (Case Activities)**

| Column | Type | Description |
|--------|------|-------------|
| cm_activityid | Unique Identifier | Primary key |
| cm_caseid | Lookup (cm_case) | Parent case |
| cm_activitytype | Choice | PhoneCall, Email, Task, Meeting, Note, Research, OnSite, RemoteSession |
| cm_subject | Single Line Text | Activity subject |
| cm_description | Multiple Lines Text | Details |
| cm_scheduledstart | DateTime | Planned start |
| cm_scheduledend | DateTime | Planned end |
| cm_actualstart | DateTime | Actual start |
| cm_actualend | DateTime | Actual end |
| cm_duration | Whole Number | Minutes spent |
| cm_ownerid | Lookup (User) | Assigned user |
| cm_status | Choice | Open, Completed, Cancelled |
| cm_direction | Choice | Inbound, Outbound |
| cm_phonenumber | Single Line Text | For phone calls |
| cm_emailfrom | Email | For emails |
| cm_emailto | Email | For emails |

**cm_queue (Work Queues)**

| Column | Type | Description |
|--------|------|-------------|
| cm_queueid | Unique Identifier | Primary key |
| cm_name | Single Line Text | Queue name (e.g., "L1-Support", "Legal-Matters") |
| cm_description | Multiple Lines Text | Queue description |
| cm_category | Choice | Queue category |
| cm_owners | Lookup (Team) | Owning team |
| cm_members | Multiple Lines Text | Queue member emails |
| cm_capacity | Whole Number | Max open cases per member |
| cm_currentload | Whole Number | Current open case count |
| cm_skillrequirements | Multiple Lines Text | Required skills |
| cm_isactive | Boolean | Active flag |
| cm_emailaddress | Email | Queue email (for email-to-case) |
| cm_businesshours | Choice | Business hours profile |

**cm_sladef (SLA Definitions)**

| Column | Type | Description |
|--------|------|-------------|
| cm_sladefid | Unique Identifier | Primary key |
| cm_name | Single Line Text | SLA name |
| cm_casetype | Choice | Applicable case type |
| cm_priority | Choice | Applicable priority |
| cm_responsetimeminutes | Whole Number | Response SLA in minutes |
| cm_resolvetimeminutes | Whole Number | Resolution SLA in minutes |
| cm_warningpercentage | Decimal | Warning threshold (0-100) |
| cm_businesshours | Choice | Business hours profile |
| cm_isactive | Boolean | Active flag |

## 3. Security Model

### 3.1 Security Roles

| Role | Case CRUD | Contact CRUD | Account CRUD | Activity CRUD | Admin | Reports |
|------|-----------|-------------|-------------|--------------|-------|---------|
| Case Agent | CRUD (own + team) | Read | Read | CRUD (own + team) | No | Read own |
| Case Manager | CRUD (BU) | CRUD (BU) | Read (BU) | CRUD (BU) | Partial | Read BU |
| System Admin | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full | Full |
| Customer | Read (own) | Read (own) | Read (own) | Read (own) | No | Read own |
| Auditor | Read (all) | Read (all) | Read (all) | Read (all) | No | Read all |
| Field Tech | CRUD (assigned) | Read | Read | CRUD (own) | No | Read own |

### 3.2 Column-Level Security

| Column | Agent | Manager | Customer | Auditor |
|--------|-------|---------|----------|---------|
| cm_isconfidential | No (unless authorized) | Yes | No | Yes |
| cm_billable | No | Yes | No | Yes |
| cm_actualhours | Read | Read | No | Read |
| cm_cost | No | Read | No | Read |
| cm_satisfactioncomment | Read | Read | No | Read |

### 3.3 Record-Level Access

- **Owner-based**: Case owner has full CRUD on their cases
- **Team-based**: Team members have read/update on team cases
- **Business unit**: Managers see all cases in their BU
- **Hierarchy**: Senior managers see subordinate cases
- **Customer**: Customers see only their own cases (via portal)

## 4. Automation Architecture

### 4.1 Assignment Engine

```
New Case Created
    │
    ▼
┌─────────────────────────┐
│ Assignment Plug-in      │ ◄── Pre-operation on cm_case create
│ (Dataverse Plug-in)     │     Synchronous, runs on server
└──────────┬──────────────┘
           │
           ├──► Evaluate assignment rules:
           │    1. Case type → determine queue family
           │    2. Category/subcategory → specific queue
           │    3. Priority → urgency weighting
           │    4. Customer tier → VIP handling
           │    5. Language → language-matched agent
           │    6. Workload balancing → least-loaded agent
           │
           ├──► If queue found:
           │    - Set cm_ownerid = Queue
           │    - Set cm_queueid = Queue
           │    - Set cm_status = "New" (in queue)
           │
           ├──► If auto-assignment enabled:
           │    - Find available agent in queue
           │    - Check capacity (not overloaded)
           │    - Check skills match
           │    - Assign to agent
           │    - Set cm_status = "Assigned"
           │    - Trigger notification flow
           │
           └──► If no match found:
                - Assign to default queue
                - Alert admin for manual routing
```

### 4.2 SLA Engine

```
Case Assigned
    │
    ▼
┌─────────────────────────┐
│ SLA Calculation Flow    │ ◄── Power Automate, triggered on assign
└──────────┬──────────────┘
           │
           ├──► Lookup SLA definition:
           │    - Match cm_casetype + cm_priority → cm_sladef
           │    - Get response time, resolve time, warning %
           │
           ├──► Calculate business hours:
           │    - Use cm_sladef.businesshours profile
           │    - Exclude weekends and holidays (cm_holiday table)
           │    - From assignment timestamp, add SLA minutes
           │
           ├──► Create cm_sla record:
           │    - cm_responseby = calculated response deadline
           │    - cm_resolveby = calculated resolution deadline
           │    - cm_warningat = warning threshold timestamp
           │    - cm_status = "InProgress"
           │
           └──► Link to case: cm_case.cm_slainstanceid

SLA Monitoring (every 15 minutes):
    ├──► Check cases approaching warning threshold
    │    → Send warning notification to owner + manager
    ├──► Check cases past response deadline
    │    → Mark SLA as "Response Breached"
    │    → Escalate to Level 1
    ├──► Check cases past resolution deadline
    │    → Mark SLA as "Resolution Breached"
    │    → Escalate to Level 2
    └──► On case resolution:
         → Update SLA status to "Met" or "Breached"
         → Calculate actual response/resolution times
```

### 4.3 Escalation Framework

| Level | Trigger | Action | Notification |
|-------|---------|--------|--------------|
| Level 0 | Auto-assignment | Case assigned to agent | Agent notification |
| Level 1 | SLA warning (80%) | Alert agent + manager | Email + Teams |
| Level 2 | SLA breach | Reassign to senior agent + manager | Email + Teams |
| Level 3 | 2nd SLA breach or Critical priority | Department head involvement | Email + Teams + SMS |
| Level 4 | 3rd breach or customer escalation | Executive notification | Email + immediate call |

## 5. Business Process Flows

### 5.1 Customer Support Case Process

```
┌─────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌──────────┐
│   NEW   │───►│ ASSIGNED │───►│ IN PROGRESS│───►│ RESOLVED │───►│  CLOSED  │
└─────────┘    └──────────┘    └───────────┘    └──────────┘    └──────────┘
     │               │                │               │               │
     │  Identify     │  Acknowledge   │  Investigate  │  Verify       │  Follow-up
     │  & Route      │  & Research    │  & Resolve    │  Solution     │  & Archive
     │               │                │               │               │
     │  • Assign     │  • First       │  • Diagnose   │  • Confirm    │  • Survey
     │    owner      │    response    │  • Research   │    with       │  • Archive
     │  • Set SLA    │  • Set exp.    │  • Collaborate│    customer   │  • Metrics
     │  • Priority   │    timeline    │  • Document   │  • Document   │
     │               │                │               │               │
     │               │                │  • Escalate   │               │
     │               │                │    if needed  │               │
```

### 5.2 Business Rules (No-Code Validation)

| Rule | Trigger | Condition | Action |
|------|---------|-----------|--------|
| Confidential Case | Case create/update | cm_isconfidential = true | Lock down visibility; notify security team |
| Priority Override | Case update | Customer tier = VIP AND priority < High | Auto-set priority to High |
| Description Required | Case create | cm_description is blank | Prevent save; show error |
| Due Date Validation | Case update | cm_duedate < today | Prevent save; show error |
| Resolution Required | Status change to Resolved | cm_resolution is blank | Prevent status change |
| Reopen Limit | Status change to Reopened | cm_reopencount >= 3 | Alert manager; require approval |

## 6. Plug-in Architecture

### 6.1 Server-Side Plug-ins

| Plug-in | Event | Stage | Purpose |
|---------|-------|-------|---------|
| AutoNumbering | Create | Pre-Operation | Generate cm_casenumber from sequence |
| Assignment | Create | Pre-Operation | Route case to appropriate queue/agent |
| Validation | Create/Update | Pre-Validation | Enforce business rules server-side |
| SLAInit | Create | Post-Operation | Create SLA record and calculate deadlines |
| AuditLog | Create/Update/Delete | Post-Operation | Write comprehensive audit entries |
| Notification | Update | Post-Operation | Trigger notifications on status changes |
| Integration | Update | Post-Operation | Sync with external systems (ERP, CRM) |
| Rollup | Update | Post-Operation | Update parent case rollup fields |

### 6.2 Custom Workflow Activities

| Activity | Purpose |
|----------|---------|
| CalculateBusinessHours | Compute SLA deadlines excluding non-business time |
| EvaluateAssignmentRules | Match case to queue/agent based on rules |
| SendTemplatedEmail | Send email using template with merge fields |
| CheckHoliday | Query holiday calendar for date checks |
| MergeCases | Consolidate duplicate cases |

## 7. Email Integration

### 7.1 Email-to-Case

```
Email arrives at support@contoso.com
    │
    ▼
┌─────────────────────────┐
│ Email Monitor Flow      │ ◄── Triggered by new email
└──────────┬──────────────┘
           │
           ├──► Extract: sender, subject, body, attachments
           ├──► Check if reply to existing case (thread ID matching)
           │    ├──► YES: Add as email activity to existing case
           │    └──► NO: Create new case
           │
           ├──► For new case:
           │    - Create cm_case from email data
           │    - Parse subject for case number (if reply)
           │    - Extract customer from sender email (match Contact)
           │    - Set origin = "Email"
           │    - Run assignment engine
           │    - Send auto-acknowledgment email
           │
           └──► Store email as cm_activity (Email type)
```

### 7.2 Email Templates

| Template | Trigger | Recipients |
|----------|---------|------------|
| Case Acknowledgment | New case creation | Customer |
| Case Assignment | Agent assigned | Agent + Customer |
| Status Update | Status change | Customer (if portal not used) |
| SLA Warning | 80% of SLA elapsed | Agent + Manager |
| SLA Breach | SLA breached | Agent + Manager + Queue Owner |
| Resolution Confirmation | Case resolved | Customer |
| Satisfaction Survey | 24 hours after resolution | Customer |
| Escalation Notice | Case escalated | New owner + Customer |

## 8. Mobile Architecture

### 8.1 Field Technician Canvas App

| Feature | Description |
|---------|-------------|
| Case List | Assigned cases with priority and due date |
| Case Detail | Full case info, customer details, history |
| Status Updates | Update case status, add notes, log time |
| Photo Capture | Attach photos directly from device camera |
| Signature Capture | Customer signature on work completion |
| GPS Check-in | Automatic location capture on status change |
| Offline Mode | Sync cases for offline work, upload on reconnect |
| Parts Lookup | Query parts inventory, request parts |
| Barcode Scan | Scan asset barcodes to link to cases |
| Push Notifications | Alerts for new assignments, SLA warnings |

## 9. Integration Points

| System | Direction | Method | Data |
|--------|-----------|--------|------|
| Dynamics 365 CE | Bidirectional | Dataverse Virtual Table | Customer data, case sync |
| Dynamics 365 Finance | Inbound | Custom connector | Invoicing (legal matters) |
| SAP | Inbound | OData API | Customer master data |
| Jira | Bidirectional | REST API | Development defect linkage |
| Exchange Online | Inbound | Graph API | Email-to-case |
| SharePoint | Bidirectional | Native connector | Document storage |
| Power BI | Inbound | DirectQuery | Reporting data |
| Customer Portal | Bidirectional | Dataverse Web API | Case CRUD for customers |

## 10. Performance Considerations

| Factor | Target | Design |
|--------|--------|--------|
| Case creation | < 2 seconds | Pre-validation, async plug-ins |
| Assignment | < 3 seconds | In-memory rule evaluation |
| SLA calculation | < 2 seconds | Cached business hours |
| List view load | < 3 seconds | Delegation-safe queries, paging |
| Dashboard refresh | < 5 seconds | Aggregated metrics table |
| Mobile app sync | < 10 seconds | Delta sync, compression |
| Concurrent users | 200+ | Dataverse scale groups |

## 11. Disaster Recovery

- **Dataverse**: Microsoft-managed (14-day point-in-time restore)
- **Plug-ins**: Source controlled (Azure DevOps)
- **Flows**: Solution-managed with ALM
- **Customizations**: Managed solution exports
- **RTO**: 4 hours
- **RPO**: 15 minutes
