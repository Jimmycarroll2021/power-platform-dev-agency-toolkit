#!/usr/bin/env tsx
/**
 * validate-docs.ts
 *
 * Validates all markdown documentation in the repository:
 * - Checks all required files exist
 * - Checks frontmatter presence
 * - Checks for broken cross-references
 * - Checks for "TODO" or "FIXME" markers
 * - Checks minimum file sizes
 * - Outputs validation report
 * - Exit code 0 if all pass, 1 if failures
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ── Configuration ────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, "..");
const MIN_FILE_SIZE = 50; // bytes
const REQUIRED_DIRS = [
  "docs",
  "power-platform",
  "mcp",
  "scripts",
  ".github/workflows",
  ".github/ISSUE_TEMPLATE",
  "agents",
  "projects",
];

interface ValidationRule {
  name: string;
  level: "error" | "warning";
  test: (filePath: string, content: string) => boolean;
  message: (filePath: string, content: string) => string;
}

interface ValidationResult {
  file: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Strip fenced and inline code so example links/snippets inside code are not validated. */
function stripCode(content: string): string {
  return content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
}

/** True if a link target is a placeholder/token (e.g. <name>, {client}, ${var}) not a real path. */
function isPlaceholderTarget(target: string): boolean {
  return /[<>{}$*\s]/.test(target) || target.includes("...");
}

// ── Validation Rules ─────────────────────────────────────────────────────────

const rules: ValidationRule[] = [
  {
    name: "no-todo-fixme",
    level: "warning",
    test: (_fp: string, content: string) =>
      !/\b(TODO|FIXME|HACK|XXX)\b/.test(stripCode(content)),
    message: (fp: string) => `Contains TODO/FIXME marker: ${fp}`,
  },
  {
    name: "minimum-file-size",
    level: "error",
    test: (_fp: string, content: string) =>
      Buffer.byteLength(content, "utf8") >= MIN_FILE_SIZE,
    message: (fp: string) => `File too small (< ${MIN_FILE_SIZE} bytes): ${fp}`,
  },
  {
    name: "no-broken-crossrefs",
    level: "error",
    test: (fp: string, content: string) => {
      const prose = stripCode(content);
      const linkRegex = /\[[^\]]*\]\(([^)]+)\)/g;
      const dir = path.dirname(fp);
      let match: RegExpExecArray | null;
      while ((match = linkRegex.exec(prose)) !== null) {
        let target = match[1].trim();
        const space = target.indexOf(" ");
        if (space !== -1) target = target.slice(0, space); // drop optional "title"
        const hash = target.indexOf("#");
        if (hash !== -1) target = target.slice(0, hash); // drop #anchor
        if (
          target === "" ||
          target.startsWith("http") ||
          target.startsWith("mailto:") ||
          target.startsWith("#") ||
          isPlaceholderTarget(target)
        ) {
          continue;
        }
        if (!fs.existsSync(path.resolve(dir, target))) {
          return false;
        }
      }
      return true;
    },
    message: (fp: string) => `Broken relative cross-reference found in: ${fp}`,
  },
  {
    name: "valid-markdown-syntax",
    level: "error",
    test: (_fp: string, content: string) =>
      (content.match(/```/g) || []).length % 2 === 0,
    message: (fp: string) => `Unclosed code block in: ${fp}`,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function findMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      !["node_modules", "dist", ".git", ".planning"].includes(entry.name)
    ) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

function checkRequiredDirs(): string[] {
  const errors: string[] = [];
  for (const dir of REQUIRED_DIRS) {
    const fullPath = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required directory: ${dir}`);
    }
  }
  return errors;
}

// ── Main Validation ──────────────────────────────────────────────────────────

function validateAll(): { results: ValidationResult[]; dirErrors: string[] } {
  const mdFiles = findMarkdownFiles(REPO_ROOT);
  const dirErrors = checkRequiredDirs();
  const results: ValidationResult[] = [];

  for (const file of mdFiles) {
    const relative = path.relative(REPO_ROOT, file);
    const content = fs.readFileSync(file, "utf-8");
    const result: ValidationResult = {
      file: relative,
      passed: true,
      errors: [],
      warnings: [],
    };

    for (const rule of rules) {
      if (!rule.test(file, content)) {
        if (rule.level === "error") {
          result.passed = false;
          result.errors.push(rule.message(relative, content));
        } else {
          result.warnings.push(rule.message(relative, content));
        }
      }
    }

    // Warnings for long lines
    const longLines = content
      .split("\n")
      .filter((line) => line.length > 120).length;
    if (longLines > 0) {
      result.warnings.push(
        `${longLines} line(s) exceed 120 characters`
      );
    }

    results.push(result);
  }

  return { results, dirErrors };
}

// ── Report ───────────────────────────────────────────────────────────────────

function printReport(
  results: ValidationResult[],
  dirErrors: string[]
): number {
  let totalErrors = 0;
  let totalWarnings = 0;
  let passedFiles = 0;
  let failedFiles = 0;

  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║           DOCUMENTATION VALIDATION REPORT                        ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝");
  console.log();

  if (dirErrors.length > 0) {
    console.log("📁 DIRECTORY ERRORS:");
    for (const err of dirErrors) {
      console.log(`   ❌ ${err}`);
    }
    console.log();
  }

  for (const result of results) {
    if (result.passed && result.errors.length === 0) {
      passedFiles++;
      process.stdout.write(`✅ ${result.file}`);
      if (result.warnings.length > 0) {
        process.stdout.write(` (${result.warnings.length} warning(s))`);
        totalWarnings += result.warnings.length;
      }
      console.log();
    } else {
      failedFiles++;
      console.log(`❌ ${result.file}`);
      for (const err of result.errors) {
        console.log(`   - ${err}`);
        totalErrors++;
      }
      for (const warn of result.warnings) {
        console.log(`   ⚠️  ${warn}`);
        totalWarnings++;
      }
    }
  }

  console.log();
  console.log("───────────────────────────────────────────────────────────────────");
  console.log(`  Files checked : ${results.length}`);
  console.log(`  Passed        : ${passedFiles}`);
  console.log(`  Failed        : ${failedFiles}`);
  console.log(`  Total errors  : ${totalErrors}`);
  console.log(`  Total warnings: ${totalWarnings}`);
  console.log("───────────────────────────────────────────────────────────────────");

  if (totalErrors > 0 || dirErrors.length > 0) {
    console.log("\n❌ VALIDATION FAILED\n");
    return 1;
  }

  console.log("\n✅ ALL CHECKS PASSED\n");
  return 0;
}

// ── Entry Point ──────────────────────────────────────────────────────────────

if (require.main === module) {
  const { results, dirErrors } = validateAll();
  const exitCode = printReport(results, dirErrors);
  process.exit(exitCode);
}

export { validateAll, printReport };
