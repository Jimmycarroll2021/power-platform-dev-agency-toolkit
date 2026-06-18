# SharePoint to Dataverse Migration Playbook

> **Complexity Rating:** High
> **Last Updated:** 2024
> **Applies To:** Data Migration, SharePoint Lists, Dataverse, Power Platform

---

## 1. When to Migrate from SharePoint to Dataverse

Migrate when you hit these SharePoint limitations:

| Limitation | SharePoint Limit | Dataverse Advantage |
|-----------|-----------------|-------------------|
| List size | 30M items (theoretical), performance degrades at 100k+ | Millions of rows, designed for scale |
| Relationships | Lookup columns only (limited) | Rich relationships (1:N, N:N, cascade) |
| Security | List-level only | Row-level, field-level, hierarchical |
| Business rules | Limited (column validation) | Server-side business rules, plugins |
| Audit | Version history (limited) | Full audit trail |
| Complex queries | 5000 item view threshold | Delegable queries, indexes |
| Model-driven apps | Not supported | Native support |
| Offline sync | Limited | Robust offline |
| API limits | Throttled at high volume | Higher throughput |
| Transactional integrity | No | Full ACID transactions |

### Decision Matrix

| Factor | Stay in SharePoint | Migrate to Dataverse |
|--------|-------------------|---------------------|
| Record count | < 10,000 | > 50,000 |
| Relationships | Simple lookups | Complex relationships |
| Security needs | Simple | Complex (row/field level) |
| Apps needed | Simple lists | Model-driven apps |
| Document-centric | Yes (files) | No (structured data) |
| Budget | Tight (no premium license) | Has Power Apps license |
| Team collaboration | Primary use | Secondary |

---

## 2. Migration Approach

### 2.1 Migration Strategies

| Strategy | Description | Use When |
|----------|-------------|----------|
| Big Bang | Migrate all data in one go | Small datasets (< 50k), simple schema |
| Phased | Migrate table by table | Medium datasets, dependencies |
| Parallel | Run both systems, sync data | Large datasets, zero downtime |
| Greenfield | Start fresh, archive old data | Data quality issues, legacy cleanup |
| Hybrid | Keep some in SharePoint, move some | Document libraries stay, lists move |

### 2.2 Migration Architecture

```
[SharePoint Lists]
       |
       v
[Step 1: Assessment]
       |-- Analyze lists, columns, data volumes
       |-- Identify relationships
       |-- Assess data quality
       |
       v
[Step 2: Data Mapping]
       |-- Map SharePoint columns to Dataverse columns
       |-- Design relationships
       |-- Plan transformations
       |
       v
[Step 3: Dataverse Setup]
       |-- Create tables
       |-- Create columns
       |-- Set up relationships
       |-- Configure security
       |
       v
[Step 4: Migration]
       |-- Extract from SharePoint
       |-- Transform data
       |-- Load into Dataverse
       |-- Validate
       |
       v
[Step 5: Cutover]
       |-- Switch apps to Dataverse
       |-- Archive SharePoint lists
       |-- Decommission
```

---

## 3. Assessment

### 3.1 Assessment Checklist

For each SharePoint list:

| # | Assessment Item | Details |
|---|----------------|---------|
| 1 | List name and purpose | |
| 2 | Item count | |
| 3 | Column count and types | |
| 4 | Lookup columns (relationships) | |
| 5 | Calculated columns | |
| 6 | Attachments | |
| 7 | Workflow associations | |
| 8 | Power Apps using this list | |
| 9 | Power Automate flows using this list | |
| 10 | Power BI reports using this list | |
| 11 | Data quality issues | |
| 12 | Access permissions | |
| 13 | Content types | |
| 14 | Views and filters | |

### 3.2 Data Volume Assessment

| List | Item Count | Attachment Size | Complexity | Migration Priority |
|------|-----------|----------------|------------|-------------------|
| | | | | |

