# Power BI Integration Handoff Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Guide for integrating Power Platform projects with Power BI, and handoff procedures between Power Platform dev team and BI team.
> **Needs verification against current Microsoft docs**: Power BI licensing and feature availability change frequently.

---

## 1. When Power Platform Projects Need Power BI

### 1.1 Integration Scenarios

| Scenario | Power BI Role | Complexity |
|----------|--------------|------------|
| **Dashboard in model-driven app** | Embedded tile/report | Low |
| **Executive KPI dashboard** | Standalone report + sharing | Medium |
| **Operational analytics** | Real-time dashboard with alerts | High |
| **User-facing analytics in canvas app** | Embedded report with RLS | Medium |
| **Data export for analysis** | Power BI dataset for self-service | Medium |
| **Paginated reports** | Operational documents (invoices, statements) | High |
| **AI/ML on business data** | Synapse Link + Power BI + Azure ML | Very High |

### 1.2 Decision Matrix

```
Client asks for "reports" - what do they actually need?

Question 1: Who is the audience?
  - End users in app -> Embedded Power BI tile
  - Managers -> Power BI dashboard with sharing
  - Executives -> Power BI Premium with mobile app
  - External users -> Embedded analytics or Power Pages

Question 2: How real-time?
  - Real-time (seconds) -> DirectQuery + streaming dataset
  - Near real-time (minutes) -> DirectQuery or scheduled refresh
  - Daily/weekly -> Import mode with scheduled refresh

Question 3: What data volume?
  - < 1GB -> Power BI Pro (Import)
  - 1-100GB -> Power BI Premium Per User
  - > 100GB -> Power BI Premium Per Capacity

Question 4: Is row-level security needed?
  - Yes -> Power BI dataset with RLS roles
  - No -> Standard sharing
```

---

## 2. Embedded vs Standalone Reports

### 2.1 Embedded Reports

```
Type A: Power BI tile in Power Apps (canvas)
  - Use Power BI tile control
  - Embed single visual
  - Limited interactivity
  - User needs Power BI Pro (unless report in Premium capacity)

  Setup:
  1. Canvas app > Insert > Power BI tile
  2. Workspace: Select workspace
  3. Dashboard: Select dashboard
  4. Tile: Select specific tile
  5. Set size/position

Type B: Power BI report in Power Apps (full report)
  - Use Power BI embedded control
  - Full report interactivity
  - Pass context from app to report (filtering)

  Setup:
  1. Canvas app > Insert > Power BI embedded
  2. Workspace: Select workspace
  3. Report: Select report
  4. Set size (usually full screen)
  5. Pass filters via OnLoad:
     PowerBIIntegration.SetFilters([{
       table: "Accounts",
       column: "AccountID",
       values: [selectedAccountId]
     }])

Type C: Power BI in model-driven app
  - Add Power BI dashboard to site map
  - Or embed in iframe on web resource
  - Dashboard appears as navigation item

  Setup:
  1. Model-driven app designer
  2. Add page > Power BI embedded
  3. Configure workspace and report
  4. Add to site map
```

### 2.2 Standalone Reports

```
Type A: Power BI Service (app.powerbi.com)
  - Reports published to workspaces
  - Shared via apps or direct sharing
  - Users access via browser or mobile app

  Handoff:
  1. Power Platform team provides:
     - Dataverse environment details
     - Table/column documentation
     - Security model documentation
     - Custom field definitions
     - Relationship diagram

  2. BI team creates:
     - Data model in Power BI Desktop
     - Reports and dashboards
     - RLS roles matching Dataverse security
     - Published to workspace

Type B: Power BI Paginated Reports
  - Pixel-perfect, print-ready documents
  - Requires Premium capacity
  - Operational reports: invoices, statements

  Handoff:
  1. Power Platform team provides:
     - Report requirements
     - Sample data
     - Logo/branding assets
     - Layout specifications

  2. BI team creates:
     - Paginated report in Report Builder
     - Parameter configurations
     - Subscription/delivery setup
```

---

## 3. Dataverse as Data Source for Power BI

### 3.1 Connection Options

| Method | Refresh | Volume | Complexity | Best For |
|--------|---------|--------|------------|----------|
| **Import** | Scheduled | Up to 1GB (Pro) / 100GB (PPU) | Low | Most reports |
| **DirectQuery** | Real-time | No limit | Medium | Large datasets, near real-time |
| **Dataflow** | Scheduled | Linked entities | Medium | Data transformation reuse |
| **Synapse Link** | Near real-time | No limit | High | Enterprise analytics, large volume |

### 3.2 Import Mode Setup

