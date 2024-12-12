import { Types } from "mongoose"
import cart from "../models/cartModel"
import { findUserByEmail } from "./user"

export const getCartUser = async (id: string) => {
    const cartUser = await cart.aggregate([
        { $match: { userId: new Types.ObjectId(id) } },
        { $unwind: '$item' },
        {
            $lookup: {
                from: 'products',
                localField: 'item',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $project: {
                _id: 0,
                userId: 0,
                item: 0,
                __v: 0,
                product: {
                    _id: 0,
                    categoryId: 0,
                    description: 0,
                    disponiblity: 0,
                    stock: 0,
                    __v: 0
                }
            }
        },
    ])

    return cartUser
}

export const calculateTotalPrice = async (cartUser: any) => {
    const totalPrice = cartUser.reduce((total, cartItem) => {
        const price = cartItem.product.reduce((sum, product) => sum + product.price, 0)
        return total + price
    }, 0)

    return totalPrice
}
export const getCart = async (email: string) => {
    const user = await findUserByEmail(email)

    const cartUser = await getCartUser(user.id)

    if (!cartUser) {
        throw new Error('Error')
    }

    console.log(`search cart for user: ${user.email}`)

    return cartUser
}


export const addProductInCart = async (email: string, idItem: string) => {
    const user = await findUserByEmail(email)
    const query = { userId: user.id }
    const products = await cart.findOneAndUpdate(query, { $push: { item: idItem } }, { new: true })
    if (!products) {
        throw new Error('Unable to add product in cart')
    }
    const cartUser = await getCartUser(user.id)
    const totalPrice = await calculateTotalPrice(cartUser)

    await cart.findOneAndUpdate(
        query,
        {
            $set: { qntd: products.item?.length, totalPrice }
        }
    )

    console.log(`Product added for user: ${user.email} `)

    return cartUser
}

export const removeProductInCart = async (email: string, idItem: string) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }

    const query = { userId: user.id };
    const cartDocument = await cart.findOne(query);

    if (!cartDocument) {
        throw new Error('Cart not found');
    }

    // Encontrar o índice do primeiro item correspondente
    const itemIndex = cartDocument.item?.indexOf(new Types.ObjectId(idItem))
    if (itemIndex === -1) {
        throw new Error('Item not found in cart');
    }

    // Usar $unset para remover o item pelo índice
    const unsetUpdate = { [`item.${itemIndex}`]: null };
    await cart.updateOne(query, { $unset: unsetUpdate });

    // Usar $pull para remover todos os valores "null"
    await cart.updateOne(query, { $pull: { item: null } });

    // Recalcular total e quantidade
    const cartUser = await getCartUser(user.id);
    const totalPrice = await calculateTotalPrice(cartUser);

    await cart.findOneAndUpdate(query, { $set: { qntd: cartUser.length, totalPrice } });

    console.log(`item removed for used: ${user.email}`)
    return cartUser;
}

export const clearCart = async (email: string) => {
    const user = await findUserByEmail(email)
    if (!user) {
        throw new Error('User not found');
    }

    const query = { userId: user.id }

    const cleanProduct = await cart.findOneAndUpdate(query, {
        $set:
            { item: [], qntd: 0, totalPrice: 0 }
    }, { new: true })

    console.log(`Cart cleared for user: ${user.email}`)
    return cleanProduct
}