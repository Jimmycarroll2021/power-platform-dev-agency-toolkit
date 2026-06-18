# Model-Driven App Playbook

> **Complexity Rating:** Low / Medium (for configuration) / High (for customization)
> **Last Updated:** 2024
> **Applies To:** Power Apps Model-Driven Apps, Dataverse

---

## 1. When to Use Model-Driven Apps

Use Model-Driven Apps when:

| Scenario | Why Model-Driven |
|----------|-----------------|
| Dataverse-centric business application | Native integration, automatic UI generation |
| Complex data relationships | Sub-grids, related records, lookups built-in |
| Business process flows needed | Guided stage-by-stage processes |
| Enterprise-grade forms required | Rich form controls, business rules, validation |
| Role-based user experience | Multiple forms/views per security role |
| Complex search and filtering | Advanced Find, quick find, global search |
| Need charts and dashboards | Built-in visualization |
| Team collaboration on records | Activities, notes, connections |
| Audit and compliance requirements | Built-in Dataverse audit |
| Rapid data-focused app development | Configure, don't code |

### Decision Matrix

| Factor | Model-Driven App | Canvas App |
|--------|-----------------|------------|
| Primary data source | Dataverse | Any |
| Need relationships/sub-grids | Yes - native | Must build custom |
| Business process flows | Built-in | Must build custom |
| UI customization needs | Limited | Unlimited |
| Device flexibility | Desktop/tablet focused | Mobile optimized |
| Development approach | Configuration | Build from scratch |

---

## 2. When NOT to Use Model-Driven Apps

> **DO NOT use Model-Driven Apps when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Need pixel-perfect custom UI | Canvas App | Full layout control |
| Multi-data source mashup | Canvas App | Model-driven is Dataverse-centric |
| Heavy mobile/phone use | Canvas App | Better mobile experience |
| Need device features (camera, GPS) | Canvas App | Native device integration |
| Public-facing or anonymous users | Power Pages | External access |
| Very simple requirements (1-2 tables) | SharePoint list or Canvas | Overkill |
| Need offline on mobile | Canvas App | Better offline support |
| Complex custom interactions | Canvas App + PCF | More flexible |

---

## 3. Architecture

### 3.1 Model-Driven App Architecture

```
[Model-Driven App]
  |
  +--[Sitemap]
  |     +-- Areas (e.g., Sales, Service)
  |     +-- Groups (e.g., My Work, Customers)
  |     +-- Subareas (Entities, Dashboards, URLs)
  |
  +--[Entity 1: Account]
  |     +-- Forms (Main, Quick Create, Quick View)
  |     +-- Views (Active, Inactive, My Accounts)
  |     +-- Charts (By Industry, By Owner)
  |     +-- Business Rules
  |     +-- Dashboards
  |
  +--[Entity 2: Contact]
  |     +-- Forms
  |     +-- Views
  |     +-- Charts
  |
  +--[Entity 3: Custom Entity]
  |     +-- Forms, Views, Charts
  |
  +--[Business Process Flows]
  |     +-- Lead to Opportunity
  |     +-- Case Resolution
  |
  +--[Security]
        +-- Security Roles
        +-- Field Security
        +-- Business Units
```

### 3.2 Configuration vs. Customization

| Approach | Use When | Effort |
|----------|----------|--------|
| Out-of-the-box configuration | Standard requirements | Low |
| Business rules (no-code) | Field validation, show/hide | Low |
| JavaScript web resources | Client-side logic | Medium |
| PCF controls | Custom UI components | Medium-High |
| Plugins (server-side) | Server logic, integrations | High |
| Custom APIs | External system integration | High |

---

## 4. Forms

### 4.1 Form Types

| Form Type | Purpose | When to Use |
|-----------|---------|-------------|
| Main | Primary data entry/viewing | Standard record interaction |
| Quick Create | Fast record creation from lookup | Creating related records inline |
| Quick View | Compact record preview in related form | Showing parent record info on child |
| Card | Timeline/card view | Compact display in views |

### 4.2 Form Design Best Practices

