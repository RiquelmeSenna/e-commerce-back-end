import { Router } from "express";
import * as cartController from '../controllers/cartController'
import { middleware } from "../middleware/jwt";

export const cartRouter = Router()

cartRouter.get('/', middleware, cartController.getCart)
cartRouter.post('/:idProduct', middleware, cartController.addToCart)
//cartRouter.put('/idProduct', cartController.editTheCart)
cartRouter.delete('/:idProduct', middleware, cartController.removeToCart)
//cartRouter.delete('/delete', cartController.clearCart)
//cartRouter.post('/finish', cartController.finishCart)
