import { Router } from "express";
import * as productController from '../controllers/productController'

export const productRouter = Router()

productRouter.get('/', productController.getProducts)
productRouter.get('/:productId', productController.getProduct)
productRouter.get('/search', productController.getProductByName)
productRouter.get('/:categoryId', productController.getProductByCategory)
productRouter.post('/', productController.addProduct)
productRouter.put('/:productId', productController.updateProduct)
productRouter.delete('/:productId', productController.deleteProduct)


