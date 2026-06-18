# ALM and Solutions Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Application Lifecycle Management for Power Platform - environments, solutions, deployment pipelines, and branching strategies.
> **Needs verification against current Microsoft docs**: Pipeline features, CLI commands, and solution capabilities evolve frequently.

---

## 1. Managed vs Unmanaged Solutions

### 1.1 Core Concepts

```
SOLUTION = Container for packaging Power Platform components
           (apps, flows, tables, columns, etc.)

UNMANAGED SOLUTION:
  - Used in: Development environments ONLY
  - Can edit: Yes, all components freely
  - Deleting solution: Does NOT delete components (they stay in environment)
  - Layering: Components overwrite existing (last import wins)
  - Source control: This is your "source code"

MANAGED SOLUTION:
  - Used in: Test, UAT, Production environments
  - Can edit: NO (components are locked)
  - Deleting solution: CAN delete components (with dependencies check)
  - Layering: Components stack on top of each other
  - Source control: This is your "compiled release"

GOLDEN RULE:
  DEV  = Unmanaged (edit freely, this is your workspace)
  TEST = Managed (deploy from DEV, test thoroughly)
  PROD = Managed (promote from TEST, never edit directly)
```

### 1.2 Solution Layering

```
Managed solutions stack like layers:

Layer 4: Your Custom Solution (managed)
         Overrides any component from below
         
Layer 3: Third-Party Solution (managed)
         Provides components your solution may depend on
         
Layer 2: Base Solution (managed)
         Foundation tables, security roles
         
Layer 1: System Solution (managed - Microsoft)
         Core Dataverse components

When component exists in multiple layers:
  TOP layer wins (Layer 4 overrides Layer 3, etc.)

To see layering:
  Solution > Component > ... > See solution layers
  (Shows which solution last modified the component)
```

### 1.3 Patching

```
PATCH = Small update to existing managed solution
        (Only includes changed components)

When to use:
  - Hotfix in production
  - Small change without full redeployment
  - Bug fix between major releases

When NOT to use:
  - Major feature release (use full upgrade)
  - Adding many new components
  - Changing table structure significantly

Workflow:
  1. DEV: Make fix in unmanaged solution
  2. DEV: Export as PATCH (not full solution)
  3. PROD: Import patch on top of existing managed solution
  4. Later: Create full upgrade that includes all patches

Create patch:
  pac solution patch --version 1.0.1.0 --publisher contoso
```

---

## 2. Environment Strategy

### 2.1 Standard Environment Setup

```
MINIMUM (3 environments):
  DEV (Development)
    Type: Sandbox
    Purpose: Development, customization, testing
    Managed: No (unmanaged solutions)
    Users: Developers, admins
    Data: Test data, sample data
    Backups: Manual before major changes
    DLP: Relaxed (allow most connectors)

  TEST (UAT/QA)
    Type: Sandbox
    Purpose: User acceptance testing, QA
    Managed: Yes (managed solutions from DEV)
    Users: Testers, business users, QA
    Data: Copy of production (anonymized)
    Backups: Before each deployment
    DLP: Same as production

  PROD (Production)
    Type: Production
    Purpose: Live system
    Managed: Yes (managed solutions from TEST)
    Users: End users only
    Data: Live business data
    Backups: Automatic daily
    DLP: Strict (production policies)
    Managed Environment: Yes

RECOMMENDED (4+ environments):
  Add: POC (Proof of Concept)
    Type: Trial/Developer
    Purpose: R&D, prototyping, training
    Managed: No
    Users: Architects, senior devs
    Data: Minimal test data
    Lifespan: Can be reset/deleted
```

### 2.2 Environment Configuration

```
Settings per environment type:

DEV:
  Create: Yes (makers can create)
  Background operations: Enabled
  Audit: Minimal
  Plugins: All sandbox
  Integration: Test endpoints only

TEST:
  Create: Admin only
  Background operations: Enabled
  Audit: Full
  Plugins: Same as production
  Integration: Mirror production

PROD:
  Create: Admin only
  Background operations: Enabled
  Audit: Full (required)
  Plugins: All (real-time enabled)
  Integration: Production endpoints only
```

---

## 3. Power Platform Pipelines

### 3.1 Pipelines Overview

