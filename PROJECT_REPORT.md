# Project Report: URL Shortener

## Overview

This project will provide a web application that turns long destination URLs into short links. A visitor opening a short link will be redirected to the original destination. The planned client is React and the planned server is Node.js.

## Goals

- Make link creation straightforward.
- Generate a unique short code for each saved destination.
- Redirect reliably when a short link is opened.
- Validate input and return useful errors for invalid or missing links.
- Keep the interface usable on desktop and mobile screens.

## Planned user flow

1. A user enters a destination URL in the React application.
2. The client sends the URL to the Node.js API.
3. The server validates it, generates a short code, and saves the mapping.
4. The client displays the resulting short link.
5. A request to that short link looks up the mapping and redirects to the destination.

## Proposed components

| Component | Responsibility |
| --- | --- |
| React frontend | URL entry, validation feedback, and displaying the shortened link |
| Node.js API | Link creation, input validation, and lookup endpoints |
| Redirect handler | Resolve a short code and issue a redirect |
| Database | Persist short-code and destination-URL mappings; selection is pending |

## Current status

The repository currently contains the initial project documentation. Application code, database choice, API framework, deployment setup, and automated checks have not yet been added.

## Suggested implementation milestones

1. Choose the API framework and database.
2. Define the link data model and short-code generation approach.
3. Implement link creation and redirect endpoints.
4. Build the React form and result states.
5. Add validation, error handling, and basic security protections.
6. Document local setup and deployment after implementation.

## Open decisions

- Which database should store links?
- Should users be able to choose custom aliases or set link expiration?
- Should the application include click analytics or user accounts?
- Where will the application be deployed?
