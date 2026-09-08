import { Router } from 'express';

import { login, signUp } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/login', login);
