import { Response } from "express"
import { ExtendedRequest } from "../types/extendedRequest"
import * as userService from "../services/user"
import { updateUserSchema } from "../validations/userSchema"
import bcrypt from 'bcrypt'
import { string } from "zod"

export const getUser = async (req: ExtendedRequest, res: Response) => {
    try {
        const user = await userService.findUserByEmail(req.userEmail)
        res.json({
            name: user.name,
            email: user.email,
            adress: user.adress,
            favorites: user.favorites,
            orders: user.orders
        })
    } catch (error) {
        res.json(400).json({ error: 'Ocorreu algum error!' })
    }
}

export const updateUser = async (req: ExtendedRequest, res: Response) => {
    const safeData = updateUserSchema.safeParse(req.body)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const updatedData = {
            adress: safeData.data.adress,
            email: safeData.data.email,
            name: safeData.data.name,
            password: (await userService.findUserByEmail(req.userEmail)).password
        }
        if (safeData.data.password) {
            updatedData.password = await bcrypt.hash(safeData.data.password as string, 10)
        }

        const user = await userService.updateUser(req.userEmail, updatedData)
        res.status(206).json({
            name: user.name,
            email: user.email,
            adress: user.adress,
            password: user.password
        })

    } catch (error) {
        res.status(400).json({ error: 'Ocorreu algum error' })
        console.log(error)
    }
}

export const deleteUser = async (req: ExtendedRequest, res: Response) => {
    try {
        await userService.deleteUser(req.userEmail)
        res.json({ user: 'successfully deleted' })
    } catch (error) {
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}