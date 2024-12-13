import { Response } from "express";
import { ExtendedRequest } from "../types/extendedRequest";
import * as cartService from '../services/cart'
import { cartProductSchema, cartSchema } from "../validations/cartSchema";

export const getCart = async (req: ExtendedRequest, res: Response) => {
    try {
        const cart = await cartService.getCart(req.userEmail)
        res.json({ cart })
    } catch (error) {
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}

export const addToCart = async (req: ExtendedRequest, res: Response) => {
    const safeData = cartProductSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: "Mande o id do produto!" })
    }

    try {
        const cart = await cartService.addProductInCart(req.userEmail, safeData.data.idProduct)
        res.status(201).json({ cart })
    } catch (error) {
        res.status(400).json({ error: 'Não foi possivel adicionar o produto ao carrinho!' })
    }
}

export const removeToCart = async (req: ExtendedRequest, res: Response) => {
    const safeData = cartProductSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: "Mande o id do produto!" })
    }

    try {
        const cart = await cartService.removeProductInCart(req.userEmail, safeData.data.idProduct)
        res.json({ cart })
    } catch (error) {
        res.status(400).json({ error: 'Error ao remover produto do carrinho' })
    }
}

export const clearCart = async (req: ExtendedRequest, res: Response) => {
    try {
        const cleanProduct = await cartService.clearCart(req.userEmail)

        res.json({ cleanProduct })
    } catch (error) {
        res.status(400).json({ error: 'Não foi possivel limpar o carrinho!' })
    }
}