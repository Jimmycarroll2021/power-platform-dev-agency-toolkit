# ALM Pipeline Playbook

> **Complexity Rating:** High
> **Last Updated:** 2024
> **Applies To:** Power Platform ALM, Azure DevOps, Pipelines, Solutions, Deployment

---

## 1. Overview

This playbook covers Application Lifecycle Management (ALM) for Power Platform solutions using:

| Tool | Purpose |
|------|---------|
| Azure DevOps / GitHub | Source control, pipeline orchestration |
| Power Platform Build Tools | Solution export/import |
| Power Platform CLI (pac) | Command-line operations |
| Pipelines | Dev -> Test -> Production |
| Solutions | Packaging and deployment units |

### ALM Principles

| Principle | Implementation |
|-----------|---------------|
| Source control | All solutions in Git |
| Environment isolation | Dev, Test, UAT, Prod |
| Automated deployment | CI/CD pipelines |
| Version control | Semantic versioning for solutions |
| Change tracking | Pull requests, code reviews |
| Rollback capability | Previous versions in Git |
| Environment variables | No hardcoded values |

---

## 2. Environment Strategy

### 2.1 Environment Structure

```
[DEVELOPMENT]
  |-- Unmanaged solutions
  |-- Multiple dev environments (per developer or per feature)
  |-- Frequent changes
  |-- Development data
  |
  v (Export unmanaged, commit to Git)

[BUILD]
  |-- Managed solution created from source
  |-- Validation checks
  |-- Solution version incremented
  |
  v (Import managed)

[TEST / SIT]
  |-- Managed solutions only
  |-- Integration testing
  |-- Automated tests run
  |
  v (Manual approval)

[UAT]
  |-- Managed solutions only
  |-- Business user testing
  |-- UAT sign-off required
  |
  v (Manual approval)

[PRODUCTION]
  |-- Managed solutions only
  |-- Live system
  |-- Change control required
```

### 2.2 Environment Configuration

| Setting | Dev | Test | UAT | Prod |
|---------|-----|------|-----|------|
| Solution type | Unmanaged | Managed | Managed | Managed |
| Background ops | On | On | On | On |
| Audit | Full | Full | Full | Full |
| Plugin trace log | All | Exception | Exception | Off |
| Flows | On | On | On | On (with approval) |
| Customizations | Any | None direct | None direct | None direct |

---

## 3. Branching Strategy

### 3.1 Git Flow for Power Platform

```
[main] (Production-ready)
  |
  +--[release/v1.0] (Stabilization)
  |     +--[feature/auth]
  |     +--[feature/reporting]
  |     +--[bugfix/login]
  |
  +--[hotfix/security-patch] (Emergency fixes)
```

### 3.2 Branch Rules

