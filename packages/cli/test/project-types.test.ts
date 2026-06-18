import { test } from 'node:test';
import assert from 'node:assert/strict';

import * as projectTypesModule from '../src/lib/project-types.js';
import { ProjectType, AgentType } from '../src/lib/project-types.js';

/**
 * Unit tests for ../src/lib/project-types.ts
 *
 * The module exports two runtime enums (ProjectType, AgentType) plus a set of
 * compile-time-only TypeScript interfaces. Interfaces have no runtime presence,
 * so these tests exercise the enums: their members, string values, bidirectional
 * key<->value mapping, uniqueness, and the module's runtime export surface.
 */

// Frozen expectations mirror the source enum definitions exactly.
const EXPECTED_PROJECT_TYPES = {
  CanvasApp: 'canvas-app',
  ModelDriven: 'model-driven',
  PowerPages: 'power-pages',
  Integration: 'integration',
  Copilot: 'copilot',
  FullSolution: 'full-solution',
} as const;

const EXPECTED_AGENT_TYPES = {
  Architect: 'architect',
  DataModeler: 'data-modeler',
  Developer: 'developer',
  Tester: 'tester',
  AlmEngineer: 'alm-engineer',
  SecurityAdmin: 'security-admin',
} as const;

test('ProjectType members exist with expected string values', () => {
  for (const [key, value] of Object.entries(EXPECTED_PROJECT_TYPES)) {
    assert.equal(
      (ProjectType as Record<string, string>)[key],
      value,
      `ProjectType.${key} should equal "${value}"`
    );
  }
});

test('ProjectType has exactly the expected members', () => {
  const expectedKeys = Object.keys(EXPECTED_PROJECT_TYPES).sort();
  const actualKeys = Object.keys(ProjectType).sort();
  assert.deepEqual(actualKeys, expectedKeys);
  assert.equal(actualKeys.length, 6);
});

test('ProjectType string values are unique', () => {
  const values = Object.values(ProjectType);
  assert.equal(new Set(values).size, values.length);
});

test('ProjectType values are all lowercase kebab-case strings', () => {
  for (const value of Object.values(ProjectType)) {
    assert.equal(typeof value, 'string');
    assert.match(
      value as string,
      /^[a-z]+(-[a-z]+)*$/,
      `ProjectType value "${String(value)}" should be lowercase kebab-case`
    );
  }
});

test('AgentType members exist with expected string values', () => {
  for (const [key, value] of Object.entries(EXPECTED_AGENT_TYPES)) {
    assert.equal(
      (AgentType as Record<string, string>)[key],
      value,
      `AgentType.${key} should equal "${value}"`
    );
  }
});

test('AgentType has exactly the expected members', () => {
  const expectedKeys = Object.keys(EXPECTED_AGENT_TYPES).sort();
  const actualKeys = Object.keys(AgentType).sort();
  assert.deepEqual(actualKeys, expectedKeys);
  assert.equal(actualKeys.length, 6);
});

test('AgentType string values are unique', () => {
  const values = Object.values(AgentType);
  assert.equal(new Set(values).size, values.length);
});

test('AgentType values are all lowercase kebab-case strings', () => {
  for (const value of Object.values(AgentType)) {
    assert.equal(typeof value, 'string');
    assert.match(
      value as string,
      /^[a-z]+(-[a-z]+)*$/,
      `AgentType value "${String(value)}" should be lowercase kebab-case`
    );
  }
});

test('enum values support reverse lookup by string value', () => {
  // String enums are not numerically reverse-mapped, but the value can be used
  // to resolve back to its canonical member via Object.values membership.
  assert.ok(Object.values(ProjectType).includes(ProjectType.ModelDriven));
  assert.ok(Object.values(AgentType).includes(AgentType.AlmEngineer));
  assert.equal(ProjectType.FullSolution, 'full-solution');
  assert.equal(AgentType.SecurityAdmin, 'security-admin');
});

test('a known string value resolves to the matching enum member', () => {
  // Simulates the CLI resolving a --type / --agent option string to an enum.
  const resolveProjectType = (input: string): ProjectType | undefined =>
    (Object.values(ProjectType) as string[]).includes(input)
      ? (input as ProjectType)
      : undefined;
  const resolveAgentType = (input: string): AgentType | undefined =>
    (Object.values(AgentType) as string[]).includes(input)
      ? (input as AgentType)
      : undefined;

  assert.equal(resolveProjectType('power-pages'), ProjectType.PowerPages);
  assert.equal(resolveProjectType('not-a-type'), undefined);
  assert.equal(resolveAgentType('data-modeler'), AgentType.DataModeler);
  assert.equal(resolveAgentType('not-an-agent'), undefined);
});

test('ProjectType and AgentType value namespaces do not collide', () => {
  const projectValues = new Set(Object.values(ProjectType) as string[]);
  for (const agentValue of Object.values(AgentType) as string[]) {
    assert.equal(
      projectValues.has(agentValue),
      false,
      `AgentType value "${agentValue}" unexpectedly collides with a ProjectType value`
    );
  }
});

test('module runtime exports are exactly the two enums', () => {
  // Interfaces are erased at runtime, so the only runtime exports should be the
  // two enum objects. This guards against accidental added/removed exports.
  const runtimeExports = Object.keys(projectTypesModule).sort();
  assert.deepEqual(runtimeExports, ['AgentType', 'ProjectType']);
  assert.equal(typeof projectTypesModule.ProjectType, 'object');
  assert.equal(typeof projectTypesModule.AgentType, 'object');
});
