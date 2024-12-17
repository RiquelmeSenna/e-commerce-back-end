import { Types } from "mongoose"
import cart from "../models/cartModel"
import order from "../models/orderModel"
import userModel from "../models/userModel"
import { findUserByEmail } from "./user"

export const addOrder = async (email: string) => {
    const user = await findUserByEmail(email)
    const query = { userId: user.id }
    const cartUser = await cart.findOne(query)
    if (!cartUser) {
        console.log('Unable cart')
        throw new Error('Unable cart')
    }

    const buy = await order.create({
        createdAt: new Date(),
        items: cartUser?.item,
        totalPrice: cartUser.totalPrice
    })

    if (!buy) {
        throw new Error("Does't possible create an order")
    }

    await userModel.findByIdAndUpdate(
        user.id,
        {
            $push: { orders: buy.id }
        },
        { new: true }
    )

    await cart.findByIdAndUpdate(
        cartUser.id,
        {
            $set: {
                totalPrice: 0,
                item: [],
                qntd: 0
            }
        },
        { new: true }
    )
    return buy
}

export const getOrders = async (email: string) => {
    const userOrder = await userModel.aggregate([
        {
            $match: { email }
        },
        {
            $lookup: {
                from: 'orders',
                foreignField: '_id',
                localField: 'orders',
                as: 'orders'
            }
        },
        {
            $project: {
                _id: 0,
                email: 0,
                adress: 0,
                password: 0,
                admin: 0,
                token: 0,
                favorites: 0,
                __v: 0,
                orders: { __v: 0 }
            }
        }
    ])

    if (!userOrder) {
        throw new Error("Doens't find order")
    }

    return userOrder
}

export const getOrder = async (idOrder: string) => {
    const Order = await userModel.aggregate([
        {
            $match: { orders: new Types.ObjectId(idOrder) }
        },
        {
            $lookup: {
                from: 'orders', // Nome da coleção de pedidos
                let: { orderId: new Types.ObjectId(idOrder) }, // Define variável para filtrar
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$orderId'] } // Filtra apenas a ordem correspondente
                        }
                    },
                    {
                        $project: { // Remove campos indesejados
                            __v: 0
                        }
                    }
                ],
                as: 'order' // Resultado populado será armazenado aqui
            }
        },
        {
            $project: {
                _id: 0,
                name: 0,
                email: 0,
                password: 0,
                admin: 0,
                token: 0,
                favorites: 0,
                orders: 0,
                __v: 0,
                order: {
                    __v: 0
                }
            }
        }
    ])

    if (!Order) {
        throw new Error("order not found!")
    }

    return Order
}