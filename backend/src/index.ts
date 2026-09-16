import dotenv from 'dotenv';

// Bilerek burada, diger import'lardan once: `./app` -> `./utils/jwt` zincirinde
// JWT_SECRET modul yuklenirken okunuyor, dotenv.config() sonrasi calismali.
dotenv.config();

import { createApp } from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Benim Cildim backend http://localhost:${PORT} adresinde calisiyor.`);
});
