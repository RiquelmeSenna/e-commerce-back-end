import { RequestHandler, Response } from 'express'
import * as productService from '../services/product'
import * as productSchema from '../validations/productSchema'
import { ExtendedRequest } from '../types/extendedRequest'
import { Types } from 'mongoose'


export const getProducts: RequestHandler = async (req, res) => {
    const { page } = req.query
    try {
        const products = await productService.getAll(parseInt(page as string))
        res.json({ products })
    } catch (error) {
        res.status(400).json({ error: 'Não há produtos' })
        console.log(error)
    }
}

export const getOne: RequestHandler = async (req, res) => {
    const { page } = req.query
    const safeData = productSchema.productIdSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const product = await productService.getOne(safeData.data.productId)
        res.json({ product })
    } catch (error) {
        res.status(400).json({ error: 'Não foi possivel acessar este produto!' })
    }
}

export const getProductsByName = async (req: ExtendedRequest, res: Response) => {
    const { name, page } = req.query

    try {
        const product = await productService.getProductsByName(name as string, parseInt(page as string))
        res.json({ product })
    } catch (error) {
        res.status(400).json({ error: 'Não encontramos nenhum produto com esse nome' })
        console.log(error)
    }
}

export const addProduct = async (req: ExtendedRequest, res: Response) => {
    const safeData = productSchema.newProductSchema.safeParse(req.body)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const product = await productService.addProduct(req.userEmail, {
            brand: safeData.data.brand,
            categoryId: safeData.data.categoryId as any,
            description: safeData.data.description,
            name: safeData.data.name,
            price: safeData.data.price,
            stock: safeData.data.stock
        })

        res.json({ product })
    } catch (error) {
        res.status(400).json({ error: "Ocorreu algum error" })
    }
}

export const updateProduct = async (req: ExtendedRequest, res: Response) => {
    const safeData = productSchema.updateProductSchema.safeParse(req.body);
    const safeDataQuery = productSchema.productIdSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }
    if (!safeDataQuery.success) {
        return res.status(400).json({ error: safeDataQuery.error.flatten().fieldErrors })
    }
    try {
        const updatedProduct = await productService.updateProduct(req.userEmail, safeDataQuery.data.productId, {
            brand: safeData.data.brand as string,
            categoryId: safeData.data.categoryId as any,
            description: safeData.data.description as string,
            name: safeData.data.name as string,
            price: safeData.data.price as number,
            stock: safeData.data.stock as number,
            disponibility: safeData.data.disponibility
        })
        res.status(206).json({ updatedProduct })
    } catch (error) {
        res.status(200).json({ error: 'Não foi possivel atualizar este produto!' })
        console.log(error)
    }
}

export const deleteProduct = async (req: ExtendedRequest, res: Response) => {
    const safeData = productSchema.productIdSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const userDeleted = await productService.deleteProduct(req.userEmail, safeData.data.productId)
        res.json({ Deleted: 'Produto deletado com sucesso!' })
    } catch (error) {
        res.status(400).json({ error: 'Algum erro ao excluir!' })
    }
}