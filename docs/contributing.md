---
title: "Contributing — Documentation Notes"
description: "Doc-specific contribution rules: markdown style, frontmatter for generated client docs, cross-reference rules, and running the docs check."
category: docs
related:
  - ../CONTRIBUTING.md
  - ../scripts/validate-docs.ts
  - licensing-and-capacity.md
---

# Contributing — Documentation Notes

This is the short, docs-focused page. The full, canonical setup, quality-gate,
content-authoring, commit/PR, and licensing guidance lives in the root guide:

> **[Contributing Guide](../CONTRIBUTING.md)**

Read that first. The notes below add detail specific to the markdown
knowledge base in `docs/` and the rest of the repo.

## Markdown style

- Filenames are `kebab-case.md` (services are the exception: `NN-slug.md`).
- Write GitHub-Flavored Markdown. Every fenced code block must be closed — the
  validator fails on an odd number of triple-backtick fence markers.
- Keep prose lines under ~120 characters (longer lines are reported as
  warnings). One sentence per idea; tables for option/parameter listings.
- No `TODO`, `FIXME`, `HACK`, or `XXX` markers in committed prose.
- Keep files substantive — files under 50 bytes fail the docs check.

## Frontmatter convention (generated client docs)

Knowledge-base and generated client documents carry a YAML frontmatter block at
the top of the file:

```yaml
---
title: "Document Title"
description: "One-line summary of the document."
category: docs # e.g. service | docs | playbook | checklist | agent
related:
  - ../playbooks/canvas-app.md
  - ../checklists/qa.md
---
```

Notes:

- `related:` entries are **relative paths** from the file that contains them and
  must resolve to files that exist.
- Documents scaffolded by the CLI (for example `generate-prd`,
  `generate-solution-design`, `new-project`) emit frontmatter in this shape —
  preserve it when you hand-edit generated output so the docs check stays green.
- See [licensing-and-capacity.md](licensing-and-capacity.md) for a live example
  of an extended reference doc in this directory.

## Cross-reference rules

- Use relative links from the editing file's own location. From inside `docs/`,
  a sibling is `./other-doc.md` and a repo-root file is `../CONTRIBUTING.md`.
- [scripts/validate-docs.ts](../scripts/validate-docs.ts) checks every relative
  prose link and fails on any broken target. It ignores links inside code
  fences, `http`/`mailto` links, bare `#anchor` links, and placeholder targets
  containing `< > { } $ *` or `...`.
- Do not link to a file that does not exist yet. Create the target first, or use
  a placeholder token.

## Running the docs check

```bash
npm run docs:check      # validates all markdown (same as the CI docs gate)
npm run validate        # structure check + docs:check
```

The CI workflow [.github/workflows/docs-check.yml](../.github/workflows/docs-check.yml)
runs the same validator on any pushed or proposed `**.md` change, so a green
local `npm run docs:check` keeps that gate passing.
