import { Router } from "express";
import * as productController from '../controllers/productController'
import { middleware } from "../middleware/jwt";

export const productRouter = Router()

productRouter.get('/', productController.getProducts)
productRouter.get('/unique/:productId', productController.getOne)
productRouter.get('/search', productController.getProductsByName)
productRouter.post('/', middleware, productController.addProduct)
productRouter.put('/:productId', middleware, productController.updateProduct)
productRouter.delete('/:productId', middleware, productController.deleteProduct)


