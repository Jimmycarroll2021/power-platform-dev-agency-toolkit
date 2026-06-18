---
title: "Connection Reference Guide"
description: "Guide for creating, configuring, and managing connection references in ALM"
category: "alm"
tags: ["connection-references", "alm", "connections", "deployment"]
---

# Connection Reference Guide

## 1. What Are Connection References

Connection references are solution-aware wrappers around connector connections. They:
- Store only the connection name (not credentials)
- Travel with solutions across environments
- Allow connection swapping at deployment time
- Enable multi-maker collaboration

```
Flow ──uses──▶ Connection Reference ──points to──▶ Connection (with credentials)
                    (solution-aware)              (environment-specific)
```

---

## 2. Why Use Connection References

| Without Connection References | With Connection References |
|------------------------------|---------------------------|
| Connection embedded in flow | Connection decoupled |
| Breaks on environment move | Survives environment promotion |
| Hard-coded credentials | References only |
| Single maker ownership | Multi-maker collaboration |
| Manual re-auth after deploy | Pre-configured connections |

---

## 3. Creating Connection References

### Via Maker Portal

1. Open **make.powerapps.com**
2. Select your solution
3. Click **New > Connection Reference**
4. Fill in:
   - **Display Name**: `SharePoint-Site-Core`
   - **Connector**: SharePoint
   - **Connection**: Select or create connection
   - **Description**: `Primary SharePoint connection for document management`

### Naming Convention

```
<ConnectorShort>-<Purpose>-<EnvironmentSuffix>
```

| Name | Connector | Purpose |
|------|-----------|---------|
| SP-Docs-Core | SharePoint | Document library access |
| Outlook-Notify-Primary | Outlook | Notification emails |
| SQL-ERP-ReadWrite | SQL Server | ERP data access |
| HTTP-API-Core | HTTP | Custom API calls |
| Dataverse-Admin | Dataverse | Admin operations |

---

## 4. Configuring in Flows

### Adding to a Flow

1. Edit your cloud flow
2. When adding an action, select **"Connect with connection reference"**
3. Choose existing or create new
4. All actions using that connector will share the reference

### Example: Dynamic Content

```
Trigger: When an item is created
Action: Send an email (V2)
  Connection Reference: Outlook-Notify-Primary
Action: Create item (SharePoint)
  Connection Reference: SP-Docs-Core
```

---

## 5. ALM with Connection References

### Deployment-Time Configuration

When importing a solution with connection references:

```bash
# Import and let the UI prompt for connections
pac solution import --path "solution.zip"

# Or pre-create connection references in target
curl -X POST https://<env>.api.crm.dynamics.com/api/data/v9.2/connectionreferences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionreferencelogicalname": "alu_SP_Docs_Core",
    "connectorid": "/providers/Microsoft.PowerApps/apis/shared_sharepointonline",
    "connectionid": "/providers/Microsoft.PowerApps/apis/shared_sharepointonline/connections/<connection-id>"
  }'
```

### Connection Reference Mapping File

Create a JSON mapping for CI/CD:

```json
{
  "connectionReferences": [
    {
      "logicalName": "alu_SP_Docs_Core",
      "connectionName": "shared_sharepointonline_<guid>",
      "connectorId": "/providers/Microsoft.PowerApps/apis/shared_sharepointonline"
    },
    {
      "logicalName": "alu_Outlook_Notify_Primary",
      "connectionName": "shared_office365_<guid>",
      "connectorId": "/providers/Microsoft.PowerApps/apis/shared_office365"
    }
  ]
}
```

---

## 6. Common Issues and Resolutions

### Issue: Connection Reference Broken After Import

**Symptoms:** Flow shows "Invalid connection" or connection reference not found.

**Resolution:**
1. Go to **make.powerapps.com** > Solutions
2. Open the imported solution
3. Find the connection reference
4. Click **Edit** and select/create the correct connection
5. Save and turn the flow back on

### Issue: Flow Uses Connection Instead of Connection Reference

**Symptoms:** Flow works in dev but breaks after deployment.

**Resolution:**
1. Open the flow for editing
2. For each action using a connector:
   - Click the **...** menu on the action
   - Select **"Change connection"**
   - Choose **"Connect with connection reference"**
   - Select or create the connection reference
3. Save the flow
4. Add the connection reference to your solution

### Issue: Multiple Connection References for Same Connector

**Symptoms:** Confusion about which reference to use.

**Resolution:**
- Consolidate where possible
- Use clear naming conventions
- Document the purpose of each reference
- Limit to one per connector per solution unless multi-tenant needs exist

### Issue: Connection Reference Not in Solution

**Symptoms:** Missing connection reference error during import.

**Resolution:**
1. In maker portal, ensure connection reference is in the solution
2. Add **Add required components** to include dependencies
3. Export and re-import

---

## 7. Best Practices

| Practice | Recommendation |
|----------|---------------|
| Naming | Use consistent, descriptive names |
| Scope | One reference per connector per solution |
| Ownership | Assign to service account, not individual |
| Documentation | Document all references in solution design |
| Security | Use least-privilege connections |
| Monitoring | Review connections quarterly |

---

## 8. PowerShell Management

```powershell
# List all connection references in environment
Get-AdminPowerAppConnectionReference

# Get connection references for a specific solution
$solutionId = "<solution-guid>"
$refs = Get-AdminPowerAppConnectionReference | Where-Object { $_.SolutionId -eq $solutionId }

# Export connection reference configuration
$refs | Export-Csv -Path "./connection-references.csv"
```
