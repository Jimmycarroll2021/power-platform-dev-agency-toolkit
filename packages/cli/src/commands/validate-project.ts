/**
 * Command: pp-agency validate --project <path>
 *
 * Validates a project directory for required files, frontmatter, and cross-references.
 */

import * as path from 'node:path';
import { Command } from 'commander';
import { type ValidationResult } from '../lib/project-types.js';
import { fileExists, readFile, listFiles, logInfo, logError } from '../lib/file-utils.js';
import { hasFrontmatter, extractFrontmatter, printValidation } from '../lib/markdown-utils.js';

// ---------------------------------------------------------------------------
// Chalk safe-import
// ---------------------------------------------------------------------------
let chalk: typeof import('chalk').default | undefined;
try {
  const chalkMod = await import('chalk');
  chalk = chalkMod.default;
} catch {
  chalk = undefined;
}

const _cyan = (s: string): string => (chalk ? chalk.cyan(s) : s);
const _green = (s: string): string => (chalk ? chalk.green(s) : s);
const _red = (s: string): string => (chalk ? chalk.red(s) : s);
const _yellow = (s: string): string => (chalk ? chalk.yellow(s) : s);

// ---------------------------------------------------------------------------
// Options interface
// ---------------------------------------------------------------------------
interface ValidateOptions {
  project?: string;
  verbose?: boolean;
}

// ---------------------------------------------------------------------------
// Validation checks
// ---------------------------------------------------------------------------

const REQUIRED_FILES = [
  'project-brief.md',
  'discovery-notes.md',
];

const RECOMMENDED_FILES = [
  'prd.md',
  'solution-design.md',
];

/**
 * Check that a required file exists.
 */
function checkRequiredFile(projectDir: string, filename: string): ValidationResult {
  const filePath = path.join(projectDir, filename);
  const exists = fileExists(filePath);
  return {
    check: `Required file: ${filename}`,
    passed: exists,
    message: exists ? undefined : `File not found at ${filePath}`,
  };
}

/**
 * Check that a recommended file exists.
 */
function checkRecommendedFile(projectDir: string, filename: string): ValidationResult {
  const filePath = path.join(projectDir, filename);
  const exists = fileExists(filePath);
  return {
    check: `Recommended file: ${filename}`,
    passed: exists,
    message: exists ? undefined : `Consider adding ${filename}`,
  };
}

/**
 * Check that a markdown file has valid YAML frontmatter.
 */
function checkFrontmatter(projectDir: string, filename: string): ValidationResult {
  const filePath = path.join(projectDir, filename);
  if (!fileExists(filePath)) {
    return { check: `Frontmatter: ${filename}`, passed: true, message: 'File not present — skipping' };
  }

  const content = readFile(filePath) ?? '';
  const hasFm = hasFrontmatter(content);
  return {
    check: `Frontmatter: ${filename}`,
    passed: hasFm,
    message: hasFm ? undefined : `Missing YAML frontmatter in ${filename}`,
  };
}

/**
 * Check that frontmatter contains a project name.
 */
function checkFrontmatterProject(projectDir: string, filename: string): ValidationResult {
  const filePath = path.join(projectDir, filename);
  if (!fileExists(filePath)) {
    return { check: `FM project field: ${filename}`, passed: true, message: 'File not present — skipping' };
  }

  const content = readFile(filePath) ?? '';
  const fm = extractFrontmatter(content);
  if (!fm) {
    return { check: `FM project field: ${filename}`, passed: false, message: 'No frontmatter found' };
  }

  const hasProject = /project:\s*\S+/.test(fm);
  return {
    check: `FM project field: ${filename}`,
    passed: hasProject,
    message: hasProject ? undefined : `Frontmatter missing "project" field in ${filename}`,
  };
}

/**
 * Check for cross-references between project documents.
 */
