# Project Report: URL Shortener

## Overview

This project provides a web application that turns long destination URLs into short links. A visitor opening a short link is redirected to the original destination. The client uses React and Vite; the API uses Node.js and Express.

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
| In-memory store | Keep short-code and destination-URL mappings for the lifetime of the API process |

## Current status

The MVP includes a responsive React interface, HTTP API, short-code generation, URL validation, redirects, health endpoint, and Node.js integration tests. Link mappings are held in memory and are lost when the API restarts. There is no database, authentication, analytics, or deployment configuration yet.

## Suggested implementation milestones

1. Select persistent storage and migrate short-link mappings.
2. Add production deployment configuration and monitoring.
3. Revisit abuse prevention, rate limits, and link lifecycle features before public deployment.

## Open decisions

- Which database should store links?
- Should users be able to choose custom aliases or set link expiration?
- Should the application include click analytics or user accounts?
- Where will the application be deployed?
