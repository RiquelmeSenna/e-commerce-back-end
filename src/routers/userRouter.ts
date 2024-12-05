import { Router } from "express";
import * as userController from '../controllers/userController'

export const userRouter = Router()

userRouter.get('/:id', userController.getUser)
userRouter.put('/:id', userController.updateUser)
userRouter.delete('/:id', userController.deleteUser)