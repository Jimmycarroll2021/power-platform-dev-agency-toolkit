/**
 * Core type definitions for the Power Platform Dev Agency CLI.
 */

/** Supported Power Platform project types. */
export enum ProjectType {
  CanvasApp = 'canvas-app',
  ModelDriven = 'model-driven',
  PowerPages = 'power-pages',
  Integration = 'integration',
  Copilot = 'copilot',
  FullSolution = 'full-solution',
}

/** Supported AI agent specializations. */
export enum AgentType {
  Architect = 'architect',
  DataModeler = 'data-modeler',
  Developer = 'developer',
  Tester = 'tester',
  AlmEngineer = 'alm-engineer',
  SecurityAdmin = 'security-admin',
}

/** Project configuration used throughout the CLI. */
export interface ProjectConfig {
  /** Project name (kebab-case recommended). */
  name: string;
  /** Power Platform project type. */
  type: ProjectType;
  /** Client or organization name. */
  client: string;
  /** Short project description. */
  description: string;
  /** ISO date string for project creation. */
  createdAt: string;
  /** Semantic version of the project brief. */
  version: string;
}

/** Global CLI options applied to every command. */
export interface CommandOptions {
  /** Enable verbose debug logging. */
  verbose?: boolean;
  /** Output directory or file path. */
  output?: string;
  /** Target project name. */
  project?: string;
}

/** Data passed into template rendering functions. */
export interface TemplateData {
  /** Project configuration. */
  project: ProjectConfig;
  /** Additional custom fields. */
  [key: string]: unknown;
}

/** Individual checklist item with metadata. */
export interface ChecklistItem {
  /** Display text for the checklist item. */
  text: string;
  /** Optional category or section grouping. */
  category?: string;
  /** Whether the item is critical (must pass). */
  critical?: boolean;
  /** Optional reference link to documentation. */
  reference?: string;
}

/** License component breakdown entry. */
export interface LicenseComponent {
  /** Component name (e.g., "Power Apps Per User"). */
  name: string;
  /** Quantity required. */
  quantity: number;
  /** Unit price in selected currency. */
  unitPrice: number;
  /** Total price (quantity * unitPrice). */
  total: number;
}

/** Licensing estimate result. */
export interface LicenseEstimate {
  /** Currency code: usd, gbp, eur. */
  currency: string;
  /** Timestamp of the estimate. */
  generatedAt: string;
  /** Individual line items. */
  components: LicenseComponent[];
  /** Monthly total. */
  monthlyTotal: number;
  /** Annual total (monthlyTotal * 12). */
  annualTotal: number;
}

/** Discovery scoring matrix entry. */
export interface DiscoveryScore {
  /** Category being scored. */
  category: string;
  /** Score from 1-10. */
  score: number;
  /** Free-form notes. */
  notes: string;
}

/** Discovery report output. */
export interface DiscoveryReport {
  client: string;
  projectType: ProjectType;
  date: string;
  scores: DiscoveryScore[];
  toolsNeeded: string[];
  timeline: string;
  budgetRange: string;
  recommendations: string[];
  risks: string[];
}

/** Validation check result. */
export interface ValidationResult {
  /** Human-readable check name. */
  check: string;
  /** Pass or fail status. */
  passed: boolean;
  /** Optional details on failure. */
  message?: string;
}
