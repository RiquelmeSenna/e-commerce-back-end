import { connection, Date, model, Model, Schema, Types } from "mongoose"


type Order = {
    status?: string,
    items: [Types.ObjectId]
    createdAt: Date,
    totalPrice: number
}

const orderSchema = new Schema<Order>({
    status: { type: String, default: 'Processing...' },
    items: [{ type: Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
})

const modelOrderName = 'Order'

export default (connection && connection.models[modelOrderName]) ?
    connection.models[modelOrderName] as Model<Order> :
    model<Order>(modelOrderName, orderSchema)