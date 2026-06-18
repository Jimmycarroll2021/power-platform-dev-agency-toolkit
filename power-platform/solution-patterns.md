---
title: "Solution Architecture Patterns"
description: "Patterns for organizing and managing Power Platform solutions"
category: "architecture"
tags: ["solutions", "alm", "patterns", "architecture"]
---

# Solution Architecture Patterns

## 1. Unmanaged Container Pattern

Use one unmanaged solution per developer as their working container.

```
DEV Environment:
  - Solution: Aluma_Dev_John (unmanaged) - John's work area
  - Solution: Aluma_Dev_Jane (unmanaged) - Jane's work area
  - Solution: Aluma_Core (managed) - Shared baseline
```

### When to Use
- Multiple developers working in the same environment
- Need isolation between developer work streams
- Prepare for automated export and source control

### How to Implement
1. Create one unmanaged solution per developer
2. Use a consistent naming convention: `<Prefix>_Dev_<Name>`
3. Add only components the developer is working on
4. Export as unmanaged, unpack, commit to git
5. Build server packs and deploys managed solution

### Commands
```bash
# Developer creates their solution
pac solution init --publisher-name Aluma --publisher-prefix alu

# Add components via maker portal or PAC CLI
pac solution add-reference --path "./CanvasApp"

# Export and unpack
pac solution export --name "Aluma_Dev_John" --path "./export.zip" --managed false
pac solution unpack --zipfile "./export.zip" --folder "./solutions/dev-john"
```

---

## 2. Solution Layering

Control deployment order through solution layering.

```
Layer 4 (Top): Feature Solutions (managed)
Layer 3: Integration Solutions (managed)
Layer 2: Core Business Solutions (managed)
Layer 1 (Bottom): Foundation / Base Solutions (managed)
```

### Rules
- Higher layers depend on lower layers
- Never reference up (only down)
- Each layer should have a clear responsibility

### Layer Responsibilities

| Layer | Responsibility | Example |
|-------|---------------|---------|
| Foundation | Tables, columns, security roles | Data model |
| Core | Business logic, rules, flows | Case management |
| Integration | External connectors, APIs | ERP sync |
| Feature | UI components, specific features | Dashboard pack |

---

## 3. Patch Management

Use patches for small, incremental updates.

```bash
# Create a patch from existing solution
pac solution clone --solution-name "MySolution" --patch-version "1.0.1.0"

# Patches can only include components from parent solution
# Patches are merged during upgrade
```

### Patch vs Upgrade Decision Tree

```
Is the change small (< 10 components)?
  Yes --> Use Patch
  No  --> Is there a schema change?
          Yes --> Use Upgrade (Stage for Upgrade)
          No  --> Use Patch
```

### Stage for Upgrade Workflow
1. Export new version as managed
2. Import with "Stage for Upgrade" option
3. Apply upgrade when ready
4. Patches are automatically merged

```bash
# Import with stage for upgrade
pac solution import --path "MySolution_1_1_0_0_managed.zip" --stage-for-upgrade true

# Apply upgrade later
# Use maker portal or PAC CLI
pac solution upgrade --solution-name "MySolution"
```

---

## 4. Dependency Handling

### Identifying Dependencies

```bash
# Show solution dependencies
pac solution list --include-dependencies

# Check for missing dependencies before import
pac solution check --path "solution.zip"
```

### Dependency Resolution Order

1. Foundation tables and columns first
2. Security roles and teams
3. Business rules and workflows
4. Apps and flows
5. Reports and dashboards

### Breaking Dependency Changes

Never:
- Delete a table referenced by another solution
- Rename a column used in a flow
- Remove an option from a choice column used in business rules

Always:
- Use solution layers to manage ownership
- Document external dependencies
- Test in a separate environment before production

---

## 5. Solution Export/Import Workflows

### Development Workflow

```bash
# 1. Ensure all components are in the correct solution
#    (Use maker portal to verify)

# 2. Export unmanaged from dev
pac solution export --name "MySolution" \
  --path "./artifacts/MySolution.zip" \
  --managed false

# 3. Unpack to source control
pac solution unpack --zipfile "./artifacts/MySolution.zip" \
  --folder "./solutions/MySolution"

# 4. Commit to git
git add .
git commit -m "Export MySolution from dev"
```

### Build/Deploy Workflow

```bash
# 1. Pack from source
pac solution pack --zipfile "./deploy/MySolution_managed.zip" \
  --folder "./solutions/MySolution"

# 2. Import to test
pac auth select --index <test-profile>
pac solution import --path "./deploy/MySolution_managed.zip" \
  --publish-changes true

# 3. Import to production (after UAT approval)
pac auth select --index <prod-profile>
pac solution import --path "./deploy/MySolution_managed.zip" \
  --publish-changes true
```

---

## 6. Component Ownership Strategy

| Component Type | Owner Solution | Notes |
|----------------|---------------|-------|
| Tables/Columns | Foundation | Shared data model |
| Choice Columns | Foundation | Centralized picklist values |
| Security Roles | Foundation | Core permissions |
| Cloud Flows | Feature | Context-specific automation |
| Canvas Apps | Feature | User-facing apps |
| Model Apps | Feature | Business applications |
| Connection References | Integration | Reusable across features |
| Environment Variables | Any | Context-specific values |

---

## 7. Solution Versioning Convention

Use semantic versioning: `Major.Minor.Build.Revision`

| Segment | When to Increment | Example |
|---------|------------------|---------|
| Major | Breaking schema change | 2.0.0.0 |
| Minor | New feature, no breaking changes | 1.1.0.0 |
| Build | Bug fix, patch | 1.0.1.0 |
| Revision | Build server ID | 1.0.0.1234 |
