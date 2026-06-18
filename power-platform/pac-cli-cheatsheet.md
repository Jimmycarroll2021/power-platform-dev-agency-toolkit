---
title: "PAC CLI Cheatsheet"
description: "Complete Power Platform CLI reference for developers"
category: "reference"
tags: ["pac", "cli", "cheatsheet", "power-platform"]
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/developer/howto/install-cli-net-tool
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/auth
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/canvas
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/application
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/data
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/package
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/admin
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/telemetry
---

# PAC CLI Cheatsheet

> Verified against Microsoft Learn on 2026-06-19 (platform state 2026-H1). Flag names and
> command groups follow the official `pac` command reference; see the per-section citations.

## Installation

The .NET tool package is **`Microsoft.PowerApps.CLI.Tool`** (the `.Tool` suffix is required).
PAC CLI 2.x requires .NET 10; PAC CLI 1.x requires .NET 9. ([Install with .NET Tool](https://learn.microsoft.com/en-us/power-platform/developer/howto/install-cli-net-tool))

```bash
# Install via dotnet tool
dotnet tool install --global Microsoft.PowerApps.CLI.Tool

# Update to latest
dotnet tool update --global Microsoft.PowerApps.CLI.Tool

# Uninstall
dotnet tool uninstall --global Microsoft.PowerApps.CLI.Tool

# Verify installation
pac --version
```

Windows users can alternatively install via the MSI / Power Platform Tools VS Code extension.
For CI/CD without a permanent install, use `dnx Microsoft.PowerApps.CLI.Tool --yes <command>`
(requires .NET 10+). ([Install with .NET Tool](https://learn.microsoft.com/en-us/power-platform/developer/howto/install-cli-net-tool))

## Authentication

All flags below are confirmed against the [auth command group reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/auth).

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

# Select an active profile (by index from `pac auth list`)
pac auth select --index <index>

# Delete a profile
pac auth delete --index <index>

# Clear all profiles
pac auth clear
```

> Note: in headless / no-browser contexts (e.g. WSL2, Codespaces, CI), add `--deviceCode`
> to `pac auth create` for device-code sign-in. The `--url` flag is deprecated — use
> `--environment` instead. ([auth reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/auth))

## Solution Commands

Flags confirmed against the [solution command group reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution).

```bash
# Initialize a solution project
pac solution init --publisher-name <name> --publisher-prefix <prefix>

# Add a reference (from the project in the current directory to the project at <path>)
pac solution add-reference --path <path-to-project>

# Sync the current solution project to the latest state in your org
# (run from inside the project folder; no --solution-name flag)
pac solution sync

# Clone a solution (export + unpack into a cdsproj project)
# NOTE: the flag is --name, not --solution-name
pac solution clone --name <solution-name> --outputDirectory <dir>

# Export solution (--managed is a switch — present = managed, omit = unmanaged)
pac solution export --path <output-zip> --name <solution-name> --managed

# Import solution (--publish-changes is a switch, no value)
pac solution import --path <solution-zip> --publish-changes

# Pack solution (source to zip)
pac solution pack --zipfile <output.zip> --folder <source-folder>

# Unpack solution (zip to source)
pac solution unpack --zipfile <input.zip> --folder <output-folder>

# Check solution against the Power Apps Checker service
pac solution check --path <solution-zip> --outputDirectory <dir>

# Version a solution (build/revision)
pac solution version --buildversion <version>

# List solutions in environment
pac solution list

# Create a deployment settings file (connection refs + environment variables)
# This lives under `solution`, NOT `package`.
pac solution create-settings --solution-zip <solution.zip> --settings-file <settings.json>
```

> `--managed` and `--publish-changes` are **switches** — they take no `true`/`false` value.
> Presence of `--managed` exports a managed solution; omit it for unmanaged. ([solution reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution))

## Canvas App Commands (`pac canvas`)

Canvas-app `.msapp` pack/unpack live under the **`pac canvas`** command group, not `pac application`.
The `pack`/`unpack` commands are flagged **(Preview)** and are deprecated in favour of
[Power Platform Git integration for canvas apps](https://learn.microsoft.com/en-us/power-platform/alm/git-integration/canvas-apps-git-integration);
`pac canvas create` is GA. ([canvas reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/canvas))

```bash
# Unpack canvas app (msapp to source) — Preview
pac canvas unpack --msapp <input.msapp> --sources <folder>

# Pack canvas app (source to msapp) — Preview
pac canvas pack --sources <folder> --msapp <output.msapp>

# Download a canvas app as an .msapp file (GA)
pac canvas download --name <app-name-or-id> --file-name <output.msapp>

# List canvas apps in the environment
pac canvas list
```

> The earlier `pac application pack`/`pac application unpack` commands no longer exist; the
> `pac application` group now only covers Marketplace app `install`/`list` (see below).

## Application (Dataverse Marketplace) Commands

The `pac application` group manages Dataverse applications from Microsoft Marketplace —
it does **not** pack canvas apps. ([application reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/application))

```bash
# List available Dataverse applications
pac application list --environment <env-id-or-url>

# Install (or update) a Dataverse application
pac application install --environment <env-id-or-url> --application-name <unique-name>
```

## Data (Dataverse) Commands

The `data` group is for configuration data (not large volumes) and uses the Configuration
Migration tooling; it is only available in the .NET Full Framework build of the CLI.
Flags confirmed against the [data command group reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/data).

```bash
# Export data (--schemaFile is required; --dataFile defaults to data.zip)
pac data export --schemaFile <schema.xml> --dataFile <data.zip> \
  --environment <url>

# Import data (--data points at the zip file or directory; --schemaFile is NOT used here,
# and the old --dataDirectory flag is deprecated/ignored)
pac data import --data <data.zip-or-dir> --environment <url>

# Bulk-delete records matching a FetchXML filter (replaces the old `pac data delete`)
pac data bulk-delete schedule --entity <table-name> --fetchxml <fetch-xml-filter>
```

> There is no `pac data list`, `pac data create-table`, or `pac data delete` command in the
> current CLI. To delete records, use `pac data bulk-delete schedule`; to manage retention,
> use the `pac data retention *` subcommands. Create tables via `pac solution`/the maker
> portal or the Dataverse Web API, not `pac data`. ([data reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/data))

## Package (Package Deployer) Commands

Flags confirmed against the [package command group reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/package).
`pac package deploy`/`pac package show` are only available in the .NET Full Framework build.

```bash
# Deploy a Package Deployer package
pac package deploy --package <package.dll-or-zip> --environment <url>

# Show details of a package
pac package show <package.dll>
```

> There is no `pac package create-settings` command. To generate a deployment settings file,
> use `pac solution create-settings` (shown in the Solution Commands section above). ([package reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/package))

## Admin Commands

Flags confirmed against the [admin command group reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/admin).

```bash
# List environments
pac admin list

# Create environment (--type is required; valid values:
#   Trial | Sandbox | Production | Developer | Teams | SubscriptionBasedTrial)
pac admin create --name <name> --region <region> --type <type> --domain <domain>

# Delete environment
pac admin delete --environment <id-or-url>

# Backup environment (--label is required)
pac admin backup --environment <id-or-url> --label <label>

# Copy environment (use --source-env / --target-env; --type is MinimalCopy or FullCopy)
pac admin copy --source-env <id> --target-env <id> --type <MinimalCopy|FullCopy>

# Restore environment (--selected-backup is required: a timestamp or the literal 'latest')
pac admin restore --selected-backup <latest|'mm/dd/yyyy hh:mm'> \
  --source-env <id> --target-env <id>

# List backups (the command is `list-backups`, not `backup list`)
pac admin list-backups --environment <id-or-url>
```

> Watch the flag names: copy/restore use `--source-env`/`--target-env` (not `--source`/`--target`),
> copy `--type` values are `MinimalCopy`/`FullCopy` (not `Minimal`/`Full`), restore uses
> `--selected-backup` (not `--source-backup`), and the backup-listing command is
> `pac admin list-backups`. ([admin reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/admin))

## Canvas Pack/Unpack Workflow

Uses the `pac canvas` group (see Canvas App Commands above). These pack/unpack commands are
Preview and deprecated in favour of [Git integration for canvas apps](https://learn.microsoft.com/en-us/power-platform/alm/git-integration/canvas-apps-git-integration).

```bash
# Unpack an existing canvas app
pac canvas unpack --msapp "App.msapp" --sources "./src/App"

# ... make changes to source files ...

# Pack back to msapp
pac canvas pack --sources "./src/App" --msapp "App.msapp"

# Add the project to a solution if needed
pac solution add-reference --path "./src/App"
```

## ALM Workflow with PAC CLI

```bash
# 1. Auth to dev environment
pac auth create --environment "https://org.crm.dynamics.com"

# 2. Clone solution from dev (note: --name, not --solution-name)
pac solution clone --name "MySolution" --outputDirectory "./solutions/MySolution"

# 3. Commit changes
git add .
git commit -m "Update solution"

# 4. Pack solution for deployment
pac solution pack --zipfile "./artifacts/MySolution.zip" --folder "./solutions/MySolution"

# 5. Auth to target environment
pac auth select --index 1

# 6. Import to target (--publish-changes is a switch)
pac solution import --path "./artifacts/MySolution.zip" --publish-changes
```

## Telemetry / Configuration

The legacy `PAC_CLI_AUTH_PROFILE` and `PAC_CLI_TELEMETRY` environment variables are not
documented in the current CLI. Select the active profile with `pac auth select --index`, and
manage telemetry as below. ([telemetry reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/telemetry))

```bash
# Opt out of telemetry for all of PAC CLI (set to 1 or true)
export PP_TOOLS_TELEMETRY_OPTOUT=1

# Or manage telemetry interactively
pac telemetry disable
pac telemetry status

# For the `gittags` solution-version strategy, supply a PAT via this env var:
export PacCli.PAT=<personal-access-token>
```

## Quick Reference Table

| Task | Command |
|------|---------|
| Auth | `pac auth create --environment <url>` |
| Select profile | `pac auth select --index <n>` |
| List solutions | `pac solution list` |
| Export managed | `pac solution export --name <n> --managed` |
| Export unmanaged | `pac solution export --name <n>` (omit `--managed`) |
| Import | `pac solution import --path <zip> --publish-changes` |
| Clone | `pac solution clone --name <n> --outputDirectory <d>` |
| Deployment settings | `pac solution create-settings --solution-zip <z> --settings-file <j>` |
| Unpack canvas | `pac canvas unpack --msapp <f> --sources <d>` |
| Pack canvas | `pac canvas pack --sources <d> --msapp <f>` |
| Export data | `pac data export --schemaFile <s> --dataFile <z>` |
| Import data | `pac data import --data <z>` |
| Deploy package | `pac package deploy --package <z>` |
| List envs | `pac admin list` |
| Create env | `pac admin create --name <n> --type Sandbox` |
| Copy env | `pac admin copy --source-env <s> --target-env <t> --type FullCopy` |
| List backups | `pac admin list-backups --environment <id>` |
