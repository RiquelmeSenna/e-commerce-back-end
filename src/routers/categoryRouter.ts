import { Router } from "express";
import * as categoryController from '../controllers/categoryController'
import { middleware } from "../auth/jwt";

export const categoryRouter = Router()

categoryRouter.get('/:idCategory', categoryController.findProductByCategory)
categoryRouter.post('/', middleware, categoryController.addCategory)
categoryRouter.put('/:idCategory', middleware, categoryController.updateCategory)
categoryRouter.delete('/:idCategory', middleware, categoryController.deleteCategory)