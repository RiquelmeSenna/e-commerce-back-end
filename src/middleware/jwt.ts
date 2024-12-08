import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ExtendedRequest } from '../types/extendedRequest'
import { findUserByToken } from '../services/user'

export const jwtSign = (email: string) => {
    return jwt.sign(email, process.env.SECRET_KEY as string)
}

export const middleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const header = req.headers['authorization']
    if (!header) return res.status(401).json({ error: 'Mande um header' })

    const token = header.split(' ')[1]
    const verify = jwt.verify(token, process.env.SECRET_KEY as string,
        async (error, decoded) => {
            if (error) return res.status(401).json({ error: 'Mande um token válido' })
            try {
                const user = await findUserByToken(token)
                req.userEmail = user.email

                next()
            } catch (error) {
                res.status(401).json({ error: 'Usuario inexistente!' })
            }

        }
    )
}