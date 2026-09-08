import { NextFunction, Request, Response } from 'express';

import { verifyAuthToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

/**
 * Simdilik hicbir route bunu kullanmiyor (Faz 1'de sadece auth uclari var) —
 * ama RoutineHistory kaydetme/okuma uclari eklenince (bkz. ADR-009, madde 7)
 * dogrudan buraya baglanacak. Onceden hazirlamak, o ucları eklerken auth
 * mantigini tekrar yazmayi/kopyalamayi onluyor.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

  if (!token) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: "Oturum token'i eksik." });
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res
      .status(401)
      .json({ code: 'UNAUTHORIZED', message: "Oturum token'i gecersiz veya suresi dolmus." });
  }
}
