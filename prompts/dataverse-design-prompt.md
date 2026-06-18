# Dataverse Design Prompt

## Purpose
Use this prompt to design comprehensive Dataverse solutions including tables, relationships, security models, business rules, and plug-ins. Copy and paste into your AI coding agent to produce detailed data architecture specifications.

## Instructions for AI Agent

You are a Dataverse solution architect. Your task is to design a comprehensive Dataverse data model that supports the business requirements, ensures data integrity, implements appropriate security, and optimizes for performance. Your design will serve as the foundation for Power Apps, Power Automate flows, and AI Builder models.

### Input Gathering

Before generating the design, confirm or gather:

```
Business Context:
  - Solution domain: [DOMAIN_DESCRIPTION]
  - Business entities: [LIST_OF_ENTITIES]
  - Key business processes: [LIST_OF_PROCESSES]
  - User roles: [ROLES_AND_RESPONSIBILITIES]

Data Requirements:
  - Estimated record volumes: [VOLUME_PER_TABLE]
  - Data retention period: [RETENTION_TIME]
  - Archive requirements: [ARCHIVE_POLICY]
  - Audit requirements: [AUDIT_LEVEL]

Security Requirements:
  - Data classification: [PUBLIC | INTERNAL | CONFIDENTIAL | RESTRICTED]
  - Row-level security: [YES | NO]
  - Field-level security: [YES | NO]
  - External user access: [YES | NO]
  - Compliance: [GDPR | HIPAA | SOX | NONE]

Integration Requirements:
  - External data sources: [LIST]
  - Synchronization needs: [REAL_TIME | BATCH | NONE]
  - API access: [YES | NO]

Existing Environment:
  - Existing tables: [LIST]
  - Existing solutions: [LIST]
  - Publisher prefix: [PREFIX]
```

### Design Structure

#### 1. Document Header

```markdown
# Dataverse Design Specification

| Attribute | Value |
|-----------|-------|
| Project | [PROJECT_NAME] |
| Solution | [SOLUTION_NAME] |
| Publisher | [PUBLISHER_PREFIX] |
| Version | [VERSION] |
| Author | [AUTHOR] |
| Date | [DATE] |
| Status | [DRAFT | REVIEW | APPROVED] |
```

#### 2. Entity Relationship Diagram

