# Dataverse Solution Playbook

> **Complexity Rating:** Medium / High
> **Last Updated:** 2024
> **Applies To:** Dataverse, Power Platform Solutions, Tables, Relationships, Plugins, Custom APIs

---

## 1. When to Use Dataverse

Use Dataverse when:

| Scenario | Why Dataverse |
|----------|--------------|
| Enterprise data storage | Security, auditing, relationships |
| Model-driven apps | Native integration |
| Complex data relationships | 1:N, N:N, N:1 with referential integrity |
| Role-based security | Row-level, field-level, hierarchical |
| Business rules (server-side) | No-code validation and logic |
| Multi-app data sharing | Central data hub |
| ALM and solution management | Managed solutions, patches |
| Integration with Dynamics 365 | Seamless extension |
| Need audit trail | Built-in auditing |
| Need calculated/rollup fields | Server-side calculations |

### Decision Matrix

| Factor | Dataverse | SharePoint Lists | SQL/Azure SQL |
|--------|-----------|-----------------|---------------|
| Relationships | Rich (cascade) | Limited | Rich |
| Security | Row/field/hierarchy | List-level | Role-based |
| Audit | Built-in | Version history | Custom |
| Cost | Premium license | Included with M365 | Azure cost |
| ALM | Excellent | Poor | Good |
| Performance (large data) | Good | Poor (5000 limit) | Excellent |
| Integration | Native | Good | Good |

---

## 2. When NOT to Use Dataverse

> **DO NOT use Dataverse when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Simple list (< 1000 items, no relationships) | SharePoint list | No premium license needed |
| Heavy reporting/analytics | Azure SQL + Power BI | Better query performance |
| Need complex SQL queries | Azure SQL | Full T-SQL support |
| Need stored procedures/triggers | Azure SQL | Full database capabilities |
| Read-only reference data | SharePoint/Excel | Simpler management |
| Budget-constrained, no premium license | SharePoint/Azure SQL | Avoid licensing cost |
| Need full-text search | Azure Cognitive Search | Better search capabilities |
| Need data warehousing | Azure Synapse | Designed for analytics |

---

## 3. Tables

### 3.1 Table Design Best Practices

| Practice | Implementation |
|----------|---------------|
| Naming convention | PascalCase, descriptive (e.g., `ProjectTask`, `InvoiceLine`) |
| Prefix custom tables | Use publisher prefix (e.g., `contoso_ProjectTask`) |
| Audit enabled | Enable for all business tables |
| Duplicate detection | Configure for key entities |
| Primary column | Use meaningful display name |
| Description | Document purpose for every table |

### 3.2 Standard Columns to Include

| Column | Type | Purpose |
|--------|------|---------|
| [Table] ID | Primary key (auto) | Unique identifier |
| Name | Primary column | Display name |
| Status | Choice (Active/Inactive) | Soft delete pattern |
| Status Reason | Choice | Detailed status |
| Owner | Lookup (User/Team) | Record ownership |
| Created On | DateTime (auto) | Audit |
| Created By | Lookup (User, auto) | Audit |
| Modified On | DateTime (auto) | Audit |
| Modified By | Lookup (User, auto) | Audit |
| Process Stage | Lookup (BPF) | Business process |

### 3.3 Column Data Types Selection

| Data Type | Use For | Notes |
|-----------|---------|-------|
| Text (Single line) | Short text, names, codes | Max 4000 chars |
| Text (Multiple lines) | Descriptions, notes | Rich text option |
| Whole Number | Integer values | No decimals |
| Decimal Number | Precise decimals (currency) | 10 decimal precision |
| Floating Point | Scientific calculations | 5 decimal precision |
| Currency | Money values | Currency field included |
| Date Only | Dates without time | Time zone handled |
| Date and Time | Timestamps | User time zone |
| Choice (Single) | Pick one from list | Local or global option set |
| Choice (Multi) | Pick multiple | Stored as flags |
| Lookup | Reference to another table | Creates relationship |
| Yes/No | Boolean | True/False |
| File | Document attachment | Stored in file storage |
| Image | Single image | Thumbnail display |
| Customer | Special lookup (Account or Contact) | Polymorphic |
| Owner | User or Team ownership | Security scope |
| Unique Identifier | GUID | System-generated |
| Autonumber | Sequential IDs | Custom format |

### 3.4 Autonumber Pattern

Use Autonumber for human-readable IDs:

| Table | Autonumber Format | Example |
|-------|------------------|---------|
| Ticket | TKT-{SEQNUM:5} | TKT-00001 |
| Invoice | INV-{YYYY}-{SEQNUM:4} | INV-2024-0001 |
| Case | CASE-{SEQNUM:6}-{YYYY} | CASE-000001-2024 |

