# URL Shortener

A small URL-shortening app with a React/Vite client and an Express API. Users can submit an HTTP or HTTPS destination, copy the generated short link, and follow that link to be redirected.

## Project structure

- `frontend/` — React interface and Vite development server.
- `backend/` — Express API and redirect handler.
- `tests/` — Node.js integration tests for the API.
- `PROJECT_REPORT.md` — project scope and implementation notes.

## Requirements and setup

Use Node.js 20 or newer with npm. From the repository root, install dependencies:

```sh
npm install
```

Start both development servers with `npm run dev`. The frontend runs at `http://localhost:5173` and the API defaults to `http://localhost:3000`. To start one service, run `npm run dev:api` or `npm run dev:web`. Set `PORT` to change the API port. Set `VITE_API_BASE_URL` when the frontend needs to reach an API at a different origin; its default is `http://localhost:3000`.

Build the frontend with `npm run build`. Run API integration tests with `npm test`.

## API

- `GET /api/health` returns `{ "status": "ok" }`.
- `POST /api/shorten` accepts `{ "url": "https://example.com/path" }` and returns `201` with `{ "code", "shortUrl", "destinationUrl" }`.
- `GET /:code` redirects to the saved destination. Unknown codes return `404`.

Only absolute `http:` and `https:` destination URLs are accepted. Short links are formed from the API request origin, so local links use port 3000 by default.

The API allows cross-origin browser requests because the Vite client and API use separate local ports. The endpoints are public and do not use cookie-based authentication.

## Storage

This MVP stores links in memory. All mappings are lost when the API process restarts, and separate server instances do not share data. Use persistent storage before deploying for real users.

## Configuration and security

Keep secrets out of source control. Configure deployment-specific values through environment variables; no secrets are needed for local development.
