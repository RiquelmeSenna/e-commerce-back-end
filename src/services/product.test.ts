import { describe, test } from "@jest/globals";
import { mongoConnectTest } from "../database/mongo";
import * as productService from './product'
import mongoose, { Types } from "mongoose";
import { config } from 'dotenv'
import { Product } from "../models/productModel";
import { findCategory } from "./category";
config()


describe('should test service from products', () => {
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
        //id do produto tem que se passado manualmente
        const oneProduct = await productService.getOne('676eb79779a96b0dac288290')

        expect(oneProduct.find(item => item)).toHaveProperty('price')
        expect(oneProduct.length).toBe(1)
    })

    test('should find products by name', async () => {
        const productsName = await productService.getProductsByName('ti', 1)

        expect(productsName.find(item => item)).toHaveProperty('price')
        expect(productsName.length).toBeGreaterThanOrEqual(1)
    })

    test('should update product', async () => {
        //id do produto tem que ser passado manualmente
        const updatedProduct = await productService.updateProduct('riquelmestayler57@gmail.com', '676eb79779a96b0dac288290',
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

    test('should add product favorite', async () => {
        //id do produto tem que ser passado manualmente
        const userHasFavorite = await productService.addFavorite('676eb79779a96b0dac288290', 'riquelmestayler57@gmail.com')

        expect(userHasFavorite).toHaveProperty('favorites');
    })

    test('should check if product has favorite', async () => {
        //id do produto tem que ser passado manualmente
        const product = await productService.chechIfProductHasFavorite('riquelmestayler57@gmail.com', '676eb79779a96b0dac288290')

        expect(product).toBeTruthy()
    })

    test('should remove product favorite', async () => {
        //id do produto tem que ser passado manualmente
        const removedProduct = await productService.removeFavorite('676eb79779a96b0dac288290', 'riquelmestayler57@gmail.com')

        expect(removedProduct).toHaveProperty('favorites');
        expect(removedProduct.favorites).not.toContain('676eb79779a96b0dac288290')
    })

    test("should check if product has't favorite", async () => {
        //id do produto tem que ser passado manualmente
        const product = await productService.chechIfProductHasFavorite('riquelmestayler57@gmail.com', '676eb79779a96b0dac288290')

        expect(product).toBeFalsy()
    })

    test('should delete product', async () => {
        //id do produto tem que ser passado manualmente
        const product = await productService.deleteProduct('riquelmestayler57@gmail.com', '676eeb3fc9324f51ceb2deb3')

        expect(product.id).toContain('676eeb3fc9324f51ceb2deb3')
    })

    test("should't delete product cause he don't found product", async () => {
        //id do produto tem que ser passado manualmente
        await expect(
            productService.deleteProduct('riquelmestayler57@gmail.com', '676ebb3030239404df73afdf')
        ).rejects.toThrow('Cannot possible delete product')
    })

    afterAll(async () => {
        mongoose.connection.close()
    })

})