```
Native, low-code CI/CD built into Power Platform.

Requirements:
  - Managed Environment (premium feature)
  - Pipeline admin permissions
  - At least 2 environments (dev + target)

Pros:
  - No Azure DevOps needed
  - Visual pipeline designer
  - Integrated with Power Platform
  - Good for citizen developers

Cons:
  - Less flexible than Azure DevOps
  - Limited branching support
  - No advanced testing gates
  - Requires Managed Environments
```

### 3.2 Setting Up Pipelines

```
Step 1: Enable in host environment
  Power Platform Pipelines app
  (Install from AppSource if not visible)

Step 2: Configure deployment pipeline
  New pipeline:
    Name: Dev-to-Test-to-Prod
    Description: Standard deployment pipeline

Step 3: Link environments:
    Development environment: [Your DEV]
    Target environments:
      Stage 1: TEST (auto-deploy on save)
      Stage 2: PROD (requires approval)

Step 4: Configure stages:
    Stage 1 - TEST:
      Pre-deployment: None
      Post-deployment: None
    Stage 2 - PROD:
      Pre-deployment: Approval required
      Approvers: [Admin group]
      Post-deployment: None

Step 5: Grant access
  Pipeline users: [Developer group]
  Pipeline admins: [Admin group]
```

### 3.3 Using Pipelines

```
Developer workflow:
1. Make changes in DEV environment (unmanaged solution)
2. Save and publish
3. Open Power Platform Pipelines app
4. Select solution > Deploy
5. Select target stage (TEST)
6. Deployment runs automatically
7. Test team validates
8. Repeat 1-7 until ready
9. Deploy to PROD (requires approval)
10. Admin approves, deployment proceeds
```

---

## 4. Azure DevOps / GitHub Actions Deployment

### 4.1 Full CI/CD Pipeline (Recommended for Enterprise)

```yaml
# azure-pipelines.yml - Power Platform CI/CD
# Prerequisites:
# - Azure DevOps project
# - Service connection to Power Platform
# - Power Platform Build Tools installed

trigger:
  branches:
    include:
      - main
      - develop
      - release/*

variables:
  solutionName: 'ContosoSolution'
  devEnvironment: 'https://dev-org.crm.dynamics.com'
  testEnvironment: 'https://test-org.crm.dynamics.com'
  prodEnvironment: 'https://prod-org.crm.dynamics.com'

stages:
# Stage 1: Export from DEV and store in source control
- stage: Export
  jobs:
  - job: ExportSolution
    pool:
      vmImage: 'windows-latest'
    steps:
    - task: PowerPlatformToolInstaller@2
      
    - task: PowerPlatformExportSolution@2
      inputs:
        authenticationType: 'PowerPlatformSPN'
        PowerPlatformSPN: 'DevServiceConnection'
        Environment: '$(devEnvironment)'
        SolutionName: '$(solutionName)'
        SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solutionName).zip'
        Managed: false
        ExportAutoNumberSettings: true
        ExportRelationshipRoles: true

    - task: PublishBuildArtifacts@1
      inputs:
        pathToPublish: '$(Build.ArtifactStagingDirectory)'
        artifactName: 'unmanaged-solution'

# Stage 2: Build - Convert to managed, run solution checker
- stage: Build
  dependsOn: Export
  jobs:
  - job: BuildManaged
    steps:
    - task: DownloadBuildArtifacts@1
      inputs:
        buildType: 'current'
        downloadType: 'single'
        artifactName: 'unmanaged-solution'

    - task: PowerPlatformToolInstaller@2

    - task: PowerPlatformUnpackSolution@2
      inputs:
        SolutionInputFile: '$(System.ArtifactsDirectory)/unmanaged-solution/$(solutionName).zip'
        SolutionTargetFolder: '$(Build.SourcesDirectory)/$(solutionName)'

    # Run Solution Checker on unpacked solution
    - task: PowerPlatformChecker@2
      inputs:
        authenticationType: 'PowerPlatformSPN'
        PowerPlatformSPN: 'DevServiceConnection'
        FilesToAnalyze: '$(Build.SourcesDirectory)/$(solutionName)'
        RuleSet: '0ad12346-e108-40b8-a956-9a8f95ea18c9'  # Solution Checker

    - task: PowerPlatformPackSolution@2
      inputs:
        SolutionSourceFolder: '$(Build.SourcesDirectory)/$(solutionName)'
        SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solutionName)_managed.zip'
        Managed: true

    - task: PublishBuildArtifacts@1
      inputs:
        pathToPublish: '$(Build.ArtifactStagingDirectory)/$(solutionName)_managed.zip'
        artifactName: 'managed-solution'

# Stage 3: Deploy to TEST
- stage: Deploy_TEST
  dependsOn: Build
  condition: succeeded()
  jobs:
  - deployment: DeployToTest
    environment: 'TEST'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: PowerPlatformToolInstaller@2
          
          - task: PowerPlatformImportSolution@2
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'TestServiceConnection'
              Environment: '$(testEnvironment)'
              SolutionInputFile: '$(Pipeline.Workspace)/managed-solution/$(solutionName)_managed.zip'
              AsyncOperation: true
              MaxAsyncWaitTime: '60'
              PublishWorkflows: true

# Stage 4: Deploy to PROD (with approval)
- stage: Deploy_PROD
  dependsOn: Deploy_TEST
  condition: succeeded()
  jobs:
  - deployment: DeployToProd
    environment: 'PROD'  # Requires approval in Azure DevOps
    strategy:
      runOnce:
        deploy:
          steps:
          - task: PowerPlatformToolInstaller@2
          
          - task: PowerPlatformImportSolution@2
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'ProdServiceConnection'
              Environment: '$(prodEnvironment)'
              SolutionInputFile: '$(Pipeline.Workspace)/managed-solution/$(solutionName)_managed.zip'
              AsyncOperation: true
              MaxAsyncWaitTime: '60'
              PublishWorkflows: true
              OverwriteUnmanagedCustomizations: false
              SkipProductUpdateDependencies: false
```

