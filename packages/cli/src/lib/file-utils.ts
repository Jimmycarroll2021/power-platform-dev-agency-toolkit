/**
 * File system utilities for the Power Platform Dev Agency CLI.
 * All paths are resolved cross-platform via path.join.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

// ---------------------------------------------------------------------------
// Chalk safe-import — graceful fallback if chalk is not installed yet
// ---------------------------------------------------------------------------
let chalk: typeof import('chalk').default | undefined;
try {
  const chalkMod = await import('chalk');
  chalk = chalkMod.default;
} catch {
  chalk = undefined;
}

const _green = (s: string): string => (chalk ? chalk.green(s) : s);
const _yellow = (s: string): string => (chalk ? chalk.yellow(s) : s);
const _red = (s: string): string => (chalk ? chalk.red(s) : s);
const _cyan = (s: string): string => (chalk ? chalk.cyan(s) : s);

// ---------------------------------------------------------------------------
// Directory resolution helpers
// ---------------------------------------------------------------------------

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Absolute path to the CLI src folder. */
export const SRC_DIR = path.resolve(__dirname, '..');

/** Absolute path to the CLI package root (contains package.json). */
export const PKG_ROOT = path.resolve(SRC_DIR, '..');

// ---------------------------------------------------------------------------
// Core file utilities
// ---------------------------------------------------------------------------

/**
 * Create a directory (and all intermediate directories) if it does not exist.
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(_green(`  created dir : ${dirPath}`));
  }
}

/**
 * Write a text file to disk, creating parent directories as needed.
 */
export function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(_green(`  written     : ${filePath}`));
}

/**
 * Check whether a file or directory exists.
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Read a JSON file and parse it. Returns `null` if the file is missing or invalid.
 */
export function loadJson<T = any>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Read a template string from the built-in templates directory.
 * Falls back to an empty string if the template is not found.
 */
export function readTemplate(name: string): string {
  const templatePath = path.join(PKG_ROOT, 'templates', `${name}.md`);
  try {
    return fs.readFileSync(templatePath, 'utf-8');
  } catch {
    console.log(_yellow(`  template not found: ${templatePath}, using built-in fallback`));
    return '';
  }
}

/**
 * Generate a consistent filename from a human-readable name + optional suffix.
 * Example: generateFilename('Contoso CRM', 'brief') => 'contoso-crm-brief.md'
 */
export function generateFilename(name: string, suffix?: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return suffix ? `${base}-${suffix}.md` : `${base}.md`;
}

/**
 * Read a text file. Returns `null` if the file does not exist.
 */
export function readFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * List all files in a directory (non-recursive). Returns empty array on error.
 */
export function listFiles(dirPath: string): string[] {
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}

/**
 * Log an informational message (cyan).
 */
export function logInfo(message: string): void {
  console.log(_cyan(`  info        : ${message}`));
}

/**
 * Log a warning message (yellow).
 */
export function logWarn(message: string): void {
  console.log(_yellow(`  warn        : ${message}`));
}

/**
 * Log an error message (red).
 */
export function logError(message: string): void {
  console.error(_red(`  error       : ${message}`));
}

/**
 * Log a success message (green).
 */
export function logSuccess(message: string): void {
  console.log(_green(`  success     : ${message}`));
}
