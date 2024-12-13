import { Router } from "express";
import { middleware } from "../middleware/jwt";
import * as orderController from '../controllers/orderController'

export const orderRouter = Router()

orderRouter.post('/', middleware, orderController.addOrder)
//orderRouter.get('/', orderController.getOrders)
//orderRouter.get('/:orderId', orderController.getOrder)
//orderRouter.put('/:orderId', orderController.updateOrder)