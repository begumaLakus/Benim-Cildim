import { NextFunction, Request, Response } from 'express';

/**
 * `express.json()` gecersiz JSON govdesinde bu sekle sahip bir hata firlatir.
 * `instanceof SyntaxError` tek basina yeterli degil, body-parser'a ozgu
 * `type` alanini da kontrol ediyoruz ki istemci 500 yerine dogru 400 gorsun.
 */
function isBodyParserJsonSyntaxError(
  error: unknown,
): error is SyntaxError & { status: number; type: string } {
  return (
    error instanceof SyntaxError &&
    'type' in error &&
    (error as { type?: unknown }).type === 'entity.parse.failed'
  );
}

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
  if (isBodyParserJsonSyntaxError(error)) {
    res.status(400).json({
      code: 'INVALID_JSON',
      message: 'Istek govdesi gecerli bir JSON degil.',
    });
    return;
  }

  // eslint-disable-next-line no-console
  console.error('Beklenmeyen sunucu hatasi:', error);
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Beklenmeyen bir hata olustu.' });
}
