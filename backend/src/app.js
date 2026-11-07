import { randomBytes } from 'node:crypto';
import express from 'express';

const CODE_BYTES = 6;
const MAX_CODE_ATTEMPTS = 5;

export function isValidDestinationUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return false;

  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function createApp({ links = new Map(), shortUrlBase } = {}) {
  const app = express();
  app.disable('x-powered-by');

  // The Vite client runs on a different origin during development. This API
  // is public and does not use cookies, so allow browser clients to call it.
  app.use('/api', (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  });

  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/shorten', (req, res) => {
    const destinationUrl = req.body?.url;
    if (!isValidDestinationUrl(destinationUrl)) {
      return res.status(400).json({ error: 'Provide a valid absolute HTTP or HTTPS URL.' });
    }

    let code;
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
      // Six cryptographic random bytes provide 48 bits of entropy; retry on the unlikely event of a collision.
      const candidate = randomBytes(CODE_BYTES).toString('base64url');
      if (!links.has(candidate)) {
        code = candidate;
        break;
      }
    }

    if (!code) {
      return res.status(503).json({ error: 'Could not allocate a short code. Please try again.' });
    }

    // MVP storage is in memory and is cleared when the process restarts.
    links.set(code, destinationUrl);

    const base = shortUrlBase
      ? shortUrlBase.replace(/\/$/, '')
      : `${req.protocol}://${req.get('host')}`;

    return res.status(201).json({
      code,
      shortUrl: `${base}/${code}`,
      destinationUrl,
    });
  });

  app.get('/:code', (req, res, next) => {
    if (!/^[A-Za-z0-9_-]{1,32}$/.test(req.params.code)) return next();

    const destinationUrl = links.get(req.params.code);
    if (!destinationUrl) {
      return res.status(404).json({ error: 'Short link not found.' });
    }

    return res.redirect(302, destinationUrl);
  });

  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Request body must be valid JSON.' });
    }
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Request body is too large.' });
    }
    return res.status(500).json({ error: 'Internal server error.' });
  });

  return app;
}
