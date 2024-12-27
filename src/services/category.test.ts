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
        const newCategory = await categoryService.addCategory('riquelmestayler57@gmail.com', 'Fonte')

        expect(newCategory).toHaveProperty('name')
        expect(newCategory.name).toBe('Fonte')
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
        const updatedCategory = await categoryService.updateCategory('riquelmestayler57@gmail.com', 'Placas de video', '676ec9a7c76c2b4523dcea6c')

        expect(updatedCategory.name).toBe('Placas de video')
    })

    test('should find products by category', async () => {
        const products = await categoryService.findProductByCategory('676ec9a7c76c2b4523dcea6c', 1)

        expect(products.length).toBeGreaterThanOrEqual(1)
    })

    test('should delete category', async () => {
        const deletedCategory = await categoryService.deleteCategory('riquelmestayler57@gmail.com', '676ec9a7c76c2b4523dcea6c')

        expect(deletedCategory.id).toBe('676ec9a7c76c2b4523dcea6c')
    })

    test("should't delete category if not exist", async () => {
        await expect(
            categoryService.deleteCategory('riquelmestayler57@gmail.com', '676c76e012f39b2f14216653')
        ).rejects.toThrow("It's not possible delete this category")
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})