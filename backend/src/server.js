import { createApp } from './app.js';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const app = createApp({ shortUrlBase: process.env.SHORT_URL_BASE });

app.listen(port, () => {
  console.log(`URL shortener API listening on port ${port}`);
});
