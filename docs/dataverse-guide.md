---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-apps/maker/data-platform/types-of-entities
  - https://learn.microsoft.com/en-us/power-apps/maker/data-platform/types-of-fields
  - https://learn.microsoft.com/en-us/power-apps/maker/data-platform/define-rollup-fields
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/power-platform/admin/backup-restore-environments
  - https://learn.microsoft.com/en-us/power-apps/developer/data-platform/analyze-performance
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution
  - https://learn.microsoft.com/en-us/power-automate/replace-workflows-with-flows
---

# Dataverse Comprehensive Guide

> **Version**: 1.1 | **Last updated**: 2026-06-19
> **Applies to**: Microsoft Dataverse (formerly Common Data Service)
> **Verified as of**: 2026-06-19 against Microsoft Learn (platform state 2026-H1). Capacity limits, licensing, and preview features change frequently — reconfirm against the linked Microsoft Learn pages before relying on exact figures.

---

## 1. Architecture Overview

```
+----------------------+     +---------------------+     +------------------+
|   Tables             |     |   Security          |     |   Business Logic |
|   (Entities)         |     |   Model             |     |   Layer          |
|----------------------|     |---------------------|     |------------------|
| - Standard           |     | - Business Units    |     | - Business Rules |
| - Custom             |     | - Security Roles    |     | - Cloud Flows    |
| - Virtual            |     | - Teams             |     | - Classic WF     |
| - Elastic            |     | - Field Security    |     | - Plugins        |
| - Activity           |     | - Row-level         |     | - Custom APIs    |
+----------------------+     +---------------------+     +------------------+
          |                              |                           |
          v                              v                           v
+----------------------+     +---------------------+     +------------------+
|   Columns            |     |   Users             |     |   ALM            |
|----------------------|     |---------------------|     |------------------|
| - Text, Number       |     | - Licensed Users    |     | - Solutions      |
| - Lookup, Choice     |     | - Application Users |     | - Managed/Unmanaged|
| - Date, Currency     |     | - Service Principals|     | - Environments   |
| - Image, File        |     | - Team Users        |     | - Pipelines      |
| - Formula, Rollup    |     |                     |     | - Dataflows      |
+----------------------+     +---------------------+     +------------------+
```

---

## 2. Tables and Columns

### 2.1 Creating Tables (Best Practices)

```
Naming convention:
  - Table: Prefix meaningful name (e.g., contoso_Project, contoso_Timesheet)
  - Columns: camelCase with prefix (e.g., contoso_startDate, contoso_budgetAmount)
  - Choices: Prefix + category (e.g., contoso_projectStatus)
  - Always set description on tables and columns

Required columns for every custom table:
  - Name/Title (primary column)
  - Status (active/inactive or business status)
  - Owner (automatic, but configure assignment)
  - Created On, Modified On (automatic)
  - Created By, Modified By (automatic)
```

### 2.2 Column Types Quick Reference

