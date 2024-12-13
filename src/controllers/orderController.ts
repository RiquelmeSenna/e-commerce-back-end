import { Response } from "express";
import { ExtendedRequest } from "../types/extendedRequest";
import * as orderService from '../services/order'

export const addOrder = async (req: ExtendedRequest, res: Response) => {
    try {
        const order = await orderService.addOrder(req.userEmail)
        res.status(201).json({ order })
    } catch (error) {
        res.status(400).json({ error: 'Não foi possivel criar uma ordem' })
    }
}