/**
 * Markdown utility functions for generating consistent, well-formatted documents.
 */

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

const _green = (s: string): string => (chalk ? chalk.green(s) : s);
const _red = (s: string): string => (chalk ? chalk.red(s) : s);

// ---------------------------------------------------------------------------
// Frontmatter & structural helpers
// ---------------------------------------------------------------------------

/**
 * Generate YAML frontmatter from a key-value map.
 */
export function frontmatter(data: Record<string, unknown>): string {
  const lines = Object.entries(data).map(([key, value]) => {
    if (typeof value === 'string') {
      // Quote strings that contain special characters
      if (value.includes(':') || value.includes('#') || value.includes('"') || value.includes('\n')) {
        return `${key}: "${value.replace(/"/g, '\\"')}"`;
      }
      return `${key}: ${value}`;
    }
    return `${key}: ${value}`;
  });
  return `---\n${lines.join('\n')}\n---\n`;
}

/**
 * Generate a markdown heading of the given level (1-6).
 */
export function heading(text: string, level: number = 1): string {
  const safeLevel = Math.max(1, Math.min(6, level));
  return `${'#'.repeat(safeLevel)} ${text}\n`;
}

/**
 * Generate a markdown table from headers and row data.
 */
export function table(headers: string[], rows: string[][]): string {
  if (headers.length === 0) return '';
  const headerLine = `| ${headers.join(' | ')} |`;
  const separator = `| ${headers.map(() => '---').join(' | ')} |`;
  const rowLines = rows.map((row) => `| ${row.join(' | ')} |`);
  return [headerLine, separator, ...rowLines].join('\n') + '\n';
}

/**
 * Generate a fenced code block.
 */
export function codeBlock(code: string, language: string = ''): string {
  return `\`\`\`${language}\n${code}\n\`\`\`\n`;
}

/**
 * Generate a markdown link.
 */
export function link(text: string, url: string): string {
  return `[${text}](${url})`;
}

/**
 * Generate a markdown checklist (unordered list with checkboxes).
 * Each item is rendered as `- [ ] text`.
 */
export function checklist(items: string[]): string {
  return items.map((item) => `- [ ] ${item}`).join('\n') + '\n';
}

/**
 * Generate a numbered checklist (1. [ ] text).
 */
export function numberedChecklist(items: string[]): string {
  return items.map((item, i) => `${i + 1}. [ ] ${item}`).join('\n') + '\n';
}

/**
 * Generate a Shields.io badge URL.
 */
export function badge(label: string, message: string, color: string = 'blue'): string {
  const encodedLabel = encodeURIComponent(label);
  const encodedMessage = encodeURIComponent(message);
  return `https://img.shields.io/badge/${encodedLabel}-${encodedMessage}-${color}`;
}

/**
 * Generate a horizontal rule.
 */
export function horizontalRule(): string {
  return '\n---\n\n';
}

/**
 * Generate a blockquote.
 */
export function blockquote(text: string): string {
  return `> ${text}\n`;
}

/**
 * Generate a bold text span.
 */
export function bold(text: string): string {
  return `**${text}**`;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Check whether a markdown string contains YAML frontmatter.
 */
export function hasFrontmatter(content: string): boolean {
  return content.trimStart().startsWith('---\n');
}

/**
 * Extract the YAML frontmatter text from a markdown document.
 * Returns the raw frontmatter block (including --- delimiters) or null.
 */
export function extractFrontmatter(content: string): string | null {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith('---\n')) return null;
  const endIdx = trimmed.indexOf('\n---', 4);
  if (endIdx === -1) return null;
  return trimmed.slice(0, endIdx + 4);
}

/**
 * Print a pass/fail validation line to the console.
 */
export function printValidation(check: string, passed: boolean, message?: string): void {
  const icon = passed ? _green('PASS') : _red('FAIL');
  const msg = message ? ` — ${message}` : '';
  console.log(`  [${icon}] ${check}${msg}`);
}