| Branch | Purpose | Protection |
|--------|---------|------------|
| main | Production-ready code | Require PR, require review |
| release/* | Release preparation | Require PR, require review |
| feature/* | New features | PR to release or main |
| bugfix/* | Bug fixes | PR to release or main |
| hotfix/* | Emergency production fixes | Require review, fast-track |

---

## 4. Solution Strategy

### 4.1 Solution Segmentation

```
ContosoCore (Foundation)
  |-- Core tables
  |-- Core choices
  |-- Core security roles
  |-- Core business rules

ContosoApps (Applications)
  |-- Canvas apps
  |-- Model-driven apps
  |-- Depends on: ContosoCore

ContosoAutomation (Workflows)
  |-- Cloud flows
  |-- Connection references
  |-- Environment variables
  |-- Depends on: ContosoCore, ContosoApps

ContosoReports (Reporting)
  |-- Power BI reports
  |-- Dashboards
  |-- Charts
  |-- Depends on: ContosoCore

ContosoConfig (Environment Config)
  |-- Environment-specific settings
  |-- Security role assignments
  |-- Depends on: All above
```

### 4.2 Solution Dependencies

| Solution | Dependencies | Deployment Order |
|----------|-------------|-----------------|
| ContosoCore | None | 1 |
| ContosoApps | ContosoCore | 2 |
| ContosoAutomation | ContosoCore, ContosoApps | 3 |
| ContosoReports | ContosoCore | 4 |
| ContosoConfig | All | 5 |

> **DO NOT:** Create circular dependencies between solutions. Always maintain a clear dependency hierarchy.

---

## 5. Pipelines

### 5.1 CI Pipeline (Build)

```yaml
# azure-pipelines-build.yml
trigger:
  branches:
    include:
      - release/*
      - main

variables:
  SolutionName: 'ContosoCore'
  BuildConfiguration: 'Release'

stages:
- stage: Export_and_Pack
  jobs:
  - job: Export_From_Dev
    steps:
    # Authenticate to Power Platform
    - task: PowerPlatformToolInstaller@2
    
    - task: PowerPlatformExportSolution@2
      inputs:
        authenticationType: 'PowerPlatformSPN'
        PowerPlatformSPN: 'Dev-ServiceConnection'
        SolutionName: '$(SolutionName)'
        SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(SolutionName).zip'
        Managed: true
        ExportAutoNumberSettings: true
        ExportRelationshipRoles: true
    
    # Unpack solution for source control
    - task: PowerPlatformUnpackSolution@2
      inputs:
        SolutionInputFile: '$(Build.ArtifactStagingDirectory)/$(SolutionName).zip'
        SolutionTargetFolder: '$(Build.SourcesDirectory)/solutions/$(SolutionName)'
        SolutionType: 'Managed'
    
    # Publish artifact
    - task: PublishBuildArtifacts@1
      inputs:
        PathtoPublish: '$(Build.ArtifactStagingDirectory)'
        ArtifactName: 'drop'
```

### 5.2 CD Pipeline (Deploy to Test)

```yaml
# azure-pipelines-deploy-test.yml
trigger: none  # Manual or from build pipeline

stages:
- stage: Deploy_to_Test
  jobs:
  - deployment: Test_Deployment
    environment: 'Test'
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: drop
          
          - task: PowerPlatformImportSolution@2
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'Test-ServiceConnection'
              SolutionInputFile: '$(Pipeline.Workspace)/drop/$(SolutionName).zip'
              AsyncOperation: true
              MaxAsyncWaitTime: '60'
              ImportAsHoldingSolution: false
              PublishWorkflows: true
          
          - task: PowerPlatformPublishCustomizations@2
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'Test-ServiceConnection'
```

### 5.3 CD Pipeline (Deploy to Production)

```yaml
# azure-pipelines-deploy-prod.yml
trigger: none  # Manual approval required

stages:
- stage: Production_Approval
  jobs:
  - job: Wait_For_Approval
    pool: server
    steps:
    - task: ManualValidation@1
      inputs:
        notifyUsers: 'steering-committee@company.com'
        instructions: 'Approve deployment to production'
        onTimeout: 'reject'

- stage: Deploy_to_Production
  jobs:
  - deployment: Prod_Deployment
    environment: 'Production'
    strategy:
      canary:
        increments: [10, 50, 100]
        deploy:
          steps:
          - task: PowerPlatformImportSolution@2
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'Prod-ServiceConnection'
              SolutionInputFile: '$(Pipeline.Workspace)/drop/$(SolutionName).zip'
              AsyncOperation: true
              PublishWorkflows: true
```

---

## 6. Deployment

### 6.1 Deployment Methods

| Method | Use For | Tool |
|--------|---------|------|
| Pipeline deployment | Standard deployments | Azure DevOps |
| Power Platform CLI | Ad-hoc, local deployments | pac CLI |
| Power Platform Admin Center | Manual, emergency | Web UI |
| Solution patches | Hotfixes | pac CLI or pipeline |

### 6.2 Power Platform CLI Commands

```bash
# Authenticate
pac auth create --url https://org.crm.dynamics.com --name MyOrg

# Export solution (unmanaged)
pac solution export --path ./ContosoCore.zip --name ContosoCore --managed false

# Export solution (managed)
pac solution export --path ./ContosoCore_managed.zip --name ContosoCore --managed true

# Unpack solution
pac solution unpack --zipfile ./ContosoCore.zip --folder ./src/ContosoCore

# Pack solution
pac solution pack --zipfile ./ContosoCore.zip --folder ./src/ContosoCore --managed true

# Import solution
pac solution import --path ./ContosoCore_managed.zip --publish-changes --async

# Clone solution (for source control)
pac solution clone --name ContosoCore --outputDirectory ./src
```

### 6.3 Deployment Checklist

- [ ] Solution exported and versioned
- [ ] Git commit with meaningful message
- [ ] Pull request reviewed and approved
- [ ] Pipeline passed (build, test)
- [ ] Target environment backup created
- [ ] Connection references configured
- [ ] Environment variables set
- [ ] Pre-deployment smoke test environment ready
- [ ] Deployment window scheduled
- [ ] Rollback plan documented
- [ ] Communication plan ready

---

## 7. Rollback

### 7.1 Rollback Strategy

| Type | Method | When to Use |
|------|--------|-------------|
| Solution rollback | Import previous managed version | New deployment has issues |
| Data rollback | Restore environment backup | Data corruption |
| Configuration rollback | Reset environment variables | Config issue |
| Hotfix | Create and deploy patch | Specific bug fix |

### 7.2 Rollback Procedure

```
[Issue detected in production]
       |
       v
[Assess severity and scope]
       |
       +--[Critical: System down]
       |     |-- Immediately rollback
       |     |-- Notify stakeholders
       |     |-- Begin investigation
       |
       +--[High: Major feature broken]
       |     |-- Evaluate fix vs rollback timeline
       |     |-- If fix > 2 hours, rollback
       |     |-- If fix < 2 hours, fix forward
       |
       +--[Medium/Low]
             |-- Fix forward with patch
             |-- Schedule fix in next release

[Rollback Steps]:
1. Stop all flows in target solution
2. Import previous managed solution version
3. Verify import success
4. Publish all customizations
5. Run smoke tests
6. Notify stakeholders
7. Schedule post-mortem
```

---

## 8. Governance

### 8.1 Change Control

| Change Type | Approval Required | Pipeline |
|-------------|------------------|----------|
| Standard feature | Dev Lead + Product Owner | release/* branch |
| Hotfix | Dev Lead (emergency) | hotfix/* branch |
| Configuration change | Environment Admin | Separate config pipeline |
| Security patch | Security Lead | hotfix/* branch |
| Data model change | Architect + Product Owner | Release branch |

### 8.2 Code Review Checklist

| Item | Reviewer | Notes |
|------|----------|-------|
| No hardcoded values | Dev Lead | Use environment variables |
| Error handling present | Dev Lead | All flows have error scopes |
| Naming conventions followed | Dev Lead | Consistent naming |
| No test data in solution | QA Lead | Clean solutions |
| Security review | Security Lead | No credential exposure |
| Documentation updated | Tech Writer | Runbooks updated |
| Version incremented | DevOps | Semantic versioning |

---

## 9. Environment Variables

### 9.1 Environment Variable Strategy

| Variable Type | Example | Environment-Specific |
|--------------|---------|---------------------|
| URL endpoints | API base URL | Yes |
| Email addresses | Notification email | Yes |
| Thresholds | Approval limit amount | No (shared) |
| Feature flags | Enable new feature | Yes |
| Timeouts | API timeout seconds | No (shared) |
| IDs | Teams channel ID | Yes |

### 9.2 Environment Variable Setup

```
1. Create in solution (with default value)
   - Display name: "API Base URL"
   - Schema name: "contoso_APIBaseURL"
   - Data type: Text
   - Default value: "https://api-dev.example.com"

2. Set per environment:
   Dev:  https://api-dev.example.com
   Test: https://api-test.example.com
   Prod: https://api.example.com

3. Reference in flows:
   - Use "Environment Variable" dynamic content
   - Never hardcode URLs in flows
```

---

## 10. Connection References

### 10.1 Connection Reference Strategy

```
Solution: ContosoAutomation
  |
  +-- Connection References:
  |     +-- "Dataverse Connection Ref"
  |     +-- "SharePoint Connection Ref"
  |     +-- "Outlook Connection Ref"
  |     +-- "Teams Connection Ref"
  |
  +-- Flows use connection references (not direct connections)
  |
  +-- Per environment, connection references map to:
        Dev:  svc-dev@company.com connections
        Test: svc-test@company.com connections
        Prod: svc-prod@company.com connections
```

### 10.2 Connection Reference Setup

| Environment | Service Account | Connections |
|------------|----------------|-------------|
| Development | svc-dev@company.com | All dev connections |
| Test | svc-test@company.com | All test connections |
| Production | svc-prod@company.com | All production connections |

---

## 11. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Deployment failure | High | Test in non-prod, have rollback plan |
| Unmanaged layer conflicts | High | Use managed solutions, document layers |
| Missing dependencies | High | Dependency check in pipeline |
| Environment variable not set | Medium | Validation step in pipeline |
| Connection reference broken | Medium | Post-deployment validation |
| Solution version conflict | Medium | Semantic versioning, unique versions |
| Pipeline failure | Medium | Monitor, alert, manual fallback |
| Unauthorized deployment | Critical | Branch protection, approval gates |
| Overwriting production data | Critical | Separate environments, no direct dev access |

---

## 12. Quick Reference

### Semantic Versioning for Solutions

| Version Change | When | Example |
|---------------|------|---------|
| Major (X.0.0) | Breaking changes | 1.0.0 -> 2.0.0 |
| Minor (x.X.0) | New features, backward compatible | 1.0.0 -> 1.1.0 |
| Patch (x.x.X) | Bug fixes | 1.0.0 -> 1.0.1 |

### Pipeline Status Checklist

| Stage | Status | Notes |
|-------|--------|-------|
| Build | [ ] | Solution exported, tests passed |
| Test Deploy | [ ] | Deployed to test, smoke tests passed |
| UAT | [ ] | Business sign-off obtained |
| Prod Approval | [ ] | Steering committee approved |
| Prod Deploy | [ ] | Deployed, smoke tests passed |
| Post-Deploy | [ ] | 24-hour monitoring complete |
