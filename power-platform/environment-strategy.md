---
title: "Environment Strategy Guide"
description: "Environment topology, governance, and naming conventions for Power Platform"
category: "governance"
tags: ["environments", "governance", "topology", "strategy"]
---

# Environment Strategy Guide

## 1. Dev/Test/Prod Topology

### Standard Three-Environment Setup

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Development   │────▶│      Test       │────▶│   Production    │
│   (Sandbox)     │     │   (Sandbox)     │     │  (Production)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       ▲                                               │
       └───────────────────────────────────────────────┘
                    (Feedback loop)
```

### Five-Environment Setup (Recommended for Enterprise)

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│    Dev       │──▶│     SIT      │──▶│     UAT      │──▶│    Prod      │   │   Prod       │
│  (Sandbox)   │   │  (Sandbox)   │   │  (Sandbox)   │   │ (Production) │   │  Support     │
│              │   │              │   │              │   │              │   │  (Sandbox)   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

| Environment | Purpose | Type | Data |
|-------------|---------|------|------|
| Dev | Development and unit testing | Sandbox | Sample data |
| SIT | System integration testing | Sandbox | Synthetic data |
| UAT | User acceptance testing | Sandbox | Anonymized prod subset |
| Prod | Live production | Production | Real data |
| Prod Support | Production debugging | Sandbox | Prod copy (restricted) |

---

## 2. Sandbox Types

| Type | Use Case | Reset Capability | Cost |
|------|----------|-----------------|------|
| Trial | POC, evaluation | None (expires) | Free (30 days) |
| Sandbox | Development, testing | Full reset available | Licensed |
| Production | Live environment | No reset | Licensed |
| Default | Personal productivity | No reset | Per-user |

### Creating Sandboxes

```powershell
# Via Power Platform Admin Center
# https://admin.powerplatform.microsoft.com
# Environments > New

# Via PAC CLI
pac admin create --name "Aluma-UAT" --region "unitedstates" --type "Sandbox"

# Via Power Platform API
POST https://api.bap.microsoft.com/providers/Microsoft.BusinessAppPlatform/environments
{
  "location": "unitedstates",
  "properties": {
    "displayName": "Aluma-UAT",
    "environmentSku": "Sandbox",
    "parentEnvironment": ""
  }
}
```

---

## 3. Environment Naming Conventions

### Format
```
<OrgShort>-<Purpose>-<Region>
```

### Examples
| Name | Organization | Purpose | Region |
|------|-------------|---------|--------|
| ALU-Dev-US | Aluma | Development | United States |
| ALU-SIT-US | Aluma | SIT | United States |
| ALU-UAT-EU | Aluma | UAT | Europe |
| ALU-Prod-EU | Aluma | Production | Europe |
| ALU-Support-US | Aluma | Support | United States |

### URL Naming
Environment URLs should follow:
```
https://<org>-<purpose>.crm.dynamics.com
```

---

## 4. Maker Environment Governance

### Default Environment Policy

```powershell
# Get default environment settings
Get-AdminPowerAppEnvironment -Default

# Set default environment capacity
# Via Admin Center:
# Settings > Product > Behavior > Environment capacity
```

### DLP Policies Per Environment

| Policy | Dev | SIT | UAT | Prod |
|--------|-----|-----|-----|------|
| Allow all connectors | Yes | No | No | No |
| Allow only approved | No | Yes | Yes | Yes |
| Block sensitive | No | Yes | Yes | Yes |
| Custom connector review | Optional | Required | Required | Required |

### Environment Security

```powershell
# Add security group to environment
# Admin Center > Environment > Settings > Users + permissions > Security groups

# Set admin roles
Add-AdminPowerAppEnvironmentRoleAssignment `
  -EnvironmentName <guid> `
  -RoleName "System Administrator" `
  -PrincipalObjectId <user-guid>
```

---

## 5. Default Environment Considerations

### Risks of the Default Environment
- All licensed users are auto-added
- No automatic cleanup
- Hard to govern at scale
- Apps can be shared broadly without oversight

### Mitigation Strategies

1. **DLP Policy**: Apply restrictive DLP to default environment
2. **Quarantine**: Enable quarantine for non-compliant apps
3. **Monitoring**: Set up alerts for new app creation
4. **Education**: Train makers to use proper dev environments
5. **Cleanup**: Quarterly review and cleanup of unused apps

```powershell
# Enable quarantine
Set-TenantSettings -RequestBody '{
  "powerPlatform": {
    "governance": {
      "quarantineNonWhitelistedApps": true
    }
  }
}'
```

---

## 6. Data Residency

### Available Regions

| Region | Location | Notes |
|--------|----------|-------|
| United States | US | Default for US tenants |
| Europe | EU | GDPR compliant |
| UK | United Kingdom | Post-Brexit |
| Asia Pacific | APAC | Singapore, Japan, Australia |
| South America | Brazil | LATAM data residency |
| Canada | Canada | Canadian data residency |
| India | India | Indian data residency |
| Switzerland | CH | Swiss data residency |
| Germany | DE | German data residency |
| Norway | NO | Norwegian data residency |
| South Africa | ZA | South African data residency |
| UAE | UAE | Middle East data residency |
| Korea | KR | Korean data residency |
| France | FR | French data residency |

### Checking Data Location

```powershell
# Via PAC CLI
pac admin list

# Look for the "Location" column

# Via PowerShell
Get-AdminPowerAppEnvironment | Select DisplayName, Location
```

### Multi-Region Strategy

For organizations operating in multiple regions:

```
Tenant Root
├── Region: United States
│   ├── ALU-Dev-US
│   ├── ALU-UAT-US
│   └── ALU-Prod-US
├── Region: Europe
│   ├── ALU-Dev-EU
│   ├── ALU-UAT-EU
│   └── ALU-Prod-EU
└── Region: Asia Pacific
    ├── ALU-Dev-APAC
    ├── ALU-UAT-APAC
    └── ALU-Prod-APAC
```

---

## 7. Environment Lifecycle Management

### Creation Checklist
- [ ] Name follows convention
- [ ] Security group assigned
- [ ] DLP policy applied
- [ ] Admin roles assigned
- [ ] Region correct for data residency
- [ ] Purpose documented
- [ ] Budget code assigned

### Decommissioning Checklist
- [ ] All solutions exported and stored
- [ ] All apps backed up
- [ ] All flows documented
- [ ] Data exported (if required)
- [ ] Users notified
- [ ] Dependent systems updated
- [ ] Environment deleted from admin center

---

## 8. Environment Variables by Environment

| Variable | Dev | SIT | UAT | Prod |
|----------|-----|-----|-----|------|
| API Base URL | `https://api-dev.example.com` | `https://api-sit.example.com` | `https://api-uat.example.com` | `https://api.example.com` |
| Debug Mode | `true` | `true` | `false` | `false` |
| Log Level | `Verbose` | `Information` | `Warning` | `Error` |
| Feature Flags | All enabled | Staged | Staged | Production set |