function checkCrossReferences(projectDir: string): ValidationResult {
  const briefPath = path.join(projectDir, 'project-brief.md');
  if (!fileExists(briefPath)) {
    return { check: 'Cross-references', passed: true, message: 'No project brief to check' };
  }

  const brief = readFile(briefPath) ?? '';

  // Check that PRD and solution design are referenced if they exist
  const prdExists = fileExists(path.join(projectDir, 'prd.md'));
  const sddExists = fileExists(path.join(projectDir, 'solution-design.md'));

  const hasPrdRef = brief.toLowerCase().includes('prd') || brief.includes('requirements');
  const hasSddRef = brief.toLowerCase().includes('solution design') || brief.includes('architecture');

  const issues: string[] = [];
  if (prdExists && !hasPrdRef) {
    issues.push('PRD exists but is not referenced in project-brief.md');
  }
  if (sddExists && !hasSddRef) {
    issues.push('Solution design exists but is not referenced in project-brief.md');
  }

  return {
    check: 'Cross-references in project-brief.md',
    passed: issues.length === 0,
    message: issues.length > 0 ? issues.join('; ') : undefined,
  };
}

/**
 * Check directory structure.
 */
function checkDirectoryStructure(projectDir: string): ValidationResult {
  const expectedDirs = ['checklists', 'agents', 'docs'];
  const missing = expectedDirs.filter((d) => !fileExists(path.join(projectDir, d)));

  return {
    check: 'Directory structure',
    passed: missing.length === 0,
    message: missing.length > 0 ? `Missing directories: ${missing.join(', ')}` : undefined,
  };
}

// ---------------------------------------------------------------------------
// Command registration
// ---------------------------------------------------------------------------

export function registerValidateCommand(program: Command): void {
  program
    .command('validate')
    .description('Validate a project directory for completeness and consistency')
    .requiredOption('-p, --project <path>', 'Path to the project directory')
    .action(async (options: ValidateOptions) => {
      try {
        const projectPath = path.resolve(options.project ?? '.');

        console.log(_cyan(`\nValidating project: ${projectPath}\n`));

        if (!fileExists(projectPath)) {
          logError(`Project directory does not exist: ${projectPath}`);
          process.exit(1);
        }

        if (options.verbose) {
          logInfo(`Checking files in: ${projectPath}`);
          const files = listFiles(projectPath);
          logInfo(`Found ${files.length} items: ${files.join(', ')}`);
        }

        const results: ValidationResult[] = [];

        // Check required files
        for (const file of REQUIRED_FILES) {
          results.push(checkRequiredFile(projectPath, file));
        }

        // Check recommended files
        for (const file of RECOMMENDED_FILES) {
          results.push(checkRecommendedFile(projectPath, file));
        }

        // Check frontmatter on key files
        results.push(checkFrontmatter(projectPath, 'project-brief.md'));
        results.push(checkFrontmatter(projectPath, 'prd.md'));
        results.push(checkFrontmatter(projectPath, 'solution-design.md'));

        // Check frontmatter project field
        results.push(checkFrontmatterProject(projectPath, 'project-brief.md'));

        // Check cross-references
        results.push(checkCrossReferences(projectPath));

        // Check directory structure
        results.push(checkDirectoryStructure(projectPath));

        // Print results
        console.log(_yellow('--- Validation Results ---\n'));
        let passedCount = 0;
        let failedCount = 0;

        for (const result of results) {
          printValidation(result.check, result.passed, result.message);
          if (result.passed) {
            passedCount++;
          } else {
            failedCount++;
          }
        }

        console.log('');
        console.log(_green(`Passed: ${passedCount}`));
        if (failedCount > 0) {
          console.log(_red(`Failed: ${failedCount}`));
        }

        const allPassed = failedCount === 0;
        console.log(allPassed ? _green('\nValidation PASSED') : _red('\nValidation FAILED'));

        process.exit(allPassed ? 0 : 1);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logError(`Error validating project: ${message}`);
        process.exit(1);
      }
    });
}
