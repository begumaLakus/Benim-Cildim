import { Router } from 'express';

import { login, signUp } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';

export const authRouter = Router();

authRouter.post('/sign-up', asyncHandler(signUp));
authRouter.post('/login', asyncHandler(login));
