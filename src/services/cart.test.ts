import { describe, test } from "@jest/globals";
import * as cartService from './cart'
import { config } from "dotenv";
import { mongoConnectTest } from "../database/mongo";
import mongoose from "mongoose";
config()


describe('should test services from cart', () => {
    beforeAll(async () => {
        await mongoConnectTest()
    })

    test('should get cart', async () => {
        const cart = await cartService.getCart('riquelmestayler@gmail.com')

        if (cart.length < 1) {
            expect(cart.length < 1).toBeTruthy
        }
        if (cart.length >= 1) {
            expect(cart.find(item => item)).toHaveProperty('qntd')
            expect(cart.find(item => item).qntd).toBeGreaterThanOrEqual(1)
        }
    })

    test("should add product by cart", async () => {
        const cart = await cartService.addProductInCart('riquelmestayler@gmail.com', '676eb79779a96b0dac288290')

        expect(cart.find(item => item).product[0].price).toBeGreaterThanOrEqual(1)
        expect(cart.length).toBeGreaterThanOrEqual(1)
    })

    test("should remove product by cart", async () => {
        const cart = await cartService.removeProductInCart('riquelmestayler@gmail.com', '676eb79779a96b0dac288290')

        expect(cart.length < 1).toBeTruthy()
    })

    test.skip('should clear all products from cart', async () => {
        const cart = await cartService.clearCart('riquelmestayler@gmail.com')
        console.log(cart?.qntd)
        expect(cart?.qntd).toEqual(0)
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})