---

## 4. Relationships

### 4.1 Relationship Types

| Type | Cardinality | Use When | Cascade |
|------|------------|----------|---------|
| One-to-Many | 1:N | Parent-child (Account has Contacts) | Configurable |
| Many-to-One | N:1 | Lookup to parent (Contact has Account) | N/A |
| Many-to-Many | N:N | Complex relationships (Contacts and Committees) | None |

### 4.2 Cascade Behavior (1:N)

| Behavior | Description | Use When |
|----------|-------------|----------|
| Cascade All | Parent action cascades to all children | Strong ownership |
| Cascade Active | Only active children affected | Soft delete pattern |
| Cascade User-Owned | Only children owned by same user | Multi-user data |
| Cascade None | No cascade | Independent records |
| Remove Link | Remove lookup reference | Keep child records |
| Restrict | Prevent parent action if children exist | Referential integrity |

> **DO NOT:** Use Cascade All Delete carelessly. Accidental parent deletion can wipe out thousands of child records.

### 4.3 Relationship Design Patterns

**Pattern: Self-Referential (Hierarchy)**
```
[Employee Table]
  |-- Employee ID
  |-- Manager ID (Lookup to Employee)
  |-- Name
  
Use for: Organization hierarchies, task hierarchies
```

**Pattern: Intersection Table (Custom N:N)**
```
[Student] --N:1-- [Enrollment] --1:N-- [Course]

Use when: Need additional attributes on the relationship
```

---

## 5. Security

### 5.1 Security Model Layers

```
Layer 1: Business Unit
  |-- Organizational scope
  |-- Data isolation between departments
  |
Layer 2: Security Role
  |-- Table-level permissions (CRUD)
  |-- Field-level permissions (Field Security Profile)
  |
Layer 3: Owner/Team
  |-- Record-level ownership
  |-- User vs. Team ownership
  |
Layer 4: Sharing
  |-- Explicit sharing
  |-- Access team sharing
  |
Layer 5: Hierarchy
  |-- Manager can see team data
  |-- Positional hierarchy
```

### 5.2 Permission Levels

| Level | Description | Access |
|-------|-------------|--------|
| None | No access | Cannot see records |
| User | Own records only | Own + shared |
| Business Unit | Same BU | All records in BU |
| Parent-Child BU | BU hierarchy | Current + child BUs |
| Organization | All records | Full tenant |

### 5.3 Field Security Profiles

Use for sensitive fields:

| Field Type | Security Approach |
|-----------|-------------------|
| PII (SSN, DOB) | Field Security Profile - restricted |
| Financial data | Field Security Profile - role-based |
| Internal notes | Field Security Profile - internal only |
| Public fields | No field security |

---

## 6. Plug-ins

### 6.1 When to Use Plug-ins

Use plug-ins when:
- Server-side validation is required
- Complex business logic cannot be expressed in business rules
- Integration with external systems on data change
- Data transformation before save
- Audit/compliance logging required

### 6.2 Plug-in Registration

| Event | Timing | Use Case |
|-------|--------|----------|
| Pre-Validation | Before validation | Early validation |
| Pre-Operation | Before database operation | Modify data before save |
| Post-Operation | After database operation | Notifications, integrations |

| Stage | Use When |
|-------|----------|
| Synchronous | Must complete before response, real-time validation |
| Asynchronous | Can be delayed, notifications, non-critical |

### 6.3 Plug-in Best Practices

> **DO NOT:**
> - Make synchronous HTTP calls from plug-ins (performance impact)
> - Write long-running logic in synchronous plug-ins
> - Use plug-ins for UI-only logic
> - Register plug-ins without proper error handling
> - Forget to unregister development plug-ins

**DO:**
> - Use asynchronous for external calls
> - Implement proper exception handling
> - Use tracing service for debugging
> - Keep execution time minimal
> - Use pre-images/post-images correctly
> - Write unit tests for plug-in logic

---

## 7. Custom APIs

### 7.1 When to Use Custom APIs

Use Custom APIs when:
- Need custom server-side operation
- Complex logic that should be reusable
- Abstracting integration complexity
- Need custom request/response structure
- Triggering server logic from canvas apps

### 7.2 Custom API vs. Plug-in vs. Flow

