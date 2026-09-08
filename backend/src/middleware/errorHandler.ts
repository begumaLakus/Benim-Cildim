import { NextFunction, Request, Response } from 'express';

/**
 * Express'in son middleware'i: controller'larda yakalanmayan (beklenmeyen)
 * hatalari 500 olarak doner, konsola loglar. Hata detayini istemciye asla
 * sizdirmaz.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  // eslint benzeri araclar 4 parametreli imzayi Express hata middleware'i
  // olarak tanimasi icin `next` burada kullanilmasa da imzada kalmali.
  _next: NextFunction,
): void {
  // eslint-disable-next-line no-console
  console.error('Beklenmeyen sunucu hatasi:', error);
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Beklenmeyen bir hata olustu.' });
}
