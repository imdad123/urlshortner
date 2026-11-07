# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains project documentation only: `README.md` describes the planned URL shortener, and `PROJECT_REPORT.md` records its goals, proposed components, and milestones. Application source, tests, and assets have not been added yet. When implementation begins, keep the React client, Node.js API, and any tests in clearly named directories, and update the README with their locations and setup instructions.

## Build, Test, and Development Commands

There are no build, test, or run commands yet because the application and its tooling have not been implemented. Once dependencies and scripts are introduced, document the exact commands here and in `README.md` (for example, `npm install`, `npm run dev`, and `npm test`, only if those scripts exist).

## Coding Style & Naming Conventions

No language-specific style or formatter is configured yet. Follow the conventions of the selected React and Node.js toolchain when adding code. Use descriptive names, keep modules focused, and add formatting or linting configuration alongside the first implementation rather than relying on undocumented defaults.

## Testing Guidelines

No test framework or coverage target is configured. Add tests with the application features, use filenames that clearly identify the unit or behavior under test (for example, `redirect.test.js`), and document how to run the suite. Cover URL validation, short-code lookup, and redirect behavior as those features are implemented.

## Commit & Pull Request Guidelines

The Git history currently has one commit, `Initial commit: URL shortener project docs`, so no established commit convention can be inferred. Use short, imperative commit subjects that explain the change (for example, `Add URL validation endpoint`). Pull requests should summarize the change, list relevant checks, and include screenshots for user-facing UI changes. Link related issues when applicable.

## Security & Configuration

Do not commit credentials, API keys, or production secrets. Use environment variables for local configuration and provide a sanitized example configuration file if the application requires one.
