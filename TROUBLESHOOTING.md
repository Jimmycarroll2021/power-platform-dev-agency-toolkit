# Troubleshooting

## First-run checklist

```bash
git clone git@github.com:Jimmycarroll2021/power-platform-dev-agency-toolkit.git
cd power-platform-dev-agency-toolkit
npm install
npm run verify
npm link -w packages/cli
pp-agency --help
```

---

## `npm install` shows deprecation warnings

**Expected.** Some transitive dev dependencies (e.g. `eslint@8`, `glob@7`, `rimraf@3`) are deprecated. These do **not** block installation or usage, and `npm audit` reports **0 vulnerabilities**.

If you want a cleaner install, the project will migrate to `eslint@9` in a future release.

---

## `npm install -g @power-platform-agency/cli` returns 404

The CLI package is published automatically on GitHub releases. Until the first
release is published, install from source:

```bash
git clone git@github.com:Jimmycarroll2021/power-platform-dev-agency-toolkit.git
cd power-platform-dev-agency-toolkit
npm install
npm link -w packages/cli
```

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for how maintainers publish releases.

---

## `pp-agency solution` or `pp-agency env` says "pac is not available"

These commands wrap the Microsoft Power Platform CLI (`pac`). Install it
separately:

<https://learn.microsoft.com/power-platform/developer/cli/intro>

Then authenticate:

```bash
pac auth create --environment <url>
```

The toolkit CLI degrades gracefully when `pac` is missing and tells you exactly
what to install.

---

## Docker Compose fails with `.env not found`

`docker-compose.yml` now reads from `.env.example` by default. If you have a
custom `.env`, copy the example first:

```bash
cp .env.example .env
```

Then run:

```bash
docker compose up dev
```

---

## `npm run verify` fails

Run the gates individually to isolate the failure:

```bash
npm run typecheck
npm run lint
npm run build
npm run test
npm run validate
```

Common causes:
- **Node version too old**: requires Node >= 18.
- **Modified markdown broke a link**: run `npm run docs:check`.
- **Windows line endings**: ensure `core.autocrlf` is not converting LF to CRLF in YAML/JSON files.

---

## Global `pp-agency` command not found after `npm link`

Make sure your npm global bin directory is on your PATH. On Windows this is
usually:

```text
C:\Users\<you>\AppData\Roaming\npm
```

Or run the CLI directly from the repo:

```bash
node packages/cli/dist/index.js --help
```

---

## Still stuck?

Open an issue at <https://github.com/Jimmycarroll2021/power-platform-dev-agency-toolkit/issues>.
