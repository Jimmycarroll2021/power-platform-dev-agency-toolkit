# Smoke Test Report — New User Clone & Install

**Tester:** First-time user discovering the repo on GitHub  
**Test date:** 2026-06-19  
**Test path:** `C:\Users\j_car\.00xxAIProjectsxx00\Smoke Testing\PA smoke test from Git`  
**Repo:** https://github.com/Jimmycarroll2021/power-platform-dev-agency-toolkit  
**Method:** Follow README instructions exactly as a new user would; note every friction point.

---

## Results summary

| Step | Outcome | Friction |
|---|---|---|
| Clone via README | ✅ Succeeded | Minor — git progress writes to stderr, which can look like an error in PowerShell |
| `npm install` | ✅ Succeeded | ⚠️ Several deprecation warnings (eslint 8, glob, rimraf, inflight) — scary but non-fatal |
| `npm run build` | ✅ Succeeded silently | None |
| `npm run verify` | ✅ **72/72 tests pass**, 0 errors | None |
| `npm link -w packages/cli` | ✅ Succeeded | None |
| `pp-agency --version` | ✅ `1.0.0` | None |
| `pp-agency checklist --type qa` | ✅ Generated 16-task checklist | None |
| `pp-agency solution list` (no pac) | ✅ Graceful error with clear instructions | None |

**Overall first-run success rate: 100% for the local clone-and-link path.**

---

## Friction points found

### 1. README "Deploy" section promises npm global install that does not exist
**Evidence:**

```bash
npm install -g @power-platform-agency/cli
# npm error 404 — The requested resource '@power-platform-agency/cli@*' could not be found
```

**Impact:** HIGH. A user who skips straight to "Deploy" or prefers `npm install -g` will hit a 404 and likely drop the tool immediately.

**Fix:** Either publish the package first, or rewrite the Deploy section to make it clear the global npm install is available only after the first GitHub release, and lead with the clone-and-link path.

---

### 2. README instructions are inconsistent across sections
**Evidence:**
- Quick Start: `npm install` → `npm run build` → `npm run verify` → `npm link -w packages/cli`
- Deploy section: `npm install` → `npm run verify` → `npm link -w packages/cli` (skips `build`)
- CLI README / older docs: `cd packages/cli && npm link`

**Impact:** MEDIUM. Confuses users about whether they need to run `build` before `verify`, and which link command is correct.

**Fix:** Standardize on one happy path: `npm install && npm run verify && npm link -w packages/cli`.

---

### 3. Docker Compose fails out of the box
**Evidence:**

```text
env file C:\...\.env not found: The system cannot find the file specified.
```

Also: `version: "3.9"` is flagged as obsolete.

**Impact:** MEDIUM-HIGH for users who prefer Docker. They hit a hard stop before the tool does anything.

**Fix:**
- Add `.env` to the repo (or make docker-compose fall back to `.env.example`).
- Remove the obsolete `version` line.
- Add a Docker section to README.

---

### 4. npm deprecation warnings
**Evidence:**

```text
npm warn deprecated eslint@8.57.1: This version is no longer supported.
npm warn deprecated glob@7.2.3: ... contain widely publicized security vulnerabilities ...
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated inflight@1.0.6: ... leaks memory
```

**Impact:** LOW-MEDIUM. Install succeeds and `npm audit` is clean, but the warnings make the project look unmaintained to a security-conscious user.

**Fix:** Upgrade eslint to v9 and migrate the ESLint config, or at least add a note in README/TROUBLESHOOTING explaining these are transitive dev-only warnings and `npm audit` is clean.

---

### 5. No troubleshooting / first-run guide
**Impact:** LOW. Most things work, but when they don't (e.g. Docker, npm global install, missing pac), the user has to hunt through multiple docs.

**Fix:** Add a short TROUBLESHOOTING.md or FAQ section.

---

## Verdict

A new user who follows the **clone-and-link** path will succeed and be impressed — the CLI works, tests pass, and the docs are rich. But a user who:
- tries the **global npm install** first,
- prefers **Docker**, or
- is alarmed by **deprecation warnings**

...is at risk of dropping the tool before seeing it work.

**Recommendation:** Fix the 3 high-impact friction points above and re-test. The core product is solid; the onboarding just needs to be brutally honest and consistent.
