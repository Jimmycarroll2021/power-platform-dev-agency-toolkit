---
title: "PAC CLI Cheatsheet"
description: "Complete Power Platform CLI reference for developers"
category: "reference"
tags: ["pac", "cli", "cheatsheet", "power-platform"]
---

# PAC CLI Cheatsheet

## Installation

```bash
# Install via dotnet tool
dotnet tool install --global Microsoft.PowerApps.CLI

# Update to latest
dotnet tool update --global Microsoft.PowerApps.CLI

# Verify installation
pac --version
```

## Authentication

```bash
# List authentication profiles
pac auth list

# Create authentication profile (interactive)
pac auth create --environment <environment-url>

# Create with username/password (non-interactive)
pac auth create --name "MyProfile" --username <email> --password <pass> --environment <url>

# Create with Service Principal
pac auth create --name "SP-Profile" --applicationId <app-id> \
  --clientSecret <secret> --tenant <tenant-id> --environment <url>

# Select an active profile
pac auth select --index <index>

# Delete a profile
pac auth delete --index <index>

# Clear all profiles
pac auth clear
```

## Solution Commands

```bash
# Initialize a solution project
pac solution init --publisher-name <name> --publisher-prefix <prefix>

# Add a reference to a Power Apps project
pac solution add-reference --path <path-to-canvas-app>

# Sync solution from environment (unpack)
pac solution sync --solution-name <name>

# Clone a solution (export and unpack)
pac solution clone --solution-name <name> --outputDirectory <dir>

# Export solution
pac solution export --path <output-zip> --name <solution-name> --managed true

# Import solution
pac solution import --path <solution-zip> --publish-changes true

# Pack solution (source to zip)
pac solution pack --zipfile <output.zip> --folder <source-folder>

# Unpack solution (zip to source)
pac solution unpack --zipfile <input.zip> --folder <output-folder>

# Check solution for issues
pac solution check --path <solution-zip> --outputDirectory <dir>

# Version solution
pac solution version --buildversion <version>

# List solutions in environment
pac solution list
```

## Application (Canvas App) Commands

```bash
# Pack canvas app (source to msapp)
pac application pack --sources <folder> --msapp <output.msapp>

# Unpack canvas app (msapp to source)
pac application unpack --msapp <input.msapp> --sources <folder>
```

## Data (Dataverse) Commands

```bash
# List tables
pac data list --entity <table-name>

# Export data
pac data export --schemaFile <schema.xml> --dataFile <data.zip> \
  --environment <url>

# Import data
pac data import --dataDirectory <dir> --schemaFile <schema.xml>

# Create table
pac data create-table --name <name> --displayName <display> \
  --primary-column-name <col> --primary-column-display-name <col-display>

# Delete records
pac data delete --entity <table-name> --filter <fetch-xml-filter>
```

## Pipeline Commands

```bash
# Deploy package
pac package deploy --package <zip-file>

# Create deployment settings
pac package create-settings --package <zip> --settings <output-json>
```

## Admin Commands

```bash
# List environments
pac admin list

# Create environment
pac admin create --name <name> --region <region> --type <Trial|Sandbox|Production>

# Delete environment
pac admin delete --environment <id>

# Backup environment
pac admin backup --environment <id> --label <label>

# Copy environment
pac admin copy --source <id> --target <id> --type <Minimal|Full>

# Restore environment
pac admin restore --source-backup <id> --target <id>

# List backup
pac admin backup list --environment <id>
```

## Canvas Pack/Unpack Workflow

```bash
# Unpack an existing canvas app
pac application unpack --msapp "App.msapp" --sources "./src/App"

# ... make changes to source files ...

# Pack back to msapp
pac application pack --sources "./src/App" --msapp "App.msapp"

# Add to solution if needed
pac solution add-reference --path "./src/App"
```

## ALM Workflow with PAC CLI

```bash
# 1. Auth to dev environment
pac auth create --environment "https://org.crm.dynamics.com"

# 2. Clone solution from dev
pac solution clone --solution-name "MySolution" --outputDirectory "./solutions/MySolution"

# 3. Commit changes
git add .
git commit -m "Update solution"

# 4. Pack solution for deployment
pac solution pack --zipfile "./artifacts/MySolution.zip" --folder "./solutions/MySolution"

# 5. Auth to target environment
pac auth select --index 1

# 6. Import to target
pac solution import --path "./artifacts/MySolution.zip" --publish-changes true
```

## Useful Environment Variables

```bash
# Set default auth profile
export PAC_CLI_AUTH_PROFILE=0

# Disable telemetry
export PAC_CLI_TELEMETRY=false
```

## Quick Reference Table

| Task | Command |
|------|---------|
| Auth | `pac auth create --environment <url>` |
| List solutions | `pac solution list` |
| Export managed | `pac solution export --name <n> --managed true` |
| Export unmanaged | `pac solution export --name <n> --managed false` |
| Import | `pac solution import --path <zip>` |
| Clone | `pac solution clone --solution-name <n>` |
| Unpack canvas | `pac application unpack --msapp <f> --sources <d>` |
| Pack canvas | `pac application pack --sources <d> --msapp <f>` |
| List envs | `pac admin list` |
| Create env | `pac admin create --name <n> --type Sandbox` |
