import dotenv from 'dotenv';

// Bilerek burada, diger import'lardan once: `./app` -> `./utils/jwt`
// zincirinde JWT_SECRET, MODUL YUKLENIRKEN (import aninda) okunuyor. Bu
// import satiri dotenv.config()'ten once olsaydi JWT_SECRET henuz process.env'e
// yazilmamis olurdu. TypeScript'in commonjs ciktisinda import'lar metinsel
// sirayla require()'a cevrildigi icin bu sira calisiyor.
dotenv.config();

import { createApp } from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Benim Cildim backend http://localhost:${PORT} adresinde calisiyor.`);
});