### 3.3 Data Quality Assessment

| Issue | Count | Severity | Resolution |
|-------|-------|----------|------------|
| Duplicate records | | | Deduplicate before migration |
| Missing required fields | | | Fill defaults or flag |
| Invalid data formats | | | Transform during migration |
| Orphaned references | | | Fix or remove |
| Inconsistent values | | | Standardize |

---

## 4. Data Mapping

### 4.1 Column Type Mapping

| SharePoint Type | Dataverse Type | Notes |
|----------------|---------------|-------|
| Single line of text | Text (Single line) | |
| Multiple lines of text | Text (Multiple lines) | Rich text option |
| Choice | Choice | Local or global |
| Number | Whole Number / Decimal / Float | Based on precision |
| Currency | Currency | Includes currency field |
| Date and Time | Date Only / Date and Time | Time zone handling |
| Lookup | Lookup | Creates relationship |
| Yes/No | Yes/No | |
| Person or Group | Lookup (User/Team) | |
| Hyperlink | Text (URL format) | |
| Picture | Text (URL) or Image | |
| Calculated | Calculated column (Dataverse) | Or formula column |
| Attachments | File column or Notes | Separate handling |

### 4.2 Data Mapping Document

| Source (SharePoint) | Target (Dataverse) | Transformation | Validation |
|--------------------|-------------------|----------------|------------|
| List: Projects | Table: contoso_Project | | |
| Column: Title | Column: contoso_name | | Required |
| Column: Status | Column: contoso_status | Map values | Choice valid |
| Column: AssignedTo | Column: ownerid | Resolve user | User exists |
| Column: StartDate | Column: contoso_startdate | | Valid date |
| Column: Budget | Column: contoso_budget | Parse currency | > 0 |

### 4.3 Relationship Mapping

```
SharePoint:
  Projects list --> Lookup to --> Clients list
  Tasks list --> Lookup to --> Projects list

Dataverse:
  contoso_Project table --> N:1 --> contoso_Client table
  contoso_Task table --> N:1 --> contoso_Project table
```

---

## 5. Migration Execution

### 5.1 Migration Methods

| Method | Best For | Speed | Complexity |
|--------|---------|-------|------------|
| Power Automate | Small datasets (< 10k) | Slow | Low |
| Excel Import Wizard | Very small (< 1k), simple | Medium | Low |
| Dataflows | Medium datasets (10k-100k) | Medium | Medium |
| KingswaySoft (SSIS) | Large datasets (> 100k) | Fast | High |
| Cozyroc (SSIS) | Large datasets | Fast | High |
| Custom Azure Function | Complex transformations | Fast | High |
| Configuration Migration Tool | Schema + reference data | N/A | Low |

### 5.2 Power Automate Migration Pattern

```
[Scheduled Trigger: Every 5 minutes]
       |
       v
[SharePoint: Get items]
       |-- Top count: 500
       |-- Filter: Migrated = No (or use status column)
       |
       v
[Apply to each: SharePoint items]
       |
       +--[Transform data]
       |     +-- Parse dates
       |     +-- Convert choices
       |     +-- Resolve lookups
       |
       +--[Dataverse: Add row]
       |     +-- Map all columns
       |
       +--[SharePoint: Update item]
             +-- Set Migrated = Yes
             +-- Set DataverseID = [new record ID]
```

> **DO NOT:** Use Power Automate for > 50k records. It will be slow and may throttle. Use SSIS or Dataflows for large datasets.

### 5.3 Dataflow Migration Pattern

```
1. Create Dataflow in Power BI/Power Apps
2. Add SharePoint list as source
3. Add transformation steps:
   - Rename columns
   - Change data types
   - Replace values
   - Merge lookups
4. Set Dataverse table as destination
5. Map columns
6. Schedule refresh or run on-demand
7. Monitor for errors
```

### 5.4 Migration Order

