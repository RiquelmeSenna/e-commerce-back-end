import { describe, test } from "@jest/globals";
import * as orderService from './order'
import { config } from "dotenv";
import { mongoConnectTest } from "../database/mongo";
import mongoose from "mongoose";
config()

describe('should test services from orders', () => {
    beforeAll(async () => {
        await mongoConnectTest()
    })

    test('should add order', async () => {
        const order = await orderService.addOrder('riquelmestayler@gmail.com')

        expect(order.totalPrice).toBeGreaterThanOrEqual(1)
    });

    test("should't add order cause don't have products", async () => {
        await expect(
            orderService.addOrder('riquelmestayler@gmail.com')
        ).rejects.toThrow('Add product in cart')
    })

    test('should get orders', async () => {
        const orders = await orderService.getOrders('riquelmestayler@gmail.com')

        expect(orders.find(item => item).orders[0].totalPrice).toBeGreaterThanOrEqual(1)
    })

    test('should get order from user', async () => {
        const order = await orderService.getOrder('677020b7e9f9694c352b7e92')

        expect(order.find(item => item).order[0].totalPrice).toBeGreaterThanOrEqual(1)
    })

    test('should update order', async () => {
        const updatedOrder = await orderService.updateOrder('riquelmestayler57@gmail.com', '677020b7e9f9694c352b7e92', 'completed')

        expect(updatedOrder.status).toBe('completed')
    })


    afterAll(() => {
        mongoose.connection.close()
    })
})