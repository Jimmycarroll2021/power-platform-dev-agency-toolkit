---
title: "ALM and DevOps Patterns"
description: "ALM patterns for Power Platform including branching, pipelines, and release management"
category: "devops"
tags: ["alm", "devops", "pipelines", "branching", "deployment"]
---

# ALM and DevOps Patterns

## 1. Branching Strategy

### GitFlow for Power Platform

```
main          ●────────●────────●────────●────► Production
             /          \        /        /
develop     ●────●────●────●────●────●────► Integration
                 /    \    /    /
feature/login   ●────●       (feature branches)
feature/search        ●────●
patch/bug-123              ●────●
```

### Branch Rules

| Branch | Purpose | Deploys To |
|--------|---------|-----------|
| `main` | Production-ready code | Production |
| `develop` | Integration branch | SIT |
| `feature/*` | Feature development | Dev (individual) |
| `release/*` | Release preparation | UAT |
| `hotfix/*` | Production fixes | Production (emergency) |

### Commit Convention

```
type(scope): description

Types:
  feat:     New feature
  fix:      Bug fix
  docs:     Documentation only
  style:    Formatting, no code change
  refactor: Code restructuring
  test:     Adding tests
  chore:    Maintenance tasks

Examples:
  feat(solutions): add invoice processing solution
  fix(flows): resolve race condition in approval flow
  docs(readme): update deployment instructions
```

---

## 2. Pipeline Configuration

