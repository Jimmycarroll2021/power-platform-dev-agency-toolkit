---
title: "Environment Variable Guide"
description: "Guide for creating, managing, and using environment variables in Power Platform ALM"
category: "alm"
tags: ["environment-variables", "alm", "configuration", "deployment"]
---

# Environment Variable Guide

## 1. Purpose and Usage

Environment variables store parameter values that differ across environments. They enable:
- Same solution deployed to multiple environments with different config
- No hard-coded URLs, IDs, or settings in flows/apps
- Easy configuration changes without code modifications
- Secure storage of non-secret configuration values

```
Solution (with env vars)
    │
    ├──▶ Dev Environment    → API_URL = https://api-dev.example.com
    ├──▶ UAT Environment    → API_URL = https://api-uat.example.com
    └──▶ Prod Environment   → API_URL = https://api.example.com
```

---

## 2. Creating and Managing

### Via Maker Portal

1. Open **make.powerapps.com**
2. Select your solution
3. Click **New > Environment Variable**
4. Configure:
   - **Display Name**: `API Base URL`
   - **Name**: `alu_APIBaseURL`
   - **Data Type**: Text
   - **Default Value**: `https://api-dev.example.com`
   - **Description**: `Base URL for the REST API`

### Via Code / API

```javascript
// Create environment variable via Web API
POST https://<env>.api.crm.dynamics.com/api/data/v9.2/environmentvariabledefinitions
{
  "schemaname": "alu_APIBaseURL",
  "displayname": "API Base URL",
  "description": "Base URL for REST API",
  "type": 100000000, // Text
  "defaultvalue": "https://api-dev.example.com"
}
```

---

## 3. Data Types Supported

| Type | Schema Value | Use Case | Example |
|------|-------------|----------|---------|
| Text | 100000000 | URLs, identifiers, names | `https://api.example.com` |
| Number | 100000001 | Numeric configuration | `30` (timeout seconds) |
| Boolean | 100000002 | Feature flags | `true` / `false` |
| JSON | 100000003 | Complex configuration | `{"timeout":30,"retries":3}` |
| Data Source | 100000004 | Connection references | SharePoint site |
| Secret | 100000005 | Sensitive values (Azure Key Vault) | Key Vault reference |

---

## 4. ALM with Environment Variables

### In Solutions

Environment variables are solution-aware:
- Travel with solution exports/imports
- Default values included
- Environment-specific values override defaults

### Setting Values Per Environment

```bash
# Via PAC CLI (after import)
pac solution import --path "solution.zip" \
  --settings-file "deployment-settings.json"
```

**deployment-settings.json:**
```json
{
  "EnvironmentVariables": [
    {
      "SchemaName": "alu_APIBaseURL",
      "Value": "https://api-uat.example.com"
    },
    {
      "SchemaName": "alu_FeatureFlag_NewUI",
      "Value": "true"
    }
  ]
}
```

### Azure DevOps Pipeline

```yaml
- task: PowerPlatformImportSolution@2
  inputs:
    environment: "$(EnvironmentUrl)"
    solution: "$(SolutionPath)"
    deploymentSettingsFile: "$(DeploymentSettingsPath)"
```

---

## 5. Default Values and Overrides

### Precedence Order

1. **Environment-specific value** (highest priority)
2. **Current value in target environment**
3. **Default value from solution**

### Setting Environment-Specific Values

```powershell
# PowerShell via Dataverse API
$definition = Get-CrmRecord `
  -EntityLogicalName "environmentvariabledefinition" `
  -Id $variableId `
  -Fields "schemaname"

# Check if value exists
$values = Get-CrmRecords `
  -EntityLogicalName "environmentvariablevalue" `
  -FilterAttribute "environmentvariabledefinitionid" `
  -FilterOperator "eq" `
  -FilterValue $definition.Id

# Create or update value
if ($values.Count -eq 0) {
  New-CrmRecord -EntityLogicalName "environmentvariablevalue" -Fields @{
    "environmentvariabledefinitionid" = $definition.ToEntityReference()
    "value" = "https://api-prod.example.com"
  }
} else {
  Set-CrmRecord -EntityLogicalName "environmentvariablevalue" `
    -Id $values[0].Id `
    -Fields @{ "value" = "https://api-prod.example.com" }
}
```

---

## 6. Using in Flows

### Reading Environment Variables

1. Add action: **"List rows"** (Dataverse)
   - Table: `Environment Variable Definitions`
   - Filter: `schemaname eq 'alu_APIBaseURL'`

2. Or use the direct connector:
   - **"Get environment variable value"** (Power Platform for Admins)

3. Parse the value for use in subsequent actions

### Best Practice Pattern

```
[Initialize Variable: API_URL]
  │
  ├──▶ [Get env var: alu_APIBaseURL]
  │
  ├──▶ [Set Variable: API_URL = output from env var]
  │
  └──▶ [HTTP Request: @{variables('API_URL')}/endpoint]
```

---

## 7. Using in Canvas Apps

### Loading Environment Variables

```powerapps
// On App Start
Set(varAPIBaseURL, EnvironmentVariableValue("alu_APIBaseURL"));

// Use in formula
Navigate("Screen2", ScreenTransition.None, {url: varAPIBaseURL})
```

### Environment Variable Table Query

```powerapps
// Direct lookup
LookUp(
  'Environment Variable Values',
  'Environment Variable Definition'.'Schema Name' = "alu_APIBaseURL"
).Value
```

---

## 8. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Sensitive values | Use Secret type with Azure Key Vault |
| Read access | All users can read env var values |
| Write access | Restrict to admins and service accounts |
| Audit changes | Enable Dataverse auditing on env var tables |
| Secret storage | Never store passwords directly; use Key Vault |

### Azure Key Vault Integration

1. Create a Key Vault in Azure
2. Add the secret
3. Create a Dataverse-managed identity
4. Reference in environment variable:
   ```
   @Microsoft.KeyVault(SecretName=my-secret)
   ```

---

## 9. Naming Convention

```
<prefix>_<Category>_<Name>
```

| Name | Category | Purpose |
|------|----------|---------|
| alu_API_BaseURL | API | REST API endpoint |
| alu_API_Timeout | API | Request timeout (seconds) |
| alu_SP_SiteUrl | SharePoint | SharePoint site collection URL |
| alu_FF_NewDashboard | Feature Flag | Enable new dashboard |
| alu_Email_Support | Email | Support email address |
| alu_Log_Level | Logging | Application log verbosity |
