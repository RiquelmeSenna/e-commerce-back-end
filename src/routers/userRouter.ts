import { Router } from "express";
import * as userController from '../controllers/userController'
import { middleware } from "../middleware/jwt";

export const userRouter = Router()

userRouter.get('/', middleware, userController.getUser)
userRouter.put('/', middleware, userController.updateUser)
userRouter.delete('/', middleware, userController.deleteUser)