### Azure DevOps Pipeline

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
      - develop
      - release/*

variables:
  solutionName: "AlumaCore"
  buildConfiguration: "Release"

stages:
  # ── Build Stage ──────────────────────────────────────────────
  - stage: Build
    jobs:
      - job: PackSolution
        pool:
          vmImage: "windows-latest"
        steps:
          - task: PowerPlatformToolInstaller@2

          - task: PowerPlatformExportSolution@2
            inputs:
              authenticationType: "PowerPlatformSPN"
              PowerPlatformSPN: "DevServiceConnection"
              SolutionName: "$(solutionName)"
              SolutionOutputFile: "$(Build.ArtifactStagingDirectory)/$(solutionName).zip"
              Managed: false

          - task: PowerPlatformUnpackSolution@2
            inputs:
              SolutionInputFile: "$(Build.ArtifactStagingDirectory)/$(solutionName).zip"
              SolutionTargetFolder: "$(Build.SourcesDirectory)/solutions/$(solutionName)"

          - task: PublishBuildArtifacts@1
            inputs:
              pathToPublish: "$(Build.ArtifactStagingDirectory)"
              artifactName: "solution"

  # ── Deploy to SIT ────────────────────────────────────────────
  - stage: Deploy_SIT
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/develop'))
    jobs:
      - deployment: SIT
        environment: "SIT"
        strategy:
          runOnce:
            deploy:
              steps:
                - task: PowerPlatformImportSolution@2
                  inputs:
                    authenticationType: "PowerPlatformSPN"
                    PowerPlatformSPN: "SITServiceConnection"
                    SolutionInputFile: "$(Pipeline.Workspace)/solution/$(solutionName).zip"
                    AsyncOperation: true
                    MaxAsyncWaitTime: "60"

  # ── Deploy to UAT ────────────────────────────────────────────
  - stage: Deploy_UAT
    condition: and(succeeded(), startsWith(variables['Build.SourceBranch'], 'refs/heads/release/'))
    jobs:
      - deployment: UAT
        environment: "UAT"
        strategy:
          canary:
            increments: [10, 50, 100]
            deploy:
              steps:
                - task: PowerPlatformImportSolution@2
                  inputs:
                    authenticationType: "PowerPlatformSPN"
                    PowerPlatformSPN: "UATServiceConnection"
                    SolutionInputFile: "$(Pipeline.Workspace)/solution/$(solutionName).zip"
                    UseDeploymentSettingsFile: true
                    DeploymentSettingsFile: "config/UAT-deployment-settings.json"

  # ── Deploy to Production ─────────────────────────────────────
  - stage: Deploy_Prod
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: Production
        environment: "Production"
        strategy:
          runOnce:
            deploy:
              steps:
                - task: ManualValidation@1
                  inputs:
                    notifyUsers: "approvers@example.com"
                    instructions: "Approve production deployment"

                - task: PowerPlatformImportSolution@2
                  inputs:
                    authenticationType: "PowerPlatformSPN"
                    PowerPlatformSPN: "ProdServiceConnection"
                    SolutionInputFile: "$(Pipeline.Workspace)/solution/$(solutionName)_managed.zip"
                    AsyncOperation: true
                    MaxAsyncWaitTime: "120"
                    OverwriteUnmanagedCustomizations: false
                    PublishWorkflows: true
```

### GitHub Actions Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Solution

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Power Platform Tools
        uses: microsoft/powerplatform-actions/actions-install@v1

      - name: Export unmanaged solution
        uses: microsoft/powerplatform-actions/export-solution@v1
        with:
          environment-url: ${{ secrets.DEV_URL }}
          app-id: ${{ secrets.APP_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-name: AlumaCore
          solution-output-file: "./out/AlumaCore.zip"
          managed: false

      - name: Unpack solution
        uses: microsoft/powerplatform-actions/unpack-solution@v1
        with:
          solution-file: "./out/AlumaCore.zip"
          solution-folder: "./solutions/AlumaCore"
          solution-type: Unmanaged

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: solution
          path: ./out/

  deploy-sit:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: SIT
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: solution
          path: ./out/

      - name: Import to SIT
        uses: microsoft/powerplatform-actions/import-solution@v1
        with:
          environment-url: ${{ secrets.SIT_URL }}
          app-id: ${{ secrets.APP_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-file: "./out/AlumaCore.zip"
          publish-changes: true
```

---

## 3. Solution Export/Import Automation

### Export Script

```powershell
# export-solution.ps1
param(
    [string]$EnvironmentUrl,
    [string]$SolutionName,
    [string]$OutputPath,
    [bool]$Managed = $false
)

# Authenticate
pac auth create --environment $EnvironmentUrl

# Export solution
$managedFlag = if ($Managed) { "true" } else { "false" }
pac solution export `
    --name $SolutionName `
    --path $OutputPath `
    --managed $managedFlag `
    --include-general `
    --autosave-settings

# Unpack for source control
$zipPath = Join-Path $OutputPath "$SolutionName.zip"
$unpackPath = Join-Path $OutputPath "..\..\solutions\$SolutionName"
pac solution unpack `
    --zipfile $zipPath `
    --folder $unpackPath

Write-Host "Solution exported and unpacked to $unpackPath"
```

### Import Script

```powershell
# import-solution.ps1
param(
    [string]$EnvironmentUrl,
    [string]$SolutionPath,
    [bool]$PublishChanges = $true,
    [bool]$StageForUpgrade = $false
)

# Authenticate
pac auth create --environment $EnvironmentUrl

# Import
$publishFlag = if ($PublishChanges) { "true" } else { "false" }
$stageFlag = if ($StageForUpgrade) { "true" } else { "false" }

pac solution import `
    --path $SolutionPath `
    --publish-changes $publishFlag `
    --stage-for-upgrade $stageFlag `
    --convert-to-managed false

Write-Host "Solution imported successfully"
```

---

## 4. Environment Promotion

### Promotion Flow

```
Dev ──export──▶ Git Repo ──build──▶ SIT ──validate──▶ UAT ──approve──▶ Prod
     (unmanaged)           (managed)    (automated)    (manual)      (gated)
```

### Connection Reference Mapping

```json
{
  "ConnectionReferences": [
    {
      "LogicalName": "alu_SP_Docs_Core",
      "ConnectionId": "/providers/Microsoft.PowerApps/apis/shared_sharepointonline/connections/shared-sharepointon-123",
      "ConnectorId": "/providers/Microsoft.PowerApps/apis/shared_sharepointonline"
    }
  ],
  "EnvironmentVariables": [
    {
      "SchemaName": "alu_APIBaseURL",
      "Value": "https://api-sit.example.com"
    }
  ]
}
```

---

## 5. Release Management

### Release Calendar Template

| Week | Activity | Environment | Owner |
|------|----------|-------------|-------|
| 1 | Feature development | Dev | Developer |
| 2 | Feature development | Dev | Developer |
| 3 | Code freeze, QA | SIT | QA Lead |
| 4 | UAT | UAT | Business Analyst |
| 5 | Deploy to production | Prod | Release Manager |
| 6 | Hypercare | Prod | Support Team |

### Release Notes Template

```markdown
## Release v1.2.0 - 2024-03-15

### Features
- New invoice approval workflow
- Dashboard improvements
- Mobile responsiveness updates

### Bug Fixes
- Fixed data sync timeout issue
- Resolved duplicate notification bug

### Known Issues
- None

### Rollback Plan
- Previous version: v1.1.3
- Rollback time: 30 minutes
- Contact: release-team@example.com
```

---

## 6. Rollback Procedures

### Managed Solution Rollback

```powershell
# 1. List available solution versions
pac solution list

# 2. Delete current version (removes components)
pac solution delete --solution-name "AlumaCore"

# 3. Import previous version
pac solution import --path "./archive/AlumaCore_1_1_0_managed.zip"

# 4. Verify
pac solution list
```

### Data Rollback (if needed)

```powershell
# 1. Restore environment from backup
pac admin restore `
    --source-backup $backupId `
    --target $environmentId

# 2. Alternative: Restore specific tables via dataflow
# (requires pre-exported data)
```

### Rollback Checklist

- [ ] Notify stakeholders
- [ ] Document reason for rollback
- [ ] Stop any running flows
- [ ] Export current state (for post-mortem)
- [ ] Execute rollback procedure
- [ ] Verify system functionality
- [ ] Restart flows
- [ ] Monitor for 24 hours
- [ ] Schedule post-mortem

---

## 7. PAC CLI in CI/CD

### Full CI/CD Script

```bash
#!/bin/bash
set -e

ENV_URL=$1
SOLUTION_NAME=$2
MANAGED=$3

# Step 1: Authenticate
echo "Authenticating..."
pac auth create --environment "$ENV_URL" --name ci-cd

# Step 2: Export solution
echo "Exporting solution $SOLUTION_NAME..."
pac solution export \
    --name "$SOLUTION_NAME" \
    --path "./artifacts/${SOLUTION_NAME}.zip" \
    --managed "$MANAGED"

# Step 3: Check solution health
echo "Checking solution..."
pac solution check --path "./artifacts/${SOLUTION_NAME}.zip" \
    --outputDirectory "./artifacts/check"

# Step 4: Import to target (if deploy flag set)
if [ "$4" == "--deploy" ]; then
    echo "Deploying to target environment..."
    pac solution import \
        --path "./artifacts/${SOLUTION_NAME}.zip" \
        --publish-changes true \
        --convert-to-managed false
fi

echo "Done!"
```
