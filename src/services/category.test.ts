import { describe, test } from '@jest/globals'
import * as categoryService from './category'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import { mongoConnectTest } from '../database/mongo'
config()

//Adicionar informações manualmente

describe('should test services from category', () => {
    beforeAll(async () => {
        await mongoConnectTest()
    })

    test('should add new category', async () => {
        const newCategory = await categoryService.addCategory('riquelmestayler57@gmail.com', 'SSDs')

        expect(newCategory).toHaveProperty('name')
        expect(newCategory.name).toBe('SSDs')
    })

    test("should't add category if exist", async () => {
        await expect(
            categoryService.addCategory('riquelmestayler57@gmail.com', 'SSDs')
        ).rejects.toThrow('Category exist')
    })

    test('should find category by name', async () => {
        const category = await categoryService.findCategory('SSds')

        expect(category.name).toBe('SSDs')
    });

    test('should update category', async () => {
        const updatedCategory = await categoryService.updateCategory('riquelmestayler57@gmail.com', 'Placas de video', '676eeb3d73316b74cec91cf3')

        expect(updatedCategory.name).toBe('Placas de video')
    })

    test('should find products by category', async () => {
        const products = await categoryService.findProductByCategory('676eeb3d73316b74cec91cf3', 1)

        expect(products.length).toBeGreaterThanOrEqual(1)
    })

    test('should delete category', async () => {
        const deletedCategory = await categoryService.deleteCategory('riquelmestayler57@gmail.com', '676eeb3d73316b74cec91cf3')

        expect(deletedCategory.id).toBe('676eeb3d73316b74cec91cf3')
    })

    test("should't delete category if not exist", async () => {
        await expect(
            categoryService.deleteCategory('riquelmestayler57@gmail.com', '676eeb3d73316b74cec91cf3')
        ).rejects.toThrow("It's not possible delete this category")
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})