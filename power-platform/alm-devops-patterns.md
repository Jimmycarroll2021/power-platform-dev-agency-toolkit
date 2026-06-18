---
title: "ALM and DevOps Patterns"
description: "ALM patterns for Power Platform including branching, pipelines, and release management"
category: "devops"
tags: ["alm", "devops", "pipelines", "branching", "deployment"]
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/admin
  - https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tool-tasks
  - https://learn.microsoft.com/en-us/power-platform/alm/devops-github-actions
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

The `PowerPlatform*@2` tasks below (ToolInstaller, ExportSolution, UnpackSolution, ImportSolution) are the current Microsoft Power Platform Build Tools tasks, and `@2` is the current major version. The import-task inputs used here (`authenticationType`, `PowerPlatformSPN`, `SolutionInputFile`, `AsyncOperation`, `MaxAsyncWaitTime`, `UseDeploymentSettingsFile`, `DeploymentSettingsFile`, `OverwriteUnmanagedCustomizations`, `PublishWorkflows`) are all valid. Confirmed against [Build tool tasks](https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tool-tasks). Note: the `ConvertToManaged` import input is obsolete — importing a managed solution converts components automatically.

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

The `microsoft/powerplatform-actions/*@v1` actions used below (`actions-install`, `export-solution`, `unpack-solution`, `import-solution`) and their inputs (`environment-url`, `app-id`, `client-secret`, `tenant-id`, `solution-name`, `solution-output-file`, `managed`, `solution-file`, `solution-folder`, `solution-type`, `publish-changes`) are confirmed against the official action set. `actions-install` must run first. See [GitHub Actions for Microsoft Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/devops-github-actions).

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
# Note: --managed is a switch (no value); add it only when $Managed is true.
# Use "--include general" (value passed to --include) — there is no "--include-general" flag.
# (--autosave-settings does not exist on pac solution export and has been removed.)
$exportArgs = @(
    "--name", $SolutionName,
    "--path", $OutputPath,
    "--include", "general"
)
if ($Managed) { $exportArgs += "--managed" }
pac solution export @exportArgs

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
# Note: --publish-changes is a switch (no value). The upgrade switch is
# --stage-and-upgrade (there is no --stage-for-upgrade). There is no
# --convert-to-managed flag on pac solution import — components are converted to
# managed automatically when you import a managed solution .zip.
$importArgs = @("--path", $SolutionPath)
if ($PublishChanges)  { $importArgs += "--publish-changes" }
if ($StageForUpgrade) { $importArgs += "--stage-and-upgrade" }

pac solution import @importArgs

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

The `pac solution list`, `pac solution delete --solution-name`, and `pac solution import --path` commands below are confirmed against the [pac solution command reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution).

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
# Flags per the pac admin reference: --selected-backup takes a backup timestamp
# ('mm/dd/yyyy hh:mm') OR the string 'latest'; --source-env is the environment the
# backup was taken from; --target-env is where it is restored (defaults to source
# if omitted). There is no --source-backup or --target flag.
pac admin restore `
    --selected-backup $backupTimestamp `
    --source-env $sourceEnvironmentId `
    --target-env $targetEnvironmentId

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

All commands below are confirmed against the [pac solution command reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution). Key flag corrections: `--managed`, `--publish-changes`, and `--stage-and-upgrade` are **switches** that take no value — pass them only when the condition applies. `pac solution check --path … --outputDirectory …` is valid. There is no `--convert-to-managed` flag on `pac solution import`; managed conversion happens automatically when you import a managed solution .zip.

```bash
#!/bin/bash
set -e

ENV_URL=$1
SOLUTION_NAME=$2
MANAGED=$3   # pass "true" to export as a managed solution

# Step 1: Authenticate
echo "Authenticating..."
pac auth create --environment "$ENV_URL" --name ci-cd

# Step 2: Export solution
# --managed is a switch (no value); add it only when MANAGED=true.
echo "Exporting solution $SOLUTION_NAME..."
EXPORT_ARGS=(--name "$SOLUTION_NAME" --path "./artifacts/${SOLUTION_NAME}.zip")
if [ "$MANAGED" == "true" ]; then
    EXPORT_ARGS+=(--managed)
fi
pac solution export "${EXPORT_ARGS[@]}"

# Step 3: Check solution health
echo "Checking solution..."
pac solution check --path "./artifacts/${SOLUTION_NAME}.zip" \
    --outputDirectory "./artifacts/check"

# Step 4: Import to target (if deploy flag set)
# --publish-changes is a switch (no value); no --convert-to-managed flag exists.
if [ "$4" == "--deploy" ]; then
    echo "Deploying to target environment..."
    pac solution import \
        --path "./artifacts/${SOLUTION_NAME}.zip" \
        --publish-changes
fi

echo "Done!"
```
