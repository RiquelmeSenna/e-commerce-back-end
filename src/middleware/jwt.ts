import jwt from 'jsonwebtoken'

export const jwtSign = (email: string) => {
    return jwt.sign(email, process.env.SECRET_KEY as string)
}