Migrate in this order to respect relationships:

```
Phase 1: Reference Data (no dependencies)
  - Status codes
  - Categories
  - Configuration

Phase 2: Parent Tables
  - Clients
  - Vendors
  - Products

Phase 3: Child Tables
  - Projects (depend on Clients)
  - Orders (depend on Clients, Products)

Phase 4: Grandchild Tables
  - Tasks (depend on Projects)
  - Order Items (depend on Orders, Products)

Phase 5: Related Data
  - Attachments
  - Notes
  - Audit history (if needed)
```

---

## 6. Validation

### 6.1 Validation Checklist

| # | Validation Item | Method | Pass Criteria |
|---|----------------|--------|--------------|
| 1 | Record count match | Compare source vs target | Counts match (± error margin) |
| 2 | Required fields populated | Dataverse query | No nulls in required fields |
| 3 | Data types correct | Schema validation | All columns correct type |
| 4 | Relationships intact | Query related records | Parent-child links correct |
| 5 | Choice values valid | Check all choice columns | All values in valid set |
| 6 | Date values correct | Spot check dates | Dates match, time zones correct |
| 7 | Currency values correct | Financial reconciliation | Sums match |
| 8 | Attachments migrated | Check file column | Files accessible |
| 9 | Ownership correct | Check owner columns | Records assigned correctly |
| 10 | Audit fields populated | Check created/modified | Timestamps present |

### 6.2 Validation Queries

```sql
-- Count comparison
-- SharePoint: List item count
-- Dataverse: SELECT COUNT(*) FROM table

-- Null check
SELECT COUNT(*) FROM table WHERE required_field IS NULL

-- Relationship check
SELECT COUNT(*) FROM child_table WHERE parent_lookup IS NULL

-- Date range check
SELECT MIN(date_field), MAX(date_field) FROM table
```

---

## 7. Cutover

### 7.1 Cutover Plan

| Phase | Activity | Duration | Owner |
|-------|----------|----------|-------|
| T-1 week | Freeze SharePoint data (read-only) | | Admin |
| T-1 day | Final delta sync | Hours | Migration team |
| T-1 day | Validate final sync | Hours | QA |
| T-0 | Switch apps to Dataverse | Minutes | Dev team |
| T-0 | Update Power Automate flows | Minutes | Dev team |
| T-0 | Update Power BI reports | Minutes | BI team |
| T+1 day | Monitor for issues | Day | Support team |
| T+1 week | Archive SharePoint lists | Hours | Admin |

### 7.2 Rollback Plan

If issues discovered:

| Step | Action | Timeline |
|------|--------|----------|
| 1 | Re-enable SharePoint lists | 15 minutes |
| 2 | Revert app connections | 30 minutes |
| 3 | Revert flow connections | 30 minutes |
| 4 | Notify users | Immediate |
| 5 | Investigate issues | As needed |
| 6 | Fix and replan | As needed |

---

## 8. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Data loss during migration | Critical | Full backup, validation, test restore |
| Relationship mapping errors | High | Thorough mapping document, test with sample |
| User adoption issues | Medium | Training, highlight benefits |
| Downstream system breaks | High | Identify all integrations, update together |
| Performance issues post-migration | Medium | Capacity planning, index optimization |
| Data quality issues surface | Medium | Clean data before migration |
| Custom SharePoint features lost | Medium | Identify replacements (workflows, calculated fields) |
| User permissions not mapped correctly | High | Thorough security testing |

---

## 9. Licensing

| Component | License Required |
|-----------|-----------------|
| Dataverse | Power Apps per user or per app |
| Dataflows | Included with Power Apps |
| Power Automate (for migration) | Standard (SharePoint + Dataverse are premium) |
| Third-party tools (SSIS) | Separate license |
| Storage | Dataverse capacity (may need additional) |

> **WARNING:** All users accessing Dataverse need a Power Apps license. Budget for this before migration.
