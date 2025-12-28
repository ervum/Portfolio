# Portfolio (Monorepo)

Quick commands

- Run all dev processes in parallel (equivalent to the VS Code "Dev: All" task):

```bash
pnpm run dev:all
```

This runs the following workspace scripts in parallel:

- `packages/*`: `pnpm run watch` (runs on all shared packages)
- `portfolio-server`: `pnpm start:dev`
- `portfolio-client`: `pnpm start`

Stop the processes from the terminal using Ctrl+C or by closing the terminal.

---

## CI / Build verification ✅

This repository includes a GitHub Actions workflow that validates the workspace build order and artifacts on push / PR to `main`.

What the workflow does:

- Installs dependencies with `pnpm install -w`
- Runs the workspace build (`pnpm -w -r build`) — TypeScript project references are built first
- Verifies that `packages/shared-configuration/dist/index.js` and `portfolio-server/dist/main.js` were produced

You can run the same checks locally:

```bash
pnpm -w -r build
# then verify the artifacts exist
test -f packages/shared-configuration/dist/index.js && test -f portfolio-server/dist/main.js
```