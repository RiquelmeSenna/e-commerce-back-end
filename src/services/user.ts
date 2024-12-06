import { jwtSign } from "../middleware/jwt"
import user, { User } from "../models/userModel"
import bcrypt from 'bcrypt'

export const signUp = async (data: User) => {
    const hasUser = await user.findOne({ email: data.email })
    if (hasUser) {
        throw new Error('User existing')
    }

    const password = await bcrypt.hash(data.password, 10)

    const newUser = await user.create({
        name: data.name,
        email: data.email,
        adress: data.adress,
        password,
        token: data.token
    })

    if (!newUser) {
        throw new Error('Not possible created User')
    }

    return newUser
}

export const signIn = async (email: string, password: string) => {
    const User = await user.findOne({ email })

    if (!User) {
        throw new Error('User not existing!')
    }

    const correctPassword = await bcrypt.compare(password, User.password)

    if (!correctPassword) {
        throw new Error('Password is incorrect')
    }

    return User
}