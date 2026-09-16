import { Response } from 'express';
import { z, ZodError } from 'zod';

import { prisma } from '../db';
import { sendZodError } from '../utils/zodError';
import { AuthenticatedRequest } from '../middleware/requireAuth';
import {
  RoutineProgressResponseBody,
  ToggleRoutineProgressRequestBody,
} from '../types/routineProgress.types';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const dateQuerySchema = z.object({
  date: z.string().regex(DATE_KEY_PATTERN, "date 'YYYY-MM-DD' formatinda olmali."),
});

const toggleBodySchema = z.object({
  date: z.string().regex(DATE_KEY_PATTERN, "date 'YYYY-MM-DD' formatinda olmali."),
  stepId: z.string().trim().min(1, 'stepId gerekli.'),
});

/**
 * GET /api/routine-progress?date=YYYY-MM-DD — o gun icin isaretli adim
 * id'lerini doner. Hic isaretleme yoksa BOS DIZI doner, 404 degil.
 */
export async function getRoutineProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: "Oturum token'i eksik." });
    return;
  }

  let query: { date: string };
  try {
    query = dateQuerySchema.parse(req.query);
  } catch (error) {
    if (error instanceof ZodError) {
      sendZodError(res, error);
      return;
    }
    throw error;
  }

  const rows = await prisma.routineProgress.findMany({
    where: { userId: req.userId, date: query.date },
    select: { stepId: true },
  });

  const responseBody: RoutineProgressResponseBody = {
    date: query.date,
    completedStepIds: rows.map((row: { stepId: string }) => row.stepId),
  };
  res.status(200).json(responseBody);
}

/**
 * POST /api/routine-progress/toggle — (date, stepId) ikilisini isaretler/
 * kaldirir (tersine cevirir) ve o gun icin guncel tam listeyi doner.
 */
export async function toggleRoutineProgress(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: "Oturum token'i eksik." });
    return;
  }

  let body: ToggleRoutineProgressRequestBody;
  try {
    body = toggleBodySchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      sendZodError(res, error);
      return;
    }
    throw error;
  }

  const userId = req.userId;
  const { date, stepId } = body;

  const existing = await prisma.routineProgress.findUnique({
    where: { userId_date_stepId: { userId, date, stepId } },
  });

  if (existing) {
    await prisma.routineProgress.delete({
      where: { userId_date_stepId: { userId, date, stepId } },
    });
  } else {
    await prisma.routineProgress.create({
      data: { userId, date, stepId },
    });
  }

  const rows = await prisma.routineProgress.findMany({
    where: { userId, date },
    select: { stepId: true },
  });

  const responseBody: RoutineProgressResponseBody = {
    date,
    completedStepIds: rows.map((row: { stepId: string }) => row.stepId),
  };
  res.status(200).json(responseBody);
}
