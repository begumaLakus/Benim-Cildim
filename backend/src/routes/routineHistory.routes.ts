import { Router } from 'express';

import {
  createRoutineHistory,
  getLatestRoutineHistory,
} from '../controllers/routineHistory.controller';
import { requireAuth } from '../middleware/requireAuth';
import { asyncHandler } from '../utils/asyncHandler';

export const routineHistoryRouter = Router();

routineHistoryRouter.post('/', requireAuth, asyncHandler(createRoutineHistory));
routineHistoryRouter.get('/latest', requireAuth, asyncHandler(getLatestRoutineHistory));
