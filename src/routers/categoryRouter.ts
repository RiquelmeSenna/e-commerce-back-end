import { Router } from "express";
import * as categoryController from '../controllers/categoryController'

export const categoryRouter = Router()

categoryRouter.post('/', categoryController.addCategory)
categoryRouter.put('/:idCategory', categoryController.updateCategory)
categoryRouter.delete('/:idCategory', categoryController.deleteCategory)