| Practice | Implementation |
|----------|---------------|
| Logical tab order | Group related fields in tabs |
| Required fields | Mark clearly, validate on save |
| Field placement | Most important fields in first tab, first column |
| Section headers | Use descriptive section names |
| Sub-grids | Show related records inline |
| BPF on form | Place business process flow at top |
| Related records | Use navigation pane for related entities |

### 4.3 Form Sections Template

```
Tab 1: General (default)
  Section: Key Information
    - Name (required)
    - Status
    - Owner
    - Created/Modified dates

  Section: Details
    - Categorization fields
    - Description
    - Priority

Tab 2: Details
  Section: Financial
    - Amount fields
    - Currency
    - Budget

  Section: Scheduling
    - Date fields
    - Duration
    - Reminders

Tab 3: Related
  Section: Sub-grid 1
    - Related records table

  Section: Sub-grid 2
    - Another related records table
```

### 4.4 Form-Specific JavaScript

> **DO NOT:** Overuse JavaScript. Prefer business rules and Power Fx where possible.

Common JavaScript use cases:
- Complex field validation
- Dynamic form sections
- Integration with external UI libraries
- Custom ribbon button actions

---

## 5. Views

### 5.1 View Types

| View Type | Purpose | Configuration |
|-----------|---------|--------------|
| Public views | Shared with all users | System or custom |
| Personal views | User-created | Saved by individual |
| System views | Built-in (cannot delete) | Active, Inactive, Quick Find |
| Associated views | Show related records | Auto-generated |
| Lookup views | Show in lookup dropdown | Optimized for selection |
| Advanced Find views | Query builder results | User-created |

### 5.2 View Design Best Practices

| Practice | Why |
|----------|-----|
| Limit columns to 5-7 | Performance and readability |
| Use meaningful column widths | Better data visibility |
| Default sort by recent | Users see newest first |
| Add filter criteria | Show only relevant records |
| Use icons for status | Visual status indication |
| Enable quick find | Fast search from view |

### 5.3 Common Views to Create

| View Name | Filter | Sort | Columns |
|-----------|--------|------|---------|
| All Active | Status = Active | Modified On desc | Name, Status, Owner, Modified |
| My Records | Owner = Current User | Modified On desc | Name, Status, Priority |
| Overdue | Due Date < Today | Due Date asc | Name, Due Date, Owner |
| Created This Week | Created On > 7 days ago | Created On desc | Name, Created On, Creator |
| Pending Approval | Status = "Pending" | Created On asc | Name, Created On, Requestor |

---

## 6. Charts

### 6.1 Chart Types

| Chart Type | Best For | Data Required |
|------------|----------|---------------|
| Column/Bar | Comparing categories | Category + numeric value |
| Pie/Doughnut | Showing proportions | Category + percentage |
| Line | Trend over time | Date + numeric value |
| Area | Cumulative trends | Date + numeric value |

### 6.2 Recommended Charts

| Chart Name | Type | Group By | Aggregation |
|-----------|------|----------|-------------|
| Records by Status | Column | Status | Count |
| Records by Owner | Bar | Owner | Count |
| Monthly Trend | Line | Created On (Month) | Count |
| Records by Category | Pie | Category | Count |
| Amount by Month | Column | Created On (Month) | Sum (Amount) |

---

## 7. Dashboards

### 7.1 Dashboard Components

| Component | Use For | Configuration |
|-----------|---------|--------------|
| Charts | Visual KPIs | Entity + view + chart |
| Lists | Record lists | Entity + view |
| Iframes | External content | URL with parameters |
| Web resources | Custom HTML/JS | Custom component |
| Power BI tile | Advanced analytics | Embedded Power BI |

### 7.2 Dashboard Design

```
Layout (2-column recommended):
+----------------+----------------+
| Chart: Status  | Chart: By Owner|
+----------------+----------------+
| List: My Items | List: Overdue  |
+----------------+----------------+
| Chart: Trend   | Power BI Tile  |
+----------------+----------------+
```

---

## 8. Business Rules

### 8.1 When to Use Business Rules

Use business rules (no-code) instead of JavaScript when:
- Setting field visibility (show/hide)
- Setting field requirement level
- Setting default values
- Creating simple field calculations
- Locking/unlocking fields
- Setting field values based on conditions

### 8.2 Business Rule Scope

