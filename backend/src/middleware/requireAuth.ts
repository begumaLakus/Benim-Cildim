import { NextFunction, Request, Response } from 'express';

import { verifyAuthToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

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
