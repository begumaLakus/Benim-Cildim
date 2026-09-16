import { Router } from 'express';

import {
  getRoutineProgress,
  toggleRoutineProgress,
} from '../controllers/routineProgress.controller';
import { requireAuth } from '../middleware/requireAuth';
import { asyncHandler } from '../utils/asyncHandler';

export const routineProgressRouter = Router();

routineProgressRouter.get('/', requireAuth, asyncHandler(getRoutineProgress));
routineProgressRouter.post('/toggle', requireAuth, asyncHandler(toggleRoutineProgress));