```
Step 1: Power BI Desktop > Get Data > More
Step 2: Select "Microsoft Dataverse"
Step 3: Enter environment URL:
  https://yourorg.crm.dynamics.com
  (or use "Organizational account" to browse)

Step 4: Navigator: Select tables
  - Select only needed tables
  - Check "Select related tables" for relationships
  - Avoid system tables unless needed

Step 5: Transform data in Power Query:
  - Remove unnecessary columns
  - Rename columns for report clarity
  - Add calculated columns
  - Set data types

Step 6: Create relationships:
  - Match Dataverse relationships
  - Set cardinality
  - Configure cross-filter direction

Step 7: Create measures (DAX):
  Total Revenue = SUM(Invoices[Amount])
  Case Count = COUNTROWS(Cases)
  Avg Resolution Time = AVERAGE(Cases[ResolutionHours])

Step 8: Publish to Power BI Service
```

### 3.3 DirectQuery Setup

```
Step 1: Power BI Desktop > Get Data > Microsoft Dataverse
Step 2: In connection dialog, select "DirectQuery"

Limitations:
  - DAX functions limited (no time intelligence in same way)
  - Performance depends on Dataverse API speed
  - 80-column limit per table
  - Complex transformations must happen in Dataverse

Optimization:
  - Create Dataverse views (pre-filtered)
  - Use simple columns (avoid calculated columns)
  - Minimize visuals on page (each = API call)
  - Enable query reduction
```

### 3.4 Synapse Link (Enterprise Pattern)

```
For large-scale analytics:

Step 1: Enable Synapse Link in Power Platform
  Power Platform Admin > Data integration > Azure Synapse Link
  Link to Azure Synapse workspace

Step 2: Select tables to replicate
  Tables sync to Azure Data Lake (Delta format)

Step 3: BI team connects Power BI to Synapse
  Power BI > Get Data > Azure > Azure Synapse Analytics
  DirectQuery or Import from Delta tables

Advantages:
  - No API limits (bypasses Dataverse API)
  - Near real-time data
  - Supports large datasets (TB+)
  - Can use Azure ML, Spark

Costs:
  - Azure Synapse workspace
  - Azure Data Lake storage
  - Compute for queries
```

---

## 4. Row-Level Security (RLS) Alignment

### 4.1 RLS in Power BI

```
RLS ensures users only see data they should see.

Setup in Power BI Desktop:
Step 1: Modeling > Manage roles
Step 2: Create roles:
  Role: "CaseWorker"
  Filter: Cases[OwnerEmail] = USERNAME()

  Role: "Manager"
  Filter: Cases[BusinessUnit] = USERPRINCIPALNAME()

  Role: "Admin"
  No filter (see all)

Step 3: Test roles:
  View as > Select role > Verify data filtering

Step 4: Publish and assign:
  Power BI Service > Security > Add members to roles
  Map Azure AD users/groups to roles
```

### 4.2 Aligning with Dataverse Security

```
Goal: Power BI RLS should match Dataverse security model

Dataverse:                           Power BI:
Business Unit                        RLS role per BU
Security Role                        RLS role mapping
Owner                                USERNAME() filter
Team membership                      User principal check

Best practice:
1. Document Dataverse security model
2. Create RLS roles that mirror it
3. Use Azure AD group membership for role assignment
4. Test with actual user accounts
5. Document any differences (e.g., plugins that modify access)

Important: Power BI RLS does NOT automatically inherit Dataverse security.
You must explicitly define and maintain the mapping.
```

---

## 5. Licensing: Pro vs PPU vs Premium

### 5.1 Decision Matrix

| Feature | Pro ($10/mo) | PPU ($20/mo) | Premium Capacity |
|---------|-------------|--------------|------------------|
| **Dataset size** | 1 GB | 100 GB | Up to 400 GB |
| **Refresh frequency** | 8/day | 48/day | 48/day |
| **Paginated reports** | No | Yes | Yes |
| **AI features** | No | Yes | Yes |
| **Sharing** | Individual | Individual | Organization-wide |
| **Mobile app** | Yes | Yes | Yes |
| **Embedded** | Requires Pro per user | Requires PPU | No user license needed |
| **Premium features** | None | All | All |

### 5.2 Cost Estimation

```
Scenario 1: Small team (10 users, simple reports)
  10 x Pro = $100/month

Scenario 2: Medium org (50 users, large datasets)
  Option A: 50 x PPU = $1,000/month
  Option B: Premium capacity (if > 40 PPU users, capacity is cheaper)
    F64 capacity = ~$1,000/month

Scenario 3: Large org (500+ users, embedded in app)
  Premium capacity (P1): ~$5,000/month
  + No per-user licenses needed for embedded

Scenario 4: Power Platform project with embedded BI
  If report is in Premium capacity workspace:
    Users viewing embedded report don't need Pro/PPU
  If report is in Pro workspace:
    Every viewer needs Pro license
```

