import { Router } from "express";
import * as cartController from '../controllers/cartController'
import { middleware } from "../middleware/jwt";

export const cartRouter = Router()

cartRouter.get('/', middleware, cartController.getCart)
cartRouter.post('/:idProduct', middleware, cartController.addToCart)
//cartRouter.put('/idProduct', cartController.editTheCart)
cartRouter.delete('/delete', middleware, cartController.clearCart)
cartRouter.delete('/:idProduct', middleware, cartController.removeToCart)
//cartRouter.post('/finish', cartController.finishCart)
