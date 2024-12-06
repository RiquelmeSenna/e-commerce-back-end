import { RequestHandler } from 'express'
import * as userService from '../services/user'
import { loginSchema, registerSchema } from '../validations/userSchema'
import { jwtSign } from '../middleware/jwt'

export const signup: RequestHandler = async (req, res) => {
    const safeData = registerSchema.safeParse(req.body)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const token = jwtSign(safeData.data.email)

        const user = await userService.signUp({
            adress: safeData.data.adress,
            email: safeData.data.email,
            name: safeData.data.name,
            password: safeData.data.password,
            token
        })

        res.status(201).json({
            Name: user.name,
            Email: user.email,
            Token: user.token
        })
    } catch (error) {
        res.status(401).json({ error: "Ocorreu algum error ao fazer a inscrição" })
    }
}

export const signin: RequestHandler = async (req, res) => {
    const safeData = loginSchema.safeParse(req.body)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const user = await userService.signIn(safeData.data.email, safeData.data.password)
        res.json({
            Name: user.name,
            Email: user.email,
            Token: user.token
        })
    } catch (error) {
        res.status(401).json({ error: 'Usuario/Senha incorreta!' })
    }
}