### 4.2 Service Principal Setup for CI/CD

```
Step 1: Azure AD > App Registrations > New
  Name: PowerPlatform-CICD

Step 2: API Permissions > Add:
  - Dynamics CRM > user_impersonation
  - Power Platform API (as needed)

Step 3: Grant admin consent

Step 4: Create application user in Dataverse:
  Settings > Security > Users > Application users
  New:
    Application ID: (from app registration)
    Full Name: PowerPlatform CICD
    Security Role: System Administrator (for deployment)

Step 5: Create service connection in Azure DevOps:
  Project Settings > Service Connections > New
  Type: Power Platform
  Server URL: https://yourorg.crm.dynamics.com
  Tenant ID: (from Azure AD)
  Application ID: (from app registration)
  Client Secret: (from app registration)
```

---

## 5. Power Platform CLI (pac) Essentials

### 5.1 Essential Commands

```bash
# ===== AUTHENTICATION =====
# Interactive login
pac auth create --url https://yourorg.crm.dynamics.com --name MyOrg

# Service principal (for CI/CD)
pac auth create --url https://yourorg.crm.dynamics.com \
  --name CICD \
  --applicationId YOUR-APP-ID \
  --clientSecret YOUR-SECRET \
  --tenant YOUR-TENANT-ID

# List authenticated profiles
pac auth list

# Select active profile
pac auth select --index 1

# Clear all auth
pac auth clear

# ===== SOLUTION OPERATIONS =====
# Export solution (unmanaged)
pac solution export --path ./MySolution.zip --name MySolution

# Export solution (managed)
pac solution export --path ./MySolution_managed.zip --name MySolution --managed

# Import solution
pac solution import --path ./MySolution.zip --activate-plugins --force-overwrite

# Publish all customizations
pac solution publish

# List solutions
pac solution list

# Check solution version
pac solution version

# ===== SOLUTION CHECKER =====
# Run solution checker
pac solution check --path ./MySolution.zip --output ./checker-results

# ===== PACK/UNPACK =====
# Unpack (extract solution to source files)
pac solution unpack --zipfile ./MySolution.zip --folder ./src/MySolution

# Pack (compress source files to solution)
pac solution pack --folder ./src/MySolution --zipfile ./MySolution.zip

# ===== ENVIRONMENT =====
# List environments
pac admin list

# Create environment
pac admin create --name "DEV-ProjectX" --region unitedstates --type Sandbox

# Delete environment
pac admin delete --environment "https://dev-projectx.crm.dynamics.com"

# ===== DATA =====
# Export data (Configuration Migration Tool)
pac data export --schemaFile ./schema.xml --dataFile ./data.zip --environment https://yourorg.crm.dynamics.com

# Import data
pac data import --dataFile ./data.zip --environment https://yourorg.crm.dynamics.com

# ===== PCF =====
# Initialize PCF component
pac pcf init --namespace ContosoNamespace --name StarRating --template field

# Push PCF to environment
pac pcf push --publisher-prefix contoso
```