| Scope | Applies To |
|-------|-----------|
| Entity | All forms for the entity |
| All forms | Same as entity scope |
| Specific form | Only the selected form |

### 8.3 Common Business Rules

| Rule | Condition | Action |
|------|-----------|--------|
| Show approval fields | Status = "Pending Approval" | Show approval section |
| Require approval date | Status = "Approved" | Set approval date required |
| Lock after approval | Status = "Approved" | Lock all fields |
| Set default owner | Record created | Set owner to creator |
| Hide sensitive fields | User role != Admin | Hide financial fields |

---

## 9. Security

### 9.1 Security Roles for Model-Driven Apps

| Role | Create | Read | Write | Delete | Append | Append To |
|------|--------|------|-------|--------|--------|-----------|
| System Admin | All | All | All | All | All | All |
| Manager | Own+Team | Own+Team | Own+Team | Own | Own+Team | Own+Team |
| User | Own | Own+Team | Own | None | Own | Own+Team |
| Read Only | None | Org | None | None | None | Org |

### 9.2 Form-Level Security

| Approach | Method |
|----------|--------|
| Role-based forms | Assign forms to security roles |
| Field-level security | Use Field Security Profiles |
| Record-level security | Owner/Team/Business Unit scope |
| Hierarchy security | Manager can see team records |

### 9.3 Business Unit Structure

```
[Root Business Unit: Organization]
  |
  +--[Sales]
  |     +--[Sales - East]
  |     +--[Sales - West]
  |
  +--[Service]
  |     +--[Service - Level 1]
  |     +--[Service - Level 2]
  |
  +--[Operations]
```

---

## 10. Development Steps

### 10.1 Implementation Checklist

- [ ] Design data model (tables, columns, relationships)
- [ ] Create Dataverse tables
- [ ] Define security model (roles, business units)
- [ ] Configure forms (main, quick create, quick view)
- [ ] Configure views (public, system, lookup)
- [ ] Create charts
- [ ] Create dashboards
- [ ] Configure business process flows (if needed)
- [ ] Add business rules
- [ ] Design sitemap
- [ ] Create model-driven app
- [ ] Configure app properties
- [ ] Test with different security roles
- [ ] Performance testing
- [ ] User acceptance testing

### 10.2 Sitemap Design

```xml
<!-- Example sitemap structure -->
<SiteMap>
  <Area Id="main" Title="My App">
    <Group Id="my_work" Title="My Work">
      <SubArea Id="dashboard" Entity="dashboard" />
      <SubArea Id="my_records" Entity="custom_entity" />
    </Group>
    <Group Id="data" Title="Data Management">
      <SubArea Id="accounts" Entity="account" />
      <SubArea Id="contacts" Entity="contact" />
    </Group>
    <Group Id="reports" Title="Reports">
      <SubArea Id="dashboards" Entity="dashboard" />
    </Group>
  </Area>
</SiteMap>
```

---

## 11. Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| Form display | Open each form | All fields visible, correct layout |
| Data entry | Create record | Record saved, validation works |
| Business rules | Trigger conditions | Fields show/hide correctly |
| Views | Open each view | Correct records displayed |
| Charts | View dashboards | Charts render with data |
| Security (role A) | Login as role A user | See only authorized data |
| Security (role B) | Login as role B user | Different experience |
| Business process flow | Walk through stages | Stage progression works |
| Sub-grid operations | Add related records | Related records created |
| Advanced Find | Build custom query | Correct results returned |
| Mobile access | Open on tablet | Usable layout |

---

## 12. Licensing

| Component | License Required |
|-----------|-----------------|
| Model-Driven App access | Power Apps per user ($20/mo) or per app ($10/mo) |
| Dataverse | Included with Power Apps license |
| Premium features | Included with Power Apps license |
| Power BI dashboards | Power BI Pro for viewing |

---

## 13. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Limited UI customization | Medium | Use PCF controls for key components |
| Mobile experience limitations | Medium | Test on target devices |
| JavaScript maintenance | Medium | Document all custom code |
| Upgrade compatibility | Medium | Stay current, test upgrades |
| Performance with many sub-grids | Medium | Limit sub-grid count |
| User resistance to standard UI | Low | Training, highlight benefits |
| Plugin dependency for complex logic | Medium | Use Power Automate where possible |