| Aspect | Custom API | Plug-in | Power Automate |
|--------|-----------|---------|----------------|
| Trigger | Explicit call | Data event | Various triggers |
| Reusability | High (callable from anywhere) | Medium (bound to events) | High |
| Complexity | Medium-High | High | Low-Medium |
| Performance | Fast | Fast | Slower (has overhead) |
| Error handling | Structured | Try-catch | Built-in |
| Monitoring | Custom | Tracing | Built-in |

### 7.3 Custom API Configuration

```
Custom API: contoso_CreateInvoiceFromOrder
  |
  +-- Display Name: Create Invoice From Order
  +-- Bound To: Order (Entity)
  +-- Description: Creates an invoice from an order
  |
  +-- Request Parameters:
  |     +-- InvoiceDate (Date, Optional)
  |     +-- DueDate (Date, Optional)
  |     +-- Notes (String, Optional)
  |
  +-- Response Properties:
  |     +-- InvoiceId (Unique Identifier)
  |     +-- InvoiceNumber (String)
  |     +-- TotalAmount (Money)
  |
  +-- Plug-in Type: contoso.Plugins.CreateInvoicePlugin
```

---

## 8. Business Rules

### 8.1 Business Rule Scope

| Scope | Applies To |
|-------|-----------|
| Entity | All forms, server-side |
| All Forms | All forms, client-side |
| Specific Form | Selected form only |

### 8.2 Common Business Rules

| Rule | Condition | Actions |
|------|-----------|---------|
| Show/Hide Section | Status = "Approved" | Show approval section |
| Set Required | Priority = "High" | Set due date required |
| Set Default Value | Record created | Set status to "New" |
| Lock Fields | Status = "Completed" | Lock all fields |
| Calculate Field | Quantity and Price entered | Set Total = Qty * Price |

---

## 9. Development Steps

### 9.1 Table Development Checklist

- [ ] Design ERD (entity relationship diagram)
- [ ] Create tables with proper naming
- [ ] Add columns with correct data types
- [ ] Create relationships with appropriate cascade
- [ ] Configure primary column and autonumber
- [ ] Enable auditing
- [ ] Set up duplicate detection rules
- [ ] Create business rules
- [ ] Configure security roles
- [ ] Set up field security profiles
- [ ] Create indexes for performance
- [ ] Add descriptions to all tables and columns
- [ ] Document data model

### 9.2 Solution Organization

```
Solution: ContosoCore
  |
  +-- Tables
  |     +-- contoso_Project
  |     +-- contoso_Task
  |     +-- contoso_Invoice
  |
  +-- Relationships
  |     +-- Project -> Task (1:N)
  |     +-- Project -> Invoice (1:N)
  |
  +-- Choices
  |     +-- contoso_ProjectStatus
  |     +-- contoso_Priority
  |
  +-- Security Roles
  |     +-- contoso Project Manager
  |     +-- contoso Project User
  |
  +-- Business Rules
  |     +-- contoso_Project: Set Defaults
  |     +-- contoso_Task: Validate Due Date
```

---

## 10. Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| CRUD operations | Dataverse API / Model app | Records create, read, update, delete |
| Relationship cascade | Create parent, add children, delete parent | Cascade behavior correct |
| Security - role A | Login as role A | Only authorized CRUD |
| Security - role B | Login as role B | Different permissions |
| Field security | Access sensitive field | Hidden/uneditable as configured |
| Business rules | Trigger conditions | Fields show/hide/set correctly |
| Plug-in execution | Trigger plug-in event | Plug-in runs, correct result |
| Custom API | Call via API | Correct response |
| Audit trail | View audit history | All changes logged |
| Duplicate detection | Create duplicate | Duplicate detected/rejected |
| Autonumber | Create records | Sequential IDs generated |
| Rollup fields | Create child records | Parent rollup correct |
| Calculated fields | Update source values | Calculated value updates |
| Performance (1000+ records) | Bulk operations | Acceptable performance |

---

## 11. Licensing

| Component | License Required |
|-----------|-----------------|
| Dataverse (per user) | Power Apps per user ($20/mo) |
| Dataverse (per app) | Power Apps per app ($10/mo) |
| Database storage | Included (10 GB base), then $48/GB/month |
| File storage | Included (20 GB base), then $2.40/GB/month |
| API calls | Included (base allocation) |

---

## 12. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Complex data model changes | High | Plan carefully, use patches |
| Plug-in performance | High | Async for external calls, optimize queries |
| Security misconfiguration | Critical | Regular audits, least privilege |
| Storage cost escalation | Medium | Monitor capacity, archival strategy |
| Plugin assembly trust | Medium | Register in sandbox first |
| Solution layering issues | Medium | Understand layering, test upgrades |
| API limit throttling | Medium | Batch operations, caching |