---

## 6. Deployment Handoff Process

### 6.1 Handoff Checklist

```
From Power Platform team to BI team:

[ ] Environment URL and access credentials
[ ] Table/entity relationship diagram
[ ] Field documentation (custom fields, picklist values)
[ ] Security model documentation (roles, BU structure)
[ ] Data dictionary (field descriptions, data types)
[ ] Sample data (anonymized if needed)
[ ] Report requirements document
[ ] Branding guidelines (colors, fonts, logos)
[ ] List of required reports and KPIs
[ ] RLS requirements (who sees what)
[ ] Refresh schedule requirements
[ ] Performance requirements
[ ] Mobile layout requirements
```

### 6.2 Handoff Document Template

```
# Power Platform to BI Handoff Document

## Project: [Name]
## Date: [Date]
## Power Platform Contact: [Name, Email]
## BI Contact: [Name, Email]

### 1. Environment Details
- Organization URL: https://[org].crm.dynamics.com
- Environment ID: [GUID]
- Environment Type: [Production/Sandbox]

### 2. Data Model
- Primary tables: [List]
- Custom tables: [List with descriptions]
- Relationship diagram: [Attached]
- Key fields: [Document]

### 3. Security Model
- Business units: [List]
- Security roles: [List]
- RLS requirements: [Description]
- Field-level security: [List affected fields]

### 4. Report Requirements
- Report 1: [Name, description, audience]
- Report 2: [Name, description, audience]
- KPIs: [List with calculation logic]
- Filters: [Required filter fields]
- Drill-down: [Hierarchy]

### 5. Technical Requirements
- Refresh frequency: [e.g., Daily at 6 AM]
- Data volume: [Row counts per table]
- Historical data: [How many years]
- Real-time requirements: [Yes/No, specifics]
- Mobile requirements: [Yes/No]

### 6. Access Requirements
- BI developers: [Names/emails]
- Report consumers: [Groups/roles]
- Workspace: [Proposed name]
```

---

## 7. Gateway Requirements

### 7.1 When a Gateway is Needed

```
Gateway required when:
  - Power BI connects to on-premises data sources
  - Dataverse is on-premises (rare now)
  - SQL Server on-premises
  - File shares on-premises
  - Other on-premises sources

NOT needed when:
  - All data sources are cloud-based
  - Dataverse online
  - Azure SQL
  - SharePoint Online
  - Azure Blob Storage
```

### 7.2 Gateway Setup for Power BI

```
Step 1: Download gateway installer
  https://aka.ms/on-premises-data-gateway

Step 2: Install on dedicated server
  (Same server as Power Automate gateway can be used)

Step 3: Sign in with Power BI account

Step 4: Register gateway
  Name: "PROD-PBI-Gateway"
  Recovery key: (save securely)

Step 5: In Power BI Service:
  Settings > Manage gateways
  Add data source:
    Type: SQL Server
    Server: sqlserver.company.local
    Database: ReportingDB
    Authentication: Windows (service account)

Step 6: Schedule refresh uses this gateway
```

---

## 8. Common Integration Patterns

### 8.1 Pattern: KPI Dashboard in Model-Driven App

```
Setup:
1. BI team creates KPI report in Power BI Desktop
2. Publish to workspace in Premium capacity (for free viewing)
3. In model-driven app:
   a. App designer > Add page > Power BI embedded
   b. Select workspace and report
   c. Pass context filter:
      // Auto-filter to current account
      var accountId = formContext.getAttribute("accountid").getValue();
      // Report filters automatically
4. Add to site map
5. Users see account-specific KPIs in context
```

### 8.2 Pattern: Operational Dashboard with Alerts

```
Setup:
1. Import Dataverse data to Power BI (Import mode)
2. Create real-time dashboard with key metrics
3. Set up data alerts:
   Dashboard > Tile > ... > Set alert
   Condition: Case count > 100
   Action: Send email to manager
4. Schedule refresh every 15 minutes (PPU)
5. Embed in Teams tab for visibility
```

### 8.3 Pattern: User Self-Service Analytics

```
Setup:
1. Create curated dataset in Power BI
2. Publish to workspace
3. Create app from workspace
4. Configure RLS (users see only their data)
5. Share app with user group
6. Users create their own reports from the dataset
7. Monitor usage and dataset performance
```

---

*End of Power BI Handoff Guide. Verify all licensing details and feature availability against current Microsoft documentation.*
