import { Response } from "express";
import { ExtendedRequest } from "../types/extendedRequest";
import * as orderService from '../services/order'
import { orderSchema } from "../validations/orderSchema";

export const addOrder = async (req: ExtendedRequest, res: Response) => {
    try {
        const order = await orderService.addOrder(req.userEmail)
        res.status(201).json({ order })
    } catch (error) {
        res.status(400).json({ error: 'Não foi possivel criar uma ordem' })
    }
}

export const getOrders = async (req: ExtendedRequest, res: Response) => {
    try {
        const orders = await orderService.getOrders(req.userEmail)
        res.json({ orders })
    } catch (error) {
        res.status(400).json({ error: "Não foi possivel achar as ordens" })
    }
}

export const getOrder = async (req: ExtendedRequest, res: Response) => {
    const safeData = orderSchema.safeParse(req.params)
    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const order = await orderService.getOrder(safeData.data?.orderId as string)
        res.json({ order })
    } catch (error) {
        res.status(400).json({ error: 'Não foi possivel achar a ordem' })
    }
}

export const updateOrder = async (req: ExtendedRequest, res: Response) => {
    const { status } = req.body
    const safeData = orderSchema.safeParse(req.params)
    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const order = await orderService.updateOrder(req.userEmail, safeData.data?.orderId as string, status)
        res.status(202).json(order)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Não foi possivel atualizar!' })
    }
}