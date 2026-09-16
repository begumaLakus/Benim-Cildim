import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Express 4.x, async handler'larda throw edilen hatalari otomatik olarak
 * `errorHandler`'a yonlendirmez (yakalanmamis rejection olarak kalir, sureci
 * bile cokertebilir). Bu sarmalayici hatayi `next(error)` ile dogru zincire
 * yonlendirir — her yeni async route controller'i bununla kaydedilmeli.
 */
export function asyncHandler<Req extends Request = Request>(
  handler: (req: Req, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    handler(req as Req, res, next).catch(next);
  };
}
