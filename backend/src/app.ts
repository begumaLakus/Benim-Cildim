import cors from 'cors';
import express, { Express } from 'express';

import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);

  // Bilinmeyen route — RN tarafinda 404'u ayirt edebilmek icin JSON doner.
  app.use((_req, res) => {
    res.status(404).json({ code: 'NOT_FOUND', message: 'Route bulunamadi.' });
  });

  app.use(errorHandler);

  return app;
}
