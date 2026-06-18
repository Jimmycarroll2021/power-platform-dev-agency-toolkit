#!/usr/bin/env tsx
/**
 * check-required-files.ts
 *
 * Verifies the repository structure matches the specification.
 *
 * Usage:
 *   tsx scripts/check-required-files.ts [--verbose]
 *
 * Checks:
 * - All required files from SPEC exist
 * - File sizes are reasonable (> 0 bytes)
 * - Directory structure matches spec
 * - Outputs report with missing files
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ── Configuration ────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, "..");

interface FileSpec {
  path: string;
  minSize?: number;
  required: boolean;
}

interface DirSpec {
  path: string;
  required: boolean;
  minFiles?: number;
}

// ── Specification ────────────────────────────────────────────────────────────

const REQUIRED_DIRS: DirSpec[] = [
  { path: "scripts", required: true, minFiles: 5 },
  { path: ".github/workflows", required: true, minFiles: 3 },
  { path: ".github/ISSUE_TEMPLATE", required: true, minFiles: 3 },
  { path: "power-platform", required: true, minFiles: 10 },
  { path: "mcp", required: true, minFiles: 2 },
  { path: "docs", required: false },
  { path: "agents", required: false },
  { path: "projects", required: false },
  { path: "templates", required: false },
];

const REQUIRED_FILES: FileSpec[] = [
  // Scripts
  { path: "scripts/validate-docs.ts", required: true, minSize: 100 },
  { path: "scripts/generate-project.ts", required: true, minSize: 100 },
  { path: "scripts/create-agent-brief.ts", required: true, minSize: 100 },
  { path: "scripts/check-required-files.ts", required: true, minSize: 100 },
  { path: "scripts/estimate-credits.ts", required: true, minSize: 100 },

  // GitHub workflows
  { path: ".github/workflows/lint.yml", required: true },
  { path: ".github/workflows/docs-check.yml", required: true },
  { path: ".github/workflows/repo-health.yml", required: true },

  // GitHub issue templates
  { path: ".github/ISSUE_TEMPLATE/client-project.md", required: true },
  { path: ".github/ISSUE_TEMPLATE/bug_report.md", required: true },
  { path: ".github/ISSUE_TEMPLATE/feature_request.md", required: true },

  // GitHub PR template
  { path: ".github/PULL_REQUEST_TEMPLATE.md", required: true },

  // Power Platform guides
  { path: "power-platform/pac-cli-cheatsheet.md", required: true, minSize: 200 },
  { path: "power-platform/solution-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/environment-strategy.md", required: true, minSize: 200 },
  { path: "power-platform/connection-references.md", required: true, minSize: 200 },
  { path: "power-platform/environment-variables.md", required: true, minSize: 200 },
  { path: "power-platform/dataverse-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/power-automate-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/desktop-flow-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/power-apps-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/pcf-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/custom-connectors-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/ai-builder-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/copilot-studio-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/power-pages-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/alm-devops-patterns.md", required: true, minSize: 200 },
  { path: "power-platform/monitoring-and-telemetry.md", required: true, minSize: 200 },

  // MCP guides
  { path: "mcp/copilot-studio-mcp-notes.md", required: true, minSize: 100 },
  { path: "mcp/agent-tooling-patterns.md", required: true, minSize: 100 },
  { path: "mcp/mcp-server-evaluation-template.md", required: true, minSize: 100 },
  { path: "mcp/external-agent-integration-template.md", required: true, minSize: 100 },

  // Root files
  { path: "README.md", required: false },
  { path: "LICENSE", required: false },
  { path: "CONTRIBUTING.md", required: false },
  { path: ".gitignore", required: true },
  { path: "package.json", required: true },
  { path: "tsconfig.json", required: true },
];

// ── Validation ───────────────────────────────────────────────────────────────

interface CheckResult {
  path: string;
  exists: boolean;
  size?: number;
  minSize?: number;
  errors: string[];
}

function checkFile(spec: FileSpec): CheckResult {
  const fullPath = path.join(REPO_ROOT, spec.path);
  const result: CheckResult = {
    path: spec.path,
    exists: false,
    errors: [],
  };

  if (fs.existsSync(fullPath)) {
    result.exists = true;
    const stat = fs.statSync(fullPath);
    result.size = stat.size;

    if (spec.minSize && stat.size < spec.minSize) {
      result.errors.push(
        `File too small: ${stat.size} bytes (min: ${spec.minSize})`
      );
    }
  } else {
    result.errors.push("File not found");
  }

  return result;
}

function checkDir(spec: DirSpec): CheckResult {
  const fullPath = path.join(REPO_ROOT, spec.path);
  const result: CheckResult = {
    path: spec.path,
    exists: false,
    errors: [],
  };

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    result.exists = true;
    const files = fs.readdirSync(fullPath);
    result.size = files.length;

    if (spec.minFiles && files.length < spec.minFiles) {
      result.errors.push(
        `Too few files: ${files.length} (min: ${spec.minFiles})`
      );
    }
  } else {
    result.errors.push("Directory not found");
  }

  return result;
}

// ── Report ───────────────────────────────────────────────────────────────────

function printReport(
  dirResults: CheckResult[],
  fileResults: CheckResult[],
  verbose: boolean
): number {
  let totalErrors = 0;
  let missingCritical = 0;

  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║           REPOSITORY STRUCTURE CHECK REPORT                      ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝");
  console.log();

  console.log("📁 DIRECTORIES:");
  console.log("───────────────────────────────────────────────────────────────────");
  for (const result of dirResults) {
    const marker = result.exists && result.errors.length === 0 ? "✅" : "❌";
    if (!result.exists || result.errors.length > 0) {
      totalErrors += result.errors.length;
      if (REQUIRED_DIRS.find((d) => d.path === result.path)?.required) {
        missingCritical++;
      }
    }
    console.log(`${marker} ${result.path}${result.size !== undefined ? ` (${result.size} items)` : ""}`);
    if (verbose) {
      for (const err of result.errors) {
        console.log(`   - ${err}`);
      }
    }
  }

  console.log();
  console.log("📄 FILES:");
  console.log("───────────────────────────────────────────────────────────────────");
  for (const result of fileResults) {
    const isRequired = REQUIRED_FILES.find((f) => f.path === result.path)?.required;
    const hasErrors = !result.exists || result.errors.length > 0;

    if (hasErrors) {
      totalErrors += result.errors.length;
      if (isRequired) missingCritical++;
    }

    const marker = !hasErrors ? "✅" : isRequired ? "❌" : "⚠️";
    const sizeStr = result.size !== undefined ? ` (${result.size} bytes)` : "";

    console.log(`${marker} ${result.path}${sizeStr}`);
    if (verbose || hasErrors) {
      for (const err of result.errors) {
        console.log(`   - ${err}`);
      }
    }
  }

  console.log();
  console.log("───────────────────────────────────────────────────────────────────");
  console.log(`  Total errors: ${totalErrors}`);
  console.log(`  Critical missing: ${missingCritical}`);
  console.log("───────────────────────────────────────────────────────────────────");

  if (missingCritical > 0) {
    console.log("\n❌ STRUCTURE CHECK FAILED\n");
    return 1;
  }

  console.log("\n✅ STRUCTURE CHECK PASSED\n");
  return 0;
}

// ── Entry Point ──────────────────────────────────────────────────────────────

function main(): void {
  const verbose = process.argv.includes("--verbose");

  const dirResults = REQUIRED_DIRS.map(checkDir);
  const fileResults = REQUIRED_FILES.map(checkFile);

  const exitCode = printReport(dirResults, fileResults, verbose);

  // Print file counts per directory
  console.log("📊 FILE COUNTS PER DIRECTORY:");
  console.log("───────────────────────────────────────────────────────────────────");
  for (const dir of REQUIRED_DIRS) {
    const fullPath = path.join(REPO_ROOT, dir.path);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      const count = fs.readdirSync(fullPath).length;
      console.log(`  ${dir.path}: ${count} files`);
    }
  }
  console.log();

  process.exit(exitCode);
}

if (require.main === module) {
  main();
}

export { checkFile, checkDir };
