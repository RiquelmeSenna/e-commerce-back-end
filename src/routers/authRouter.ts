import { Router } from "express";
import * as authController from '../controllers/authController'

export const authRouter = Router()

authRouter.post('/signup', authController.signup)
authRouter.post('/signin', authController.signin)