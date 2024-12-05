import { connection, Date, model, Model, Schema, Types } from "mongoose"


type Order = {
    userId: Types.ObjectId,
    status: string,
    items: [Types.ObjectId]
    createdAt: Date,
    totalPrice: number
}

const orderSchema = new Schema<Order>({
    userId: [{ types: Types.ObjectId, ref: 'User' }],
    status: { type: String, required: true },
    items: [{ type: Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, required: true },
    totalPrice: { type: Number, required: true }
})

const modelOrderName = 'Order'

export default (connection && connection.models[modelOrderName]) ?
    connection.models[modelOrderName] as Model<Order> :
    model<Order>(modelOrderName, orderSchema)