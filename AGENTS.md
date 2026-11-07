# Repository Guidelines

## Project Structure & Module Organization

The React/Vite client lives in `frontend/`, the Express API in `backend/`, and API integration tests in `tests/`. `README.md` documents local setup and routes; `PROJECT_REPORT.md` records the project goals and milestones. Keep frontend and backend concerns in their respective directories and update the README when commands or API behavior change.

## Build, Test, and Development Commands

From the repository root, run `npm install` to install workspace dependencies, `npm run dev` to start both services, `npm run build` to build the frontend, and `npm test` to run API integration tests. `npm run dev:api` and `npm run dev:web` start one service at a time. The API uses port 3000 by default; `PORT` and frontend `VITE_API_BASE_URL` can be set for local configuration.

## Coding Style & Naming Conventions

Use two-space indentation and descriptive component, function, and variable names. React components use PascalCase; files and utility functions use the existing lowercase/camelCase patterns. No formatter or linter is configured, so keep changes consistent with nearby code.

## Testing Guidelines

Tests use Node's built-in `node:test` runner; files live in `tests/` and use the `*.test.js` suffix. Run the suite with `npm test`. Cover request validation, link creation, redirects, unknown codes, and API behavior when changing backend routes. No coverage threshold is configured.

## Commit & Pull Request Guidelines

The Git history currently has one commit, `Initial commit: URL shortener project docs`, so no established commit convention can be inferred. Use short, imperative commit subjects that explain the change (for example, `Add URL validation endpoint`). Pull requests should summarize the change, list relevant checks, and include screenshots for user-facing UI changes. Link related issues when applicable.

## Security & Configuration

Do not commit credentials, API keys, or production secrets. Use environment variables for local configuration and provide a sanitized example configuration file if the application requires one.
