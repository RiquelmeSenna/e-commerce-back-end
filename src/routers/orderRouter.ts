import { Router } from "express";
import { middleware } from "../middleware/jwt";
import * as orderController from '../controllers/orderController'

export const orderRouter = Router()

orderRouter.post('/', middleware, orderController.addOrder)
orderRouter.get('/', middleware, orderController.getOrders)
orderRouter.get('/:orderId', middleware, orderController.getOrder)
//orderRouter.put('/:orderId', orderController.updateOrder)