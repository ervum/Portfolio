Thank you for contributing!

This file contains a few project-specific guidelines and quick commands to make contribution smooth.

What not to commit
- Local certs and keys: `*.crt`, `*.key`, `*.pem`, `certs/`
- Local DB files and folders: `*.sqlite`, `*.db`, `pgdata/`, `.postgres/`
- Per-package `dist` build output and TypeScript build info: `**/dist`, `*.tsbuildinfo`
- Editor workspace files: `.vscode/*.code-workspace`
- pnpm store and local caches: `.pnpm-store/`, `.cache`, `.parcel-cache`, `.eslintcache`
- Dev container config that is local-only: `docker-compose.override.yml`, `docker-compose.*.local.yml`, `docker-data/`

Dev container
- I added a `docker-compose.dev.yml` example and `.devcontainer/devcontainer.json` for VS Code Remote - Containers. Note: `.devcontainer/devcontainer.json` is tracked; local devcontainer files and overrides are ignored by `.gitignore` (e.g. `.devcontainer/*.local.json`, `docker-compose.override.yml`).

Dev container usage
- To open the project in the dev container with VS Code, install the "Remote - Containers" extension and choose "Remote-Containers: Open Folder in Container..." then select the repo root. The container will start using `docker-compose.dev.yml` and provide a `workspace` service with Node and direct access to the code.

Docker compose dev usage
- Start local Postgres and the workspace container (useful if you don't open a full devcontainer):

  docker compose -f docker-compose.dev.yml up -d db

- Stop and remove volumes:

  docker compose -f docker-compose.dev.yml down -v

Dev setup and local development
- Install workspace deps from the repo root:

  pnpm install

- Start all dev processes from the root (recommended):

  pnpm run dev:all

  This runs:
  - `packages/shared-configuration`: `pnpm run watch` (rebuilds `dist` on change)
  - `portfolio-server`: `pnpm start:dev` (Nest dev server)
  - `portfolio-client`: `pnpm start` (Angular dev server, uses `proxyconfig.json` to proxy `/api` → backend)

- Rebuild a package manually (example for shared-configuration):

  cd packages/shared-configuration
  pnpm run build

Testing and formatting
- Server tests (Jest):

  cd portfolio-server
  pnpm test

- Client tests (Karma):

  cd portfolio-client
  pnpm test

- Formatting: the repository uses Prettier. Run:

  pnpm -w run format

Code style and PRs
- Keep changes small and focused.
- Add tests for bug fixes or new features where practical.
- Follow repository ESLint and Prettier rules; CI may run linters during PR checks.

Questions
- If you have a question about setup, a failing test, or CI, open an issue or ask in the PR description.

Thanks again — we appreciate your help!