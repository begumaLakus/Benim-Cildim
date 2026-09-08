import { Request, Response } from 'express';
import { z, ZodError } from 'zod';

import { prisma } from '../db';
import { hashPassword, verifyPassword } from '../utils/password';
import { signAuthToken } from '../utils/jwt';
import { AuthResponseBody } from '../types/auth.types';

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email('Gecerli bir e-posta adresi gir.'),
  // KVKK/UX notu: Faz 1'de e-posta dogrulama yok (bkz. ADR-009) — bu yuzden
  // sifre kurallari en azindan kaba kuvvet saldirilarina karsi makul bir
  // taban cizgisi olsun diye 8 karakter zorunlu tutuluyor.
  password: z.string().min(8, 'Sifre en az 8 karakter olmali.'),
});

function sendZodError(res: Response, error: ZodError): void {
  const firstIssue = error.issues[0];
  res.status(400).json({
    code: 'VALIDATION_ERROR',
    message: firstIssue?.message ?? 'Gecersiz istek.',
  });
}

export async function signUp(req: Request, res: Response): Promise<void> {
  let credentials;
  try {
    credentials = credentialsSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      sendZodError(res, error);
      return;
    }
    throw error;
  }

  const existingUser = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (existingUser) {
    res.status(409).json({
      code: 'EMAIL_TAKEN',
      message: 'Bu e-posta ile zaten bir hesap var.',
    });
    return;
  }

  const passwordHash = await hashPassword(credentials.password);
  const user = await prisma.user.create({
    data: { email: credentials.email, passwordHash },
  });

  const token = signAuthToken({ userId: user.id });
  const body: AuthResponseBody = { token, user: { id: user.id, email: user.email } };
  res.status(201).json(body);
}

export async function login(req: Request, res: Response): Promise<void> {
  let credentials;
  try {
    credentials = credentialsSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      sendZodError(res, error);
      return;
    }
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { email: credentials.email } });

  // Kullanici bulunamadi ile sifre yanlis durumlarini KASITLI olarak ayni
  // mesajla donuyoruz — hangi e-postalarin kayitli oldugunu disariya sizdirmamak
  // icin (user enumeration'a karsi standart onlem).
  const invalidCredentialsResponse = {
    code: 'INVALID_CREDENTIALS',
    message: 'E-posta veya sifre hatali.',
  };

  if (!user) {
    res.status(401).json(invalidCredentialsResponse);
    return;
  }

  const passwordMatches = await verifyPassword(credentials.password, user.passwordHash);
  if (!passwordMatches) {
    res.status(401).json(invalidCredentialsResponse);
    return;
  }

  const token = signAuthToken({ userId: user.id });
  const body: AuthResponseBody = { token, user: { id: user.id, email: user.email } };
  res.status(200).json(body);
}