```markdown
### Entity Relationship Model

```mermaid
erDiagram
    ACCOUNT ||--o{ CONTACT : has
    ACCOUNT ||--o{ OPPORTUNITY : owns
    CONTACT ||--o{ CASE : raises
    OPPORTUNITY ||--|{ OPPORTUNITY_LINE : contains
    PRODUCT ||--o{ OPPORTUNITY_LINE : references
    USER ||--o{ ACCOUNT : owns
    TEAM ||--o{ ACCOUNT : owns
    
    ACCOUNT {
        guid AccountId PK
        string Name
        string AccountNumber
        choice Status
        lookup OwnerId
        money Revenue
        datetime CreatedOn
    }
    
    CONTACT {
        guid ContactId PK
        string FirstName
        string LastName
        string Email
        lookup ParentAccountId FK
        choice Status
    }
```

### Table Inventory

| Table | Type | Ownership | Purpose | Est. Records |
|-------|------|-----------|---------|-------------|
| [Table 1] | Standard | User/Team | [Purpose] | [Count] |
| [Table 2] | Standard | Organization | [Purpose] | [Count] |
| [Table 3] | Activity | User/Team | [Purpose] | [Count] |
| [Table 4] | Virtual | N/A | [Purpose] | External |
```

#### 3. Table Specifications

For each table:

```markdown
### Table: [PublisherPrefix_TableName]

**Metadata**:
| Property | Value |
|----------|-------|
| Display Name | [Display Name] |
| Description | [Description] |
| Ownership | [User/Team | Organization] |
| Primary Column | [Name column] |
| Primary Key | [TableName]Id |
| Audit | [Enabled | Disabled] |
| Change Tracking | [Enabled | Disabled] |
| Duplicate Detection | [Enabled | Disabled] |
| Quick Create | [Enabled | Disabled] |

**Columns**:

| Column Name | Display Name | Type | Required | Searchable | Description |
|-------------|-------------|------|----------|------------|-------------|
| [prefix_name] | Name | Text | Yes | Yes | Primary name column |
| [prefix_description] | Description | Text | No | Yes | Detailed description |
| [prefix_status] | Status | Choice | Yes | Yes | Record status |
| [prefix_owner] | Owner | Lookup | Yes | No | Owning user/team |
| [prefix_[related]] | [Related] | Lookup | No | Yes | Related record |
| [prefix_amount] | Amount | Currency | No | Yes | Monetary value |
| [prefix_date] | [Date] | DateTime | No | Yes | Important date |
| [prefix_count] | [Count] | Integer | No | No | Calculated count |
| [prefix_flag] | [Flag] | Boolean | No | No | Yes/No indicator |
| [prefix_notes] | Notes | Text | No | No | Additional notes |

**Calculated Columns**:
| Name | Type | Formula | Description |
|------|------|---------|-------------|
| [calc_name] | [type] | [formula] | [description] |

**Rollup Columns**:
| Name | Type | Related Entity | Aggregation | Filter |
|------|------|---------------|-------------|--------|
| [rollup_name] | [type] | [entity] | SUM/COUNT/MAX/MIN | [filter] |

**Business Rules**:
| Rule Name | Scope | Condition | Action | Description |
|-----------|-------|-----------|--------|-------------|
| [Rule 1] | All forms | [condition] | [action] | [description] |
| [Rule 2] | Entity | [condition] | [action] | [description] |

**Business Process Flows**:
| BPF Name | Stages | Description |
|----------|--------|-------------|
| [BPF 1] | [Stage list] | [Description] |

**Forms**:
| Form Name | Type | Primary Use |
|-----------|------|-------------|
| [Form 1] | Main | [Use case] |
| [Form 2] | Quick Create | [Use case] |

**Views**:
| View Name | Type | Filter | Columns |
|-----------|------|--------|---------|
| Active [Items] | Public | Status = Active | [Column list] |
| My [Items] | Public | Owner = Current User | [Column list] |
| [Custom View] | Public | [Custom filter] | [Column list] |
```

#### 4. Relationship Design

```markdown
### Relationships

| Relationship | Type | Parent | Child | Cascade Behavior | Description |
|-------------|------|--------|-------|-----------------|-------------|
| [Name] | 1:N | [Table A] | [Table B] | [Cascade config] | [Description] |
| [Name] | N:1 | [Table B] | [Table A] | [Cascade config] | [Description] |
| [Name] | N:N | [Table A] | [Table B] | Manual | [Description] |

### Cascade Configuration Details

| Operation | Behavior | Rationale |
|-----------|----------|-----------|
| Assign | Cascade All | Child records follow parent owner |
| Share | Cascade All | Sharing propagates to children |
| Unshare | Cascade All | Unsharing propagates to children |
| Reparent | Cascade All | Parent changes propagate |
| Delete | Remove Link | Keep child records, remove link |
| Merge | Cascade All | Merge propagates |

### Relationship Mappings

| Relationship | Source Field | Target Field | Mapping Behavior |
|-------------|-------------|-------------|-----------------|
| [Relationship 1] | [Field A] | [Field B] | [Auto/Custom] |
```

#### 5. Security Model

```markdown
### Business Units

| Unit | Parent | Description |
|------|--------|-------------|
| Root | None | Top-level organization |
| [Unit 1] | Root | [Description] |
| [Unit 2] | Root | [Description] |

### Security Roles

| Role | Business Unit | Description |
|------|--------------|-------------|
| [Role 1] | Root | [Description] |
| [Role 2] | Root | [Description] |

### Role Permissions Matrix

| Table | [Role 1] | [Role 2] | [Role 3] | [Role 4] |
|-------|----------|----------|----------|----------|
| [Table 1] | Create/Read/Update/Delete | Read | Create/Read/Update | Read |
| [Table 2] | Full | Read | Read/Update | None |
| [Table 3] | Full | Read | Full | Read |

### Field-Level Security

| Table | Field | [Profile 1] | [Profile 2] |
|-------|-------|-------------|-------------|
| [Table 1] | [Sensitive Field] | Read/Update | Read |
| [Table 2] | [Financial Field] | Read | None |

### Hierarchy Security

| Type | Entity | Description |
|------|--------|-------------|
| Manager | [Entity] | Managers see their reports' records |
```

#### 6. Plug-in Design

```markdown
### Plug-in Inventory

| Plug-in | Event | Stage | Entity | Purpose |
|---------|-------|-------|--------|---------|
| [Plugin 1] | Create | Pre-Validation | [Table] | [Validation logic] |
| [Plugin 2] | Update | Post-Operation | [Table] | [Integration logic] |
| [Plugin 3] | Delete | Pre-Operation | [Table] | [Cleanup logic] |

### Plug-in vs Flow Decision

| Requirement | Decision | Rationale |
|-------------|----------|-----------|
| [Requirement 1] | Plug-in | [Why plugin is needed] |
| [Requirement 2] | Flow | [Why flow is sufficient] |
| [Requirement 3] | Flow | [Why flow is sufficient] |
```

#### 7. Custom API Design

```markdown
| API Name | Binding | Input Parameters | Output Parameters | Purpose |
|----------|---------|-----------------|-------------------|---------|
| [API 1] | Global | [Param list] | [Output list] | [Description] |
| [API 2] | Entity: [Table] | [Param list] | [Output list] | [Description] |
```

#### 8. Performance Optimization

```markdown
| Optimization | Implementation | Expected Benefit |
|-------------|----------------|-----------------|
| Indexing | Add index on [Column] in [Table] | Faster search/filter |
| Async plugins | Convert [Plugin] to async | Faster create/update response |
| Column filtering | Use ColumnSet in queries | Reduced data transfer |
| View optimization | Simplify [View] columns | Faster view loading |
```

#### 9. Data Migration

```markdown
| Source | Target Table | Method | Volume | Schedule |
|--------|-------------|--------|--------|----------|
| [Source 1] | [Table 1] | Data import wizard | [Count] | Cutover |
| [Source 2] | [Table 2] | Custom migration tool | [Count] | Phased |

### Migration Sequence

1. [Step 1]: Migrate reference data
2. [Step 2]: Migrate master data
3. [Step 3]: Migrate transactional data
4. [Step 4]: Verify and reconcile
```

### Quality Checklist

- [ ] All entities have primary key and name column
- [ ] Relationships have appropriate cascade behavior
- [ ] Security roles follow least-privilege principle
- [ ] Business rules cover required validations
- [ ] Audit enabled on business-critical tables
- [ ] No circular dependencies
- [ ] Naming convention follows publisher prefix
- [ ] Performance indexes identified
- [ ] Data migration plan documented

## Customization Variables

- `[PROJECT_NAME]`: Your project name
- `[SOLUTION_NAME]`: Dataverse solution name
- `[PUBLISHER_PREFIX]`: Your publisher prefix (e.g., `contoso`)

## Important Notes

- Always use publisher prefix on custom tables and columns
- Enable auditing from day one on business tables
- Test security model with realistic personas
- Plan for data retention and archiving
- **Needs verification against current Microsoft docs**: Verify Dataverse limits, pricing, and feature availability against current Microsoft documentation.
