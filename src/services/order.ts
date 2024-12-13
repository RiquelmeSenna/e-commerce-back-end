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