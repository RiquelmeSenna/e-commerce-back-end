import { describe, test } from "@jest/globals";
import { mongoConnectTest } from "../database/mongo";
import * as productService from './product'
import mongoose, { Types } from "mongoose";
import { config } from 'dotenv'
import { Product } from "../models/productModel";
import { findCategory } from "./category";
config()


describe('should test products service', () => {
    beforeAll(async () => {
        await mongoConnectTest();
    });


    const product: Product = {
        brand: "Nvidia",
        name: 'RTX 4090 TI',
        categoryId: new Types.ObjectId('676c76e012f39b2f14216653'),
        description: 'RTX 4090 é foda parceiro',
        price: 2200,
        stock: 10
    }

    test('should create a new product', async () => {
        const newProduct = await productService.addProduct('riquelmestayler57@gmail.com', product)

        expect(newProduct).toHaveProperty('price');
        expect(newProduct.name).toBe(product.name)
    })

    test('should find all products', async () => {
        const page = '1'
        const products = await productService.getAll(parseInt(page))

        expect(products.find(item => item)).toHaveProperty('price')
        expect(products.length).toBeGreaterThanOrEqual(1)
    })

    test('should find one product', async () => {
        const oneProduct = await productService.getOne('676c7c2d11ce9de2b92f0c03')

        expect(oneProduct.find(item => item)).toHaveProperty('price')
        expect(oneProduct.length).toBe(1)
    })

    test('should find products by name', async () => {
        const productsName = await productService.getProductsByName('ti', 1)

        expect(productsName.find(item => item)).toHaveProperty('price')
        expect(productsName.length).toBeGreaterThanOrEqual(1)
    })

    test('should update product', async () => {
        const updatedProduct = await productService.updateProduct('riquelmestayler57@gmail.com', '676c7c2d11ce9de2b92f0c03',
            {
                brand: product.brand,
                categoryId: product.categoryId,
                description: product.description,
                name: product.name,
                price: 2100,
                stock: product.stock
            });

        expect(updatedProduct.price).toBe(2100);
        expect(updatedProduct).not.toBeInstanceOf(Error);
    })

    afterAll(async () => {
        mongoose.connection.close()
    })

})