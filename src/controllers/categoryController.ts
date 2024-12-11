import { Response } from "express"
import { ExtendedRequest } from "../types/extendedRequest"
import { categorySchema, createCategorySchema } from "../validations/categorySchema"
import * as categoryService from '../services/category'

export const addCategory = async (req: ExtendedRequest, res: Response) => {
    const safeData = createCategorySchema.safeParse(req.body)
    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }
    try {
        const newCategory = await categoryService.addCategory(req.userEmail, safeData.data?.name as string)
        res.status(201).json({ newCategory })
    } catch (error) {
        res.status(400).json({ error: 'Não foi possivel criar uma nova categoria!' })
    }
}

export const updateCategory = async (req: ExtendedRequest, res: Response) => {
    const safeData = createCategorySchema.safeParse(req.body)
    const safeDataParams = categorySchema.safeParse(req.params)
    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }
    if (!safeDataParams.success) {
        res.status(400).json({ error: safeDataParams.error.flatten().fieldErrors })
    }
    try {
        const updatedCategory = await categoryService.updateCategory(req.userEmail, safeData.data?.name as string, safeDataParams.data?.idCategory as string)
        res.status(201).json({ updatedCategory })
    } catch (error) {
        res.status(400).json({ error: 'Não foi possivel atualizar a categoria!' })
    }
}

export const deleteCategory = async (req: ExtendedRequest, res: Response) => {
    const safeData = categorySchema.safeParse(req.params)
    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const updatedCategory = await categoryService.deleteCategory(req.userEmail, safeData.data?.idCategory as string)
        res.json({ Msg: 'Deletado com sucesso!' })
    } catch (error) {
        res.status(400).json({ error: 'Não foi possive deletar esta categoria!' })
    }
}

export const findProductByCategory = async (req: ExtendedRequest, res: Response) => {
    const { page } = req.query
    const safeData = categorySchema.safeParse(req.params)
    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const products = await categoryService.findProductByCategory(safeData.data?.idCategory as string, parseInt(page as string))
        res.json({ products })
    } catch (error) {
        res.status(400).json({ error: 'Error ao procurar por está categoria!' })
    }
}