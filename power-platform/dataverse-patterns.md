---
title: "Dataverse Patterns"
description: "Design patterns for Dataverse tables, relationships, security, and extensibility"
category: "data"
tags: ["dataverse", "tables", "relationships", "security", "plugins"]
---

# Dataverse Patterns

## 1. Table Design Patterns

### Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Standard table | `alu_<EntityName>` | `alu_Project` |
| Configuration table | `alu_Config<Name>` | `alu_ConfigSettings` |
| Log table | `alu_Log<Name>` | `alu_LogAudit` |
| Intersection table | `alu_<Entity1><Entity2>` | `alu_ProjectResource` |

### Standard Columns

Every custom table should include:

| Column | Type | Purpose |
|--------|------|---------|
| `alu_Name` | Text | Primary name |
| `alu_Description` | Text | Description |
| `alu_Status` | Choice | Business status |
| `alu_CreatedByProcess` | Text | Process that created the row |
| `alu_SourceSystem` | Text | Origin system for integrations |
| `alu_ExternalId` | Text | ID in external system |
| `alu_IsActive` | Boolean | Soft delete flag |

### Soft Delete Pattern

Instead of deleting rows:
1. Set `alu_IsActive` = false
2. Filter views to `alu_IsActive` = true
3. Use business rule to prevent edits to inactive rows
4. Archive after retention period

---

## 2. Relationship Patterns

### 1:N (One-to-Many)

```
Account (1) ──────▶ (N) Contact
Parent           Children
```

**Configuration:**
- Parent: Lookup on child table
- Behavior: Cascade active (cascade assign, share, unshare; no cascade delete)
- Referential constraint: Restrict delete

### N:N (Many-to-Many)

```
Contact (N) ──────▶ (N) Event
  Attendees     Events
```

**Configuration:**
- Use native N:N for simple associations
- Use manual intersect table when you need additional attributes on the relationship

### Polymorphic Lookup

Dataverse supports polymorphic lookups (e.g., `Regarding` can point to multiple table types).

```powerapps
// Query polymorphic lookup
Filter(Activities, Regarding(Accounts).Name = "Contoso")
```

**Limitations:**
- Maximum 5 table types per polymorphic lookup
- Cannot be sorted in views
- Limited filter support

### Self-Referential

```
Employee (1) ──────▶ (N) Employee
  Manager          Direct Reports
```

Use for hierarchies like org charts, categories, territories.

---

## 3. Calculated and Rollup Columns

### Calculated Columns

```
Formula: CONCAT(FirstName, " ", LastName)
Result: Full Name field auto-calculated
```

**Limitations:**
- Cannot trigger workflows or plugins
- Cannot be used in rollups
- Limited to same-row fields

### Rollup Columns

```
Parent Account:
  Total Open Opportunities = SUM(Child Opportunities where Status = Open)
```

**Configuration:**
- Refresh: Scheduled (every hour by default)
- Max 100 rollup columns per table
- Can trigger workflows on change

---

## 4. Business Rules Patterns

### Field Validation

```
Condition: Estimated Value > 100000
  True: Show Approval Required field
  False: Hide Approval Required field, Set to false
```

### Auto-Populate

```
Scope: All Forms
  Set Country = Account.Country
  When Account lookup changes
```

### Show/Hide Sections

```
Condition: Type = "Enterprise"
  True: Show Enterprise Details section
  False: Hide Enterprise Details section
```

### Business Rule vs Other Options

| Scenario | Use Business Rule | Use Plugin | Use Flow |
|----------|----------------|------------|----------|
| Field visibility | Yes | No | No |
| Simple validation | Yes | Maybe | No |
| Cross-table logic | No | Yes | Yes |
| External API call | No | No | Yes |
| Complex calculation | No | Yes | Maybe |

---

## 5. Plug-in Patterns

### Synchronous Validation Plugin

```csharp
public class ValidateOpportunityPlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        var context = (IPluginExecutionContext)
            serviceProvider.GetService(typeof(IPluginExecutionContext));
        var tracing = (ITracingService)
            serviceProvider.GetService(typeof(ITracingService));

        if (!context.InputParameters.Contains("Target")) return;

        var entity = (Entity)context.InputParameters["Target"];

        // Validate estimated value
        if (entity.Contains("estimatedvalue"))
        {
            var value = entity.GetAttributeValue<Money>("estimatedvalue");
            if (value != null && value.Value > 1000000)
            {
                throw new InvalidPluginExecutionException(
                    "Opportunities over $1M require VP approval.");
            }
        }
    }
}
```

### Async Integration Plugin

```csharp
// Use for external API calls
// Register as Async, Post-Operation
public void Execute(IServiceProvider serviceProvider)
{
    var context = (IPluginExecutionContext)
        serviceProvider.GetService(typeof(IPluginExecutionContext));

    // Call external API
    var client = new HttpClient();
    var response = await client.PostAsJsonAsync(
        "https://api.example.com/sync", data);

    // Log result
    var tracing = (ITracingService)
        serviceProvider.GetService(typeof(ITracingService));
    tracing.Trace($"Sync response: {response.StatusCode}");
}
```

### Plugin Registration Steps

| Stage | Timing | Use For |
|-------|--------|---------|
| Pre-Validation | Before security check | Lightweight validation |
| Pre-Operation | Before DB operation | Modify data before save |
| Post-Operation | After DB operation | Integration, notifications |

---

## 6. Custom API Patterns

### Creating a Custom API

```
Custom API: alu_CalculateDiscount
  Display Name: Calculate Discount
  Binding: None (unbound)
  Input Parameters:
    - CustomerTier (String: Gold/Silver/Bronze)
    - OrderAmount (Decimal)
  Output Parameters:
    - DiscountPercent (Decimal)
    - DiscountAmount (Money)
```

### Invoking Custom API

```javascript
// JavaScript (web resource)
const result = await Xrm.WebApi.executeAction(
  "alu_CalculateDiscount",
  {
    CustomerTier: "Gold",
    OrderAmount: 5000.00
  }
);
console.log(result.DiscountPercent); // 15
```

```csharp
// C# Plugin calling another custom API
var request = new OrganizationRequest("alu_CalculateDiscount");
request["CustomerTier"] = "Gold";
request["OrderAmount"] = 5000m;
var response = service.Execute(request);
var discount = (decimal)response["DiscountPercent"];
```

---

## 7. Security Patterns

### Role-Based Access

```
Security Roles:
  - Sales Rep: CRUD own opportunities, Read accounts
  - Sales Manager: CRUD team opportunities, Read all accounts
  - System Admin: Full access
```

### Field-Level Security

```
Sensitive fields:
  - Social Security Number: Only HR can read
  - Salary: Only HR and manager can read
  - Commission: Sales and manager can read
```

### Hierarchy Security

```
Manager Hierarchy:
  - VP sees all
  - Director sees department
  - Manager sees team
  - Rep sees own
```

### Record-Level Sharing

```csharp
// Share record with team
var grant = new GrantAccessRequest
{
    Target = new EntityReference("opportunity", opportunityId),
    PrincipalAccess = new PrincipalAccess
    {
        Principal = new EntityReference("team", teamId),
        AccessMask = AccessRights.ReadAccess | AccessRights.WriteAccess
    }
};
service.Execute(grant);
```
