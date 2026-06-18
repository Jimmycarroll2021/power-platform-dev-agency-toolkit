# Deployment Guide

This repo is configured for easy deployment and release from GitHub.

## Repository

<https://github.com/Jimmycarroll2021/power-platform-dev-agency-toolkit>

## One-time setup

### 1. Clone

```bash
git clone git@github.com:Jimmycarroll2021/power-platform-dev-agency-toolkit.git
cd power-platform-dev-agency-toolkit
```

### 2. Install and verify

```bash
npm install
npm run verify
```

This runs typecheck, lint, build, tests, and docs validation.

### 3. Link the CLI globally (optional)

```bash
npm link -w packages/cli
pp-agency --version
```

## Deploying the CLI from npm

The `@power-platform-agency/cli` package is published automatically on every
GitHub release.

```bash
npm install -g @power-platform-agency/cli
pp-agency --help
```

## Creating a release

### Option A: Push a version tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

GitHub Actions will:

1. Run the full `npm run verify` gate.
2. Build and package the CLI.
3. Create a GitHub Release with the packaged `.tgz`.
4. Publish `@power-platform-agency/cli` to npm.

### Option B: Manual release workflow

1. Go to **Actions > Release** in the GitHub repo.
2. Click **Run workflow**.
3. Enter the version and start the workflow.

## Required secrets

| Secret | Purpose | Where to set |
|---|---|---|
| `NPM_TOKEN` | Publish `@power-platform-agency/cli` to npm | GitHub repo **Settings > Secrets and variables > Actions** |

Generate an npm token at <https://www.npmjs.com/settings/tokens> with
**Publish** scope.

## CI/CD pipelines

| Workflow | Triggers | What it does |
|---|---|---|
| `.github/workflows/lint.yml` | Push/PR to `main`, `develop` | Full `npm run verify` gate on Node 18/20/22 |
| `.github/workflows/docs-check.yml` | Push/PR to `main`, `develop` when `**.md` changes | Build + docs/structure validation |
| `.github/workflows/repo-health.yml` | Weekly + manual | Structure check + docs validation + stale-file report |
| `.github/workflows/release.yml` | Version tag push or manual | Build, package, release, publish to npm |

## Pre-requisites for users

- Node.js >= 18
- npm >= 9
- For `solution`/`env` commands: Microsoft Power Platform CLI (`pac`) installed
  and authenticated. Install from
  <https://learn.microsoft.com/power-platform/developer/cli/intro>.

## Smoke test after deploy

```bash
pp-agency --version
pp-agency checklist --type deployment -o /tmp/deploy-checklist.md
pp-agency solution --help
pp-agency env --help
```

## Rollback

To revert a published release:

1. Delete the GitHub Release.
2. Run `npm unpublish @power-platform-agency/cli@<version>` within 72 hours of
   publication (npm policy).
