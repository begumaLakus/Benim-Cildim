import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { z, ZodError } from 'zod';

import { prisma } from '../db';
import { sendZodError } from '../utils/zodError';
import { AuthenticatedRequest } from '../middleware/requireAuth';
import {
  AGE_RANGES,
  CreateRoutineHistoryRequestBody,
  LatestRoutineHistoryResponseBody,
  QuestionnaireAnswersDto,
  RoutineHistoryResponseBody,
  SKIN_CONCERNS,
  SKIN_TYPES,
  SkinSummaryDto,
} from '../types/routineHistory.types';

const questionnaireAnswersSchema = z.object({
  ageRange: z.enum(AGE_RANGES).nullable(),
  skinType: z.enum(SKIN_TYPES).nullable(),
  concerns: z.array(z.enum(SKIN_CONCERNS)),
  usesActiveIngredients: z.boolean().nullable(),
  hasKnownSensitivities: z.boolean().nullable(),
});

const routineStepSchema = z.object({
  id: z.string().trim().min(1, 'Rutin adiminin id alani gerekli.'),
  order: z.number().int().min(1, 'Rutin adimi sirasi 1 veya daha buyuk olmali.'),
  activeIngredient: z.string().trim().min(1, 'Aktif madde adi gerekli.'),
  productCategory: z.string().trim().min(1, 'Urun kategorisi gerekli.'),
  instructions: z.string().trim().min(1, 'Kullanim talimati gerekli.'),
});

const routinePlanSchema = z.object({
  morning: z.array(routineStepSchema),
  evening: z.array(routineStepSchema),
});

const createRoutineHistoryBodySchema = z.object({
  answers: questionnaireAnswersSchema,
  routine: routinePlanSchema,
});

/**
 * POST /api/routine-history — `requireAuth` arkasinda. Misafirken toplanan
 * anket cevaplarini/rutin onerisini hesaba kalici olarak baglar.
 */
export async function createRoutineHistory(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  let body: CreateRoutineHistoryRequestBody;
  try {
    body = createRoutineHistoryBodySchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      sendZodError(res, error);
      return;
    }
    throw error;
  }

  // Normalde hicbir zaman true olmaz (requireAuth zaten garanti eder) —
  // TypeScript'in tipini daraltmak ve olasi yanlis route baglamalarina
  // karsi acik bir guvenlik agi.
  if (!req.userId) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: "Oturum token'i eksik." });
    return;
  }

  try {
    const record = await prisma.routineHistory.create({
      data: {
        userId: req.userId,
        answersJson: JSON.stringify(body.answers),
        routineJson: JSON.stringify(body.routine),
      },
    });

    const responseBody: RoutineHistoryResponseBody = {
      id: record.id,
      createdAt: record.createdAt.toISOString(),
    };
    res.status(201).json(responseBody);
  } catch (error) {
    // P2003: foreign key kisitlamasi basarisiz — token gecerli ama arkasindaki
    // kullanici artik veritabaninda yok (orn. hesap silinmis). Bunu genel
    // hata isleyicisine (500) birakmak yerine acikca 401 donuyoruz.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      res.status(401).json({
        code: 'UNAUTHORIZED',
        message: "Oturum token'i gecersiz veya hesap artik mevcut degil.",
      });
      return;
    }
    throw error;
  }
}

/**
 * GET /api/routine-history/latest — en son kaydedilen rutini doner.
 * Kayit yoksa 404 doner; bu beklenen bir durum, hata degil.
 */
export async function getLatestRoutineHistory(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: "Oturum token'i eksik." });
    return;
  }

  const record = await prisma.routineHistory.findFirst({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    res.status(404).json({ code: 'NOT_FOUND', message: 'Henuz kayitli bir rutin bulunamadi.' });
    return;
  }

  // answersJson yazilirken zaten dogrulanmisti, burada tekrar dogrulanmiyor.
  const answers = JSON.parse(record.answersJson) as QuestionnaireAnswersDto;
  const skinSummary: SkinSummaryDto = {
    skinType: answers.skinType,
    concerns: answers.concerns,
  };

  const responseBody: LatestRoutineHistoryResponseBody = {
    routine: JSON.parse(record.routineJson),
    productSuggestion: null,
    generatedAt: record.createdAt.toISOString(),
    skinSummary,
  };
  res.status(200).json(responseBody);
}
