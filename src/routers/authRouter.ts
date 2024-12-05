import { Router } from "express";
import * as authController from '../controllers/authController'

export const authRouter = Router()

authRouter.post('/signin' authController.signin)
authRouter.post('/signup', authController.signup)