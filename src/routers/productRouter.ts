import { Router } from "express";
import * as productController from '../controllers/productController'
import { middleware } from "../auth/jwt";
import { upload } from "../libs/multer";

export const productRouter = Router()

productRouter.get('/', productController.getProducts)
productRouter.get('/unique/:productId', productController.getOne)
productRouter.get('/search', productController.getProductsByName)
productRouter.post('/', middleware, upload.single('photos'), productController.addProduct)
productRouter.put('/toogleFavorite/:productId', middleware, productController.toggleFavoriteProduct)
productRouter.put('/:productId', middleware, productController.updateProduct)
productRouter.delete('/:productId', middleware, productController.deleteProduct)
