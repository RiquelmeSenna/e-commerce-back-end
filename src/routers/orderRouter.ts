import { Router } from "express";
import { middleware } from "../auth/jwt";
import * as orderController from '../controllers/orderController'

export const orderRouter = Router()

orderRouter.post('/', middleware, orderController.addOrder)
orderRouter.get('/', middleware, orderController.getOrders)
orderRouter.get('/:orderId', middleware, orderController.getOrder)
orderRouter.put('/:orderId', middleware, orderController.updateOrder)