import { connection, model, Model, Schema, Types } from "mongoose"

type Cart = {
    userId: Types.ObjectId,
    item: [Types.ObjectId],
    qntd: number,
    totalPrice: number
}

const cartSchema = new Schema<Cart>({
    userId: [{ type: Types.ObjectId, ref: 'User' }],
    item: [{ type: Types.ObjectId, ref: 'Product' }],
    qntd: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
})

const modelCartName = 'Cart'

export default (connection && connection.models[modelCartName]) ?
    connection.models[modelCartName] as Model<Cart> :
    model<Cart>(modelCartName, cartSchema)