Column type limits below are confirmed against [Column data types in Microsoft Dataverse (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/types-of-fields).

| Column Type | Use For | Notes |
|-------------|---------|-------|
| Single Line Text | Short text, names, IDs | Max 4,000 chars (confirmed) |
| Multiple Lines Text | Descriptions, notes | Rich text or plain |
| Whole Number | Integer values | No decimals |
| Decimal Number | Precise decimals | Up to 10 decimal places (confirmed); range +/-100,000,000,000 |
| Floating Point | Scientific calculations | Less precise than decimal (max 5 decimal places, per Microsoft Learn) |
| Currency | Money values | Auto currency conversion |
| Date Only | Birthdays, deadlines | No time component |
| Date and Time | Timestamps, events | Includes timezone |
| Choice (Single) | Dropdown, radio buttons | Define options in table |
| Choice (Multi) | Multi-select | Stored as delimited |
| Lookup | Reference to another table | Creates relationship |
| Yes/No | Boolean flags | True/False |
| Image | Single image per record | Stored in file storage |
| File | Attachments | Stored in file storage |
| Customer | Polymorphic lookup | Account OR Contact |
| Owner | Team or User assignment | Automatic behavior |
| Unique Identifier | GUID references | System-managed |
| Autonumber | Sequential IDs | Configurable format |
| Formula | Calculated values | Read-only, no code |
| Rollup | Aggregated values | Async calculation |
| Multi-select Picklist | Multiple choices | Delimited storage |

### 2.3 Calculated Columns vs Rollup Columns vs Business Rules

| Feature | When to Use | Limitations |
|---------|-------------|-------------|
| **Calculated Column** | Formula-based derived value (no code) | Can't reference related table fields, read-only, sync |
| **Rollup Column** | Aggregate from child records | Async — the system Calculate Rollup Field job recalculates hourly by default (confirmed), only certain aggregates ([Microsoft Learn](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/define-rollup-fields)) |
| **Business Rule** | Client-side validation, show/hide | Single table only, limited logic |
| **Cloud Flow** | Cross-table logic, external API | Async, requires flow license |
| **Plugin** | Real-time server-side, complex logic | Requires C# developer |

```
Calculated Column Example:
  Name: contoso_fullName
  Type: Calculated
  Formula: contoso_firstName + " " + contoso_lastName
  // Updates immediately when source fields change

Rollup Column Example:
  Name: contoso_totalInvoiceAmount
  Type: Rollup
  Related: Invoices (child)
  Aggregation: SUM of invoiceAmount WHERE status = Paid
  // Updated by the Calculate Rollup Field system job, hourly by default
  // (admin can modify recurrence). Confirmed against Microsoft Learn.
```

---

## 3. Relationships

### 3.1 Relationship Types

| Type | Cardinality | Use Case | Behavior |
|------|------------|----------|----------|
| **Many-to-One (N:1)** | Many records -> One parent | Account lookup on Contact | Lookup column |
| **One-to-Many (1:N)** | One parent -> Many children | Account -> Contacts | Subgrid on form |
| **Many-to-Many (N:N)** | Many <-> Many | Contacts <-> Events | Intermediate table (hidden) |

### 3.2 Cascade Behavior (1:N Relationships)

```
Cascade Type          | Description                          | Use When
----------------------|--------------------------------------|--------------------------
Cascade All           | Parent action applies to all children| Strong ownership
Cascade Active        | Applies to active children only      | Soft-delete scenarios
Cascade User-Owned    | Applies to children owned by user    | Multi-owner scenarios
Cascade None          | No automatic cascade                 | Independent children
Remove Link           | Unlink child on parent delete        | Shared children
Restrict              | Prevent delete if children exist     | Referential integrity
```

**Best Practice**: Use "Cascade None" or "Remove Link" for most relationships. "Cascade All" delete can accidentally delete thousands of records.

### 3.3 Creating Relationships

```
Step 1: Table > Relationships > New relationship
Step 2: Select relationship type (1:N, N:N)
Step 3: Select related table
Step 4: Configure behavior:
  - Cascade: None (default safe choice)
  - Delete: Restrict or Remove Link
  - Reparent: Cascade None
  - Share: Cascade None
  - Unshare: Cascade None
Step 5: Configure navigation:
  - Display label: "Invoices" (what users see)
  - Customizable: Yes
Step 6: Save and publish
```

---

## 4. Security Model

### 4.1 Business Units (BU)

```
Hierarchy:
  Root BU (tenant)
  |
  +-- Sales Division
  |   +-- North America
  |   |   +-- East Region
  |   |   +-- West Region
  |   +-- EMEA
  |
  +-- Service Division
      +-- Tier 1 Support
      +-- Tier 2 Support

CRITICAL: Plan BU structure BEFORE creating data.
Changing BU structure after go-live is difficult.

Best practices:
- Keep it flat (max 3-4 levels)
- Mirror organizational structure
- Each user belongs to ONE BU
- Records can be assigned to any BU via owner
```

### 4.2 Security Roles

```
Built-in roles (use as reference only, don't assign directly):
  - System Administrator (full access, assign sparingly)
  - System Customizer (can customize, can't see all data)
  - Basic User (minimum access, use as template)

Creating custom roles:
Step 1: Settings > Security > Security Roles > New
Step 2: Copy from "Basic User" (starts with minimum)
Step 3: Configure tab by tab:
  - Core Records: Contacts, Activities, Notes
  - Custom Tables: Your app tables
  - Business Management: Teams, Users (usually none)
  - Customization: None for end users
  - Privacy: As needed
Step 4: Set privilege levels:
  - None: No access
  - User: Own records only
  - Business Unit: Own + same BU
  - Parent: Child BUs: Own + same + child BUs
  - Organization: All records

Example role - "Case Worker":
  Case table: Read (BU), Create (User), Write (User), Delete (None)
  Contact table: Read (BU), Create (User), Write (User), Delete (None)
  Account table: Read (BU), Create (None), Write (None), Delete (None)
```

### 4.3 Teams and Ownership

```
Owner Types:
1. User-owned: Individual user owns record
2. Team-owned: Team owns record (any member has access)

Access Team (no ownership):
  - Share record with team on case-by-case basis
  - Dynamic - members change per record
  - No need to reassign records

Owner Team (owns records):
  - Team owns records explicitly
  - All members have same access
  - Used for queue-based work distribution

Best Practice: 
- Use Access Teams for ad-hoc collaboration
- Use Owner Teams for queue-based routing
- Avoid reassigning records frequently (audit trail noise)
```

### 4.4 Field-Level Security

```
Use when: Sensitive fields need extra protection
  - Social Security Numbers
  - Salary information
  - Credit card data

Setup:
1. Table > Column > ... > Enable Field Security
2. Settings > Security > Field Security Profiles
3. Create profile, add users/teams
4. Set permissions: Read/Update/Create (yes/no)

Limitations:
- Only works with Dataverse forms
- Canvas apps don't enforce FLS (must build separately)
- Plugins run in system context (see all fields)
- Only for custom fields (not system fields)
```

### 4.5 Application Users and Service Principals

```
// For server-to-server authentication (no human user)

Step 1: Azure AD > App Registration > New
  - Name: Dataverse-Integration-App
  - Supported account types: Single tenant

Step 2: Certificates & Secrets > New client secret
  - Copy secret value immediately

Step 3: Power Platform Admin Center > Environments > Settings
  - Users + permissions > Application users
  - New app user
  - Select app registration from Azure AD
  - Assign security role

Step 4: Use client credentials OAuth flow:
  POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
  grant_type=client_credentials
  client_id={app_id}
  client_secret={secret}
  scope=https://{org}.crm.dynamics.com/.default

Security Note: Store secrets in Azure Key Vault, never in code.
```

---

## 5. Business Rules vs Classic Workflows vs Cloud Flows

### Decision Matrix

| Need | Use | Don't Use |
|------|-----|-----------|
| Show/hide field | Business Rule | Cloud Flow |
| Set field value | Business Rule / Cloud Flow | Plugin |
| Field validation | Business Rule + JS | Cloud Flow |
| Cross-table update | Cloud Flow | Business Rule |
| Real-time validation | Business Rule (client) | Cloud Flow (too slow) |
| Async process | Cloud Flow | Classic WF (deprecated) |
| Complex server logic | Plugin | Business Rule |
| Schedule-based | Cloud Flow (scheduled) | Classic WF |

### Classic Workflow Migration

Microsoft positions classic Dataverse workflows as legacy and recommends building new
automation with Power Automate cloud flows; it explicitly advises reviewing and replacing
existing classic background workflows with flows. Note: as of 2026-06-19 there is no
published hard end-of-support / retirement date for classic background or real-time
workflows themselves (the formal retirement applies to the Dataverse *legacy connector*,
not the workflow engine). See [Replace classic Dataverse workflows with Power Automate
(Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/replace-workflows-with-flows).
Custom process actions remain synchronous real-time workflows and are not convertible to flows.

```
Classic Workflows are LEGACY — migrate to Power Automate where practical.

Migration path:
  Classic Workflow (real-time) -> Business Rule + Cloud Flow
  Classic Workflow (background)  -> Cloud Flow (automated)
  Classic Workflow (approval)    -> Power Automate Approval

Action: Audit all classic workflows. Plan migration to cloud flows.
```

---

## 6. Plugins

### 6.1 When to Use Plugins

```
Use plugins when:
- Real-time server-side logic is required
- Complex validation across multiple fields
- External API call must happen synchronously
- Data must be consistent (rollback on failure)
- Performance critical (faster than cloud flow)

Don't use plugins when:
- Cloud flow can do it (easier to maintain)
- Logic is simple (use business rule)
- No developer on team
- Async is acceptable (use cloud flow)
```

### 6.2 Plugin Registration

```bash
# Build plugin
dotnet build MyPlugin.csproj

# Use Plugin Registration Tool (PRT)
# Download from NuGet: Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool

PRT Steps:
1. Connect to environment
2. Register new assembly
3. Register new step:
   - Message: Create / Update / Delete / Retrieve / Assign
   - Primary Entity: Your table name
   - Event Pipeline: Pre-validation / Pre-operation / Post-operation
   - Execution Mode: Synchronous / Asynchronous
   - Stage: 10 (pre-validation), 20 (pre-op), 40 (post-op)
4. Add image (pre-image / post-image) if needed
5. Test thoroughly
```

### 6.3 Plugin Best Practices

```csharp
// DO: Use tracing service for debugging
tracingService.Trace("Processing account: {0}", entity.Id);

// DO: Handle exceptions gracefully
try {
    // plugin logic
} catch (Exception ex) {
    tracingService.Trace("Error: {0}", ex.ToString());
    throw new InvalidPluginExecutionException("User-friendly error message");
}

// DO: Use early-bound types
target.GetAttributeValue<string>("contoso_name");

// DO NOT: Make long-running external calls. Dataverse enforces a HARD 2-minute limit
//         per message operation (covers the operation + all synchronous plugins; async
//         registration does NOT extend it). Confirmed against Microsoft Learn:
//         https://learn.microsoft.com/en-us/power-apps/developer/data-platform/analyze-performance
//         Note: the default .NET HttpClient timeout is 100s — set a shorter timeout and fail fast.
// DO NOT: Query entire tables (use filters)
// DO NOT: Forget to unregister test plugins
// DO NOT: Use plugins when cloud flows suffice
```

### 6.4 Plugin Tracing

```
View plugin trace logs:
1. Settings > Administration > System Settings
2. Customization tab: Enable logging to plug-in trace log
3. View logs: Advanced Find > Plugin Trace Log
4. Or query via Web API: /api/data/v9.2/plugintracelogs

In code:
  tracingService.Trace("Step 1: Validating input");
  tracingService.Trace("Step 2: Processing entity {0}", entity.LogicalName);
  tracingService.Trace("Step 3: Complete");
```

---

## 7. Custom APIs

### 7.1 Creating Custom APIs

```
Step 1: Create via maker portal or solution import
  Solution > New > More > Custom API

Step 2: Configure:
  - Unique name: contoso_ApproveBudget
  - Display name: Approve Budget
  - Description: Approves a budget and notifies stakeholders
  - Bound to: None (unbound) / Entity (entity-bound) / Entity Collection
  - Allowed customization: False (recommended)

Step 3: Define Request Parameters:
  - budgetId (Unique Identifier, Required)
  - approvedAmount (Decimal, Required)
  - approverComments (String, Optional)

Step 4: Define Response Properties:
  - approvalStatus (String)
  - approvedBy (String)
  - approvalDate (DateTime)

Step 5: Create Plugin Step:
  - Register plugin for Custom API message
  - Or use low-code plugin (preview)

Step 6: Call via Web API:
  POST /api/data/v9.2/contoso_ApproveBudget
  Body: {
    "budgetId": "550e8400-e29b-41d4-a716-446655440000",
    "approvedAmount": 50000.00,
    "approverComments": "Approved with conditions"
  }
```

### 7.2 When to Use Custom APIs

```
Use Custom APIs when:
- Need a clean API endpoint for external systems
- Encapsulating complex multi-step operations
- Want typed parameters (vs generic Create/Update)
- Building a plugin wrapper for REST consumption

Don't use when:
- Standard CRUD operations suffice
- Cloud flow with HTTP trigger works
- Simple single-table operations
```

---

## 8. Virtual Tables

### 8.1 Virtual Table Setup

```
Purpose: Display external data in Dataverse without copying it

Setup via Virtual Connector Provider:
1. Settings > Advanced settings > Administration > Virtual Entity Data Sources
2. New data source (SQL, SharePoint, OData, etc.)
3. Create virtual table mapped to external source
4. Add to model-driven app form/view

Limitations:
- Read-only in most cases
- No offline support
- Performance depends on external source
- No Dataverse business rules/plugins
- Limited to 1 data source per virtual table

Use when:
- Read-only reference data in legacy system
- Don't want to migrate data
- Data changes frequently in source

Don't use when:
- Users need to edit the data
- Performance is critical
- Complex relationships needed
```

---

## 9. Auditing and History

### 9.1 Enabling Auditing

```
Step 1: Environment-level:
  Power Platform Admin Center > Environment > Settings > Auditing
  [x] Start auditing
  [x] Audit user access

Step 2: Table-level:
  Table > Properties > Advanced options
  [x] Audit changes to its data

Step 3: Field-level:
  Column > Advanced options
  [x] Enable auditing

Step 4: View audit history:
  Record form > Related > Audit History
  OR: Advanced Find > Audit Summary
```

### 9.2 Audit Log Retention

```
Default: Per environment settings
- Can configure retention period
- Old logs auto-deleted
- Export to long-term storage if needed

Query audit logs via Web API:
  GET /api/data/v9.2/audits?$filter=_objectid_value eq {record-id}
  &$orderby=createdon desc
```

---

## 10. Backup and Restore Strategies

### 10.1 System Backups (Automatic)

Verified against [Back up and restore environments (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/backup-restore-environments).

```
Dataverse creates automatic ("system") backups:
- System backups run automatically and continuously (Azure SQL Database under the hood) —
  not a single nightly snapshot.
- Default retention is 7 days. (The old "28 days for everyone" figure is incorrect.)
- 28-day retention is NOT universal:
    * Production environments with one or more Dynamics 365 apps installed are
      retained for 28 days automatically.
    * Production MANAGED ENVIRONMENTS can be configured to 7, 14, 21, or 28 days.
    * All other (non-production / non-managed) environments use the 7-day default
      regardless of the setting.
- Manual: create on-demand via admin center (manual backups follow the same
  configured retention period).

Restore:
  Power Platform Admin Center > Environment > Backups
  Select backup > Restore
  NOTE: You can't restore directly to a production environment — first switch the
        environment type to Sandbox, restore, then switch back to Production.
  WARNING: Restore overwrites the target environment.

Best practice: Restore to a NEW (or sandbox) environment first to verify.
```

### 10.2 Solution-Based Backup

For granular recovery, use solutions. The `pac solution export` flags below (`--path`,
`--name`, `--managed`) are confirmed against the [pac solution command reference
(Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution).
`--managed` is a switch (its presence exports a managed solution; omit it for unmanaged).

```
For granular recovery, use solutions:

Export before major changes:
  pac solution export --path ./backup/pre-change.zip --name MySolution --managed
  pac solution export --path ./backup/pre-change-unmanaged.zip --name MySolution

Store in source control:
  git add ./backup/
  git commit -m "Pre-release backup"

This gives you component-level restore capability.
```

### 10.3 Data Backup via Data Export

```
For data-level backup:

Option 1: Synapse Link (near real-time to Data Lake)
Option 2: Power Automate scheduled export to SharePoint
Option 3: Configuration Migration Tool (for config data)
  - Download from NuGet: Microsoft.CrmSdk.XrmTooling.ConfigurationMigration
  - Create schema.xml with tables/columns to export
  - Export to .zip file
  - Import to restore
```

---

## 11. ALM with Solutions

### 11.1 Solution Structure Best Practices

```
Recommended solution layering:

Layer 1: Foundation
  - Tables, columns, relationships
  - Security roles
  - Choice columns
  - Business rules

Layer 2: App Layer
  - Model-driven app definition
  - Forms, views, charts
  - Site map
  - Custom pages

Layer 3: Automation
  - Cloud flows
  - Connection references
  - Environment variables
  - Custom connectors

Layer 4: Extension (optional)
  - Plugins
  - Custom APIs
  - PCF components
  - Web resources
```

### 11.2 Managed vs Unmanaged Solutions

| Aspect | Unmanaged | Managed |
|--------|-----------|---------|
| **Use in** | Development only | Test, Production |
| **Can edit components** | Yes | No (requires patch) |
| **Layering** | Overwrites | Stacks |
| **Delete components** | Yes | Can't delete (must use patch) |
| **Dependency handling** | Loose | Strict |

```
Golden Rule:
  DEV  -> Unmanaged (edit freely)
  TEST -> Managed (from DEV export)
  PROD -> Managed (from TEST promotion)

Never edit components directly in TEST/PROD.
Always edit in DEV, export managed, import to target.
```

---

## 12. Capacity and Storage

### 12.1 Capacity Types

Dataverse capacity-based storage has THREE pooled types — Database, File, and Log — pooled
at the tenant level (not per-environment). What counts toward each is confirmed against
[Dataverse capacity-based storage details (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage).

| Type | What Counts |
|------|-------------|
| Database | Table rows, metadata, relational data, indexes (everything not file/log) |
| File | Attachments, Annotation/Attachment bodies, file/image column data |
| Log | Audit logs (AuditBase), plugin trace logs (PlugInTraceLogBase), elastic tables |

> **Correction (2026-06-19):** Earlier versions of this guide listed per-user accruals of
> "10MB database / 20MB file / 2MB log per user license." Those figures reflect the
> *legacy* (pre-April 2019) storage model and are no longer accurate. In the current
> capacity-based model, per-user accruals **vary by license SKU** (e.g. Team Member
> licenses grant no per-user storage at all) and the authoritative figures live in the
> [Power Platform Licensing Guide](https://go.microsoft.com/fwlink/p/?linkid=2085130). Exact
> per-SKU MB/GB accruals are not published on a single Microsoft Learn conceptual page and so
> are left here as **(unverified as of 2026-06-19 — confirm against the Power Platform
> Licensing Guide)**.

```
Confirmed baselines (Microsoft Learn, capacity-storage):
  - Default environment included capacity: 3 GB Database, 3 GB File, 1 GB Log.
  - Every environment consumes at least 1 GB, even without an associated database.
  - Storage types are not fully fungible: excess File entitlement can't cover a
    Database or Log deficit (but excess Database can cover Log/File overuse).
  - Trial, preview, support, and developer environments don't count toward capacity.

Per-license accrual example (ILLUSTRATIVE ONLY — confirm exact figures against the
Power Platform Licensing Guide; do not quote these as fact):
  100 Power Apps users -> pooled Database + File + Log entitlement added to the
  tenant pool at the per-SKU rate published in the Licensing Guide.

Monitor:
  Power Platform Admin Center > Licensing > Capacity add-ons (Summary / Dataverse tabs)
  Capacity warning notifications fire at <15% remaining, again at <5% remaining,
  then on overage. Set your own alerting before those thresholds.
```

### 12.2 Storage Optimization

```
DO:
[+] Archive old data (move to separate table or export)
[+] Remove unused attachments
[+] Use File columns for large documents (not Multiple Lines Text)
[+] Compress images before upload
[+] Clean up audit logs (if not needed)
[+] Archive plugin trace logs older than 30 days
[+] Use elastic tables for high-volume, short-lived data

DON'T:
[X] Store base64 images in text columns
[X] Keep years of audit data in active environment
[X] Upload multi-MB documents to every record
[X] Create unnecessary indexes
```

### 12.3 Elastic Tables

Elastic tables are now a generally available, first-class Dataverse table type (listed
alongside Standard, Activity, and Virtual in [Types of tables (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/types-of-entities);
the earlier "(Preview)" label in this guide is outdated). They're powered by Azure Cosmos DB
and intended for very large datasets (tens of millions of rows and up).

```
Use for: High-volume datasets / spiky, rapidly growing or semi-structured workloads
  - IoT telemetry
  - Log entries
  - Event streams
  - Chat messages

Characteristics:
  - Horizontal (elastic) scaling, low-latency point lookups
  - Per-record time-to-live (TTL) column support
  - Logical partitioning; JSON-format single-line-of-text columns
  - Some standard-table features are NOT supported, e.g.:
      * N:N relationships aren't supported; 1:N is limited (no cascading)
      * Deep insert isn't supported (create related records independently)
      * Strong consistency only within a logical session
```

---

## 13. When to Use Dataverse vs Alternatives

| Scenario | Dataverse | SharePoint | SQL Azure | Excel |
|----------|-----------|------------|-----------|-------|
| Complex relationships | YES | No | Yes | No |
| Row-level security | YES | Limited | Yes | No |
| Model-driven apps | YES | No | No | No |
| Mobile offline | YES | Limited | No | No |
| ALM/Governance | YES | Poor | Good | No |
| Cost (small) | Included | Included | Extra | Included |
| Cost (large) | Scale | Good | Good | N/A |
| Document-centric | No | YES | No | No |
| Existing SQL apps | Via virtual | No | YES | No |
| Quick prototype | Maybe | YES | No | YES |

**Our recommendation**: Start with Dataverse for any serious business app. Use SharePoint only for document-heavy scenarios or prototypes with clear migration path.

---

*End of Dataverse Guide. Verified as of 2026-06-19 against Microsoft Learn (platform state 2026-H1). Limits, pricing, and feature availability change frequently — reconfirm exact figures (especially per-SKU storage accruals and preview/GA status) against current Microsoft documentation before relying on them.*