### 5.2 pac CLI in GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Power Platform Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: windows-latest
    steps:
    - uses: actions/checkout@v4

    - name: Install Power Platform CLI
      run: |
        dotnet tool install --global Microsoft.PowerApps.CLI.Tool

    - name: Auth to environment
      run: |
        pac auth create --url ${{ secrets.PP_ENV_URL }} `
          --applicationId ${{ secrets.PP_APP_ID }} `
          --clientSecret ${{ secrets.PP_CLIENT_SECRET }} `
          --tenant ${{ secrets.PP_TENANT_ID }}

    - name: Import solution
      run: |
        pac solution import --path ./solutions/MySolution_managed.zip `
          --activate-plugins --force-overwrite

    - name: Publish
      run: pac solution publish
```

---

## 6. Solution Checker

### 6.1 Running Solution Checker

```
Solution Checker validates code quality and security:

Via pac CLI:
  pac solution check --path ./MySolution.zip --output ./results

Via Power Platform:
  make.powerapps.com > Solutions > ... > Solution Checker > Run

Via Azure DevOps:
  PowerPlatformChecker@2 task (shown in pipeline example above)

Results categories:
  - Critical: Must fix before deployment
  - High: Should fix
  - Medium: Consider fixing
  - Low: Informational

Common issues:
  - JS: Use of eval() - Security risk
  - JS: InnerHTML without sanitization - XSS risk
  - Plugin: Missing exception handling
  - Plugin: Insecure deserialization
  - General: Missing descriptions
  - General: Unused variables
```

---

## 7. Environment Variables and Connection References

### 7.1 Environment Variables in ALM

```
Purpose: Store environment-specific configuration

Types:
  - Text: API URLs, connection strings
  - Number: Timeout values, thresholds
  - JSON: Complex configuration
  - Data Source: Dataverse connection references
  - Secret: Passwords (stored in Azure Key Vault)

ALM workflow:
  DEV: Create env var in unmanaged solution
       Current value: https://dev-api.example.com

  Export: Env var included in solution

  TEST: Import solution
       Default value: https://dev-api.example.com (from DEV)
       Current value: Set to https://test-api.example.com

  PROD: Import solution
       Default value: https://dev-api.example.com (from DEV)
       Current value: Set to https://api.example.com

Important: Always set the CURRENT value after importing
           to a new environment. The default value comes
           from the source environment.
```

### 7.2 Connection References in ALM

```
Purpose: Abstract connection details from flows

Setup:
  1. In solution: New > Connection Reference
     Name: cr_SHARED_DATAVERSE
     Connector: Microsoft Dataverse
     Connection: (create/select for current env)

  2. In flow: Use connection reference (not new connection)

  3. Per environment after import:
     - Connection reference needs a connection
     - System prompts to create/select connection
     - Use service account connections in production

Naming convention:
  {prefix}_SHARED_{CONNECTOR}    (shared across flows)
  {prefix}_DEDICATED_{PURPOSE}   (dedicated to specific flow)

Examples:
  cr_SHARED_DATAVERSE
  cr_SHARED_SHAREPOINT
  cr_DEDICATED_SAP_PRODUCTION
```

---

## 8. Unmanaged Container Approach

### 8.1 Pattern Description

```
The "Unmanaged Container" pattern:
  - Create a single unmanaged solution in DEV (the "container")
  - All development happens inside this container
  - Export managed from this container for deployment
  - Never have multiple unmanaged solutions with overlapping components

Why this matters:
  - If two unmanaged solutions contain the same component,
    imports become unpredictable
  - Dependencies between unmanaged solutions cause issues
  - Single container = single source of truth

Structure:
  Container Solution (unmanaged in DEV)
    +-- Tables
    +-- Forms, Views, Charts
    +-- Model-driven app
    +-- Canvas apps
    +-- Cloud flows
    +-- Connection references
    +-- Environment variables
    +-- Business rules
    +-- Security roles
    +-- Web resources
    +-- Plugins (managed assembly reference)
    +-- PCF components
```

---

## 9. Branching Strategy

### 9.1 Git Flow for Power Platform

```
Branch structure:

main                    (production releases)
  |
  +-- release/v1.2.0    (release branch, bug fixes only)
  |     |
  |     +-- hotfix/urgent-fix
  |
  +-- develop           (integration branch)
        |
        +-- feature/new-dashboard
        |
        +-- feature/api-integration
        |
        +-- feature/mobile-responsive

Workflow:
  1. Create feature branch from develop
  2. Develop in DEV environment
  3. Export solution, unpack to feature branch
  4. PR to develop (code review)
  5. Deploy develop to TEST environment
  6. QA testing on TEST
  7. Create release branch from develop
  8. Deploy release to UAT
  9. UAT sign-off
  10. Merge release to main
  11. Deploy main (managed) to PROD

Source control for unpacked solutions:
  /src
    /MySolution
      /Entities      (table definitions)
      /WebResources  (JS, CSS, HTML)
      /Workflows     (flow definitions)
      /PluginAssemblies (plugin DLLs)
      solution.xml   (solution manifest)
```

### 9.2 Commit Strategy

```
DO:
[+] Commit after each logical change
[+] Commit message: "Add case priority field and business rule"
[+] Include solution.xml changes (shows version bump)
[+] Tag releases: git tag v1.2.0
[+] Keep feature branches short-lived (< 1 week)

DO NOT:
[X] Commit unpacked files with no meaningful change
[X] Mix feature changes in same commit
[X] Long-running feature branches (> 2 weeks)
[X] Commit without testing in DEV first
```

---

## 10. Release Management

### 10.1 Release Process

```
Phase 1: Planning (1 week before)
  [ ] Feature freeze
  [ ] Create release branch
  [ ] Export managed solution
  [ ] Run solution checker
  [ ] Update version number (semantic: MAJOR.MINOR.PATCH)
  [ ] Draft release notes

Phase 2: Testing
  [ ] Deploy to TEST environment
  [ ] Regression testing
  [ ] Performance testing
  [ ] Security review
  [ ] User acceptance testing

Phase 3: Preparation
  [ ] Deploy to UAT environment
  [ ] Business sign-off
  [ ] Update documentation
  [ ] Prepare rollback plan
  [ ] Schedule deployment window

Phase 4: Deployment
  [ ] Notify stakeholders
  [ ] Export final managed solution
  [ ] Backup PROD environment
  [ ] Import to PROD
  [ ] Verify deployment
  [ ] Smoke tests
  [ ] Monitor for issues (2 hours)

Phase 5: Post-Deployment
  [ ] Update release notes
  [ ] Merge release branch to main
  [ ] Tag release in Git
  [ ] Monitor for 48 hours
  [ ] Retro meeting (what went well/what didn't)
```

### 10.2 Version Numbering

```
Semantic versioning for solutions:
  Format: MAJOR.MINOR.PATCH.BUILD
  Example: 1.2.3.0

  MAJOR: Breaking changes, new major features
  MINOR: New features, backward compatible
  PATCH: Bug fixes only
  BUILD: Auto-incremented in CI/CD

Version update rules:
  New feature release: 1.2.0 -> 1.3.0
  Bug fix release:     1.2.3 -> 1.2.4
  Major rewrite:       1.2.0 -> 2.0.0
```

---

## 11. Rollback Procedures

### 11.1 Managed Solution Rollback

```
Method 1: Version rollback (if previous version exists)
  1. Export previous managed version from source control
  2. Import previous version with "Overwrite customizations"
  3. Publish all customizations

Method 2: Uninstall and reinstall
  1. Settings > Solutions
  2. Delete current managed solution
     (Check dependencies first - may need to remove dependent components)
  3. Import previous managed version
  4. Verify data integrity

Method 3: Environment restore (nuclear option)
  1. Power Platform Admin Center
  2. Environment > Backups
  3. Restore from pre-deployment backup
  4. CAUTION: All changes since backup are lost
```

### 11.2 Rollback Checklist

```
[ ] Identify severity (critical/high/medium)
[ ] Notify stakeholders immediately
[ ] Decision: Rollback or hotfix?
[ ] If rollback:
    [ ] Stop all flows
    [ ] Export current state (for analysis)
    [ ] Import previous version
    [ ] Verify component status
    [ ] Restart flows
    [ ] Test critical paths
    [ ] Monitor for 4 hours
[ ] Document root cause
[ ] Schedule post-mortem
```

---

*End of ALM Guide. Verify all CLI commands and pipeline features against current Microsoft documentation.*
