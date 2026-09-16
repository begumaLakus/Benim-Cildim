import { Response } from 'express';
import { ZodError } from 'zod';

/** Zod validasyon hatasinin ilk sorununu `{ code, message }` govdesiyle 400 olarak doner. */
export function sendZodError(res: Response, error: ZodError): void {
  const firstIssue = error.issues[0];
  res.status(400).json({
    code: 'VALIDATION_ERROR',
    message: firstIssue?.message ?? 'Gecersiz istek.',
  });
}
