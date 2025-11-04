<!--
AI agent instructions for this repository. Keep this short (20-50 lines), factual and code-linked.
-->
# Copilot / AI agent instructions — Portfolio (client + server)

Purpose
- Help an AI contributor be productive quickly: explain the high-level architecture, common developer commands, and repository-specific conventions.

Big picture
- This repo contains two separate apps in the workspace root:
  - `portfolio-client` — an Angular 20 application with SSR support (uses `@angular/ssr`, `@angular/platform-server`).
  - `portfolio-server` — a NestJS backend (typical Nest starter layout).
- The client is built and can be served as SSR using the Express handler in `portfolio-client/src/server.ts`. The server is a conventional Nest app that listens on port 6900 by default (`portfolio-server/src/main.ts`).

Key developer workflows (quick commands)
- Client (inside `portfolio-client`):
  - Dev server: `npm run start` (runs `ng serve`).
  - Build: `npm run build` (runs `ng build`).
  - SSR production server: after `ng build --configuration production` you can run the built SSR server with `npm run serve:ssr:portfolio-client` which executes `node dist/portfolio-client/server/server.mjs`.
  - Tests: `npm run test` (Karma).
- Server (inside `portfolio-server`):
  - Dev: `npm run start:dev` (runs `nest start --watch`).
  - Build: `npm run build` (`nest build`).
  - Start production: `npm run start:prod` (runs `node dist/main`).
  - Tests: `npm run test` (Jest), e2e: `npm run test:e2e`.

Project-specific conventions & patterns
- Angular patterns:
  - Uses standalone components (see `portfolio-client/src/app/app.ts`: `standalone: true`). Expect standalone components across the app.
  - Uses signals (`signal` from `@angular/core`) for component state.
  - Router configuration lives in `portfolio-client/src/app/app.routes.ts`. Server-side routes for SSR are in `portfolio-client/src/app/app.routes.server.ts`.
  - SSR entrypoints: `src/main.server.ts` (bootstrapping for SSR) and `src/server.ts` (Express adapter using `@angular/ssr/node`).
- Nest patterns:
  - Standard NestJS starter layout: controllers in `portfolio-server/src/*.ts`, module in `portfolio-server/src/app.module.ts`.
  - Default port is set in `portfolio-server/src/main.ts` to 6900 — tests or CI may expect that.

Integration points and things to watch for
- Client SSR: `portfolio-client/src/server.ts` serves static files from `dist/portfolio-client/browser` and uses `AngularNodeAppEngine` to render requests. When changing build output names or `angular.json` targets, update this path and the `serve:ssr:portfolio-client` script.
- API endpoints: `src/server.ts` contains a commented example showing where Express routes can be added for server-side APIs if desired.
- Keep the client and server separate: there is no monorepo build orchestration in this repo; run scripts inside each project folder.

Key files to inspect for context
- Client: `angular.json`, `package.json`, `src/main.ts`, `src/main.server.ts`, `src/server.ts`, `src/app/app.ts`, `src/app/app.routes.ts`, `src/app/app.routes.server.ts`
- Server: `package.json`, `src/main.ts`, `src/app.module.ts`, `src/app.controller.ts` and `src/app.service.ts`

Testing, linting and CI notes
- Client tests: Karma (run with `npm run test` in `portfolio-client`).
- Server tests: Jest (run with `npm run test` in `portfolio-server`).
- Linting (server): `npm run lint` is configured to run ESLint rules for the server.

Common pitfalls & tips
- Node/CJS vs ESM: `portfolio-client/src/server.ts` uses modern ESM-style imports and references `import.meta.dirname` and `.mjs` artifacts — ensure a Node version that supports your build output and import semantics when running SSR.
- Package manager: `portfolio-server/README.md` suggests `pnpm` but `package.json` scripts work with npm/yarn too — prefer the workspace's package manager if one is used consistently.
- Ports: client SSR server defaults to 4000 in `server.ts`; Nest server hardcodes 6900 in `portfolio-server/src/main.ts`. Use env `PORT` to override where supported.

If you change behavior
- Update the specific script in the corresponding `package.json` and any hard-coded path in `src/server.ts` or `dist/*` references.

Questions for the maintainers (if unclear)
- Preferred package manager (npm/pnpm/yarn) for this repository? The server README mentions `pnpm`.
- Any CI steps or deployments that rely on specific Node versions or build artifacts naming conventions?

If you want changes to this file, tell me which parts need more or fewer details.
