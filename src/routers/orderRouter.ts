import { Router } from "express";
import * as orderController from '../controllers/orderController'

export const orderRouter = Router()

orderRouter.get('/', orderController.getOrders)
orderRouter.get('/:orderId', orderController.getOrder)
orderRouter.put('/:orderId', orderController.updateOrder)