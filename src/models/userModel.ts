import { connection, Model, model, Schema, Types } from "mongoose"

type User = {
    name: string,
    email: string,
    adress: string,
    password: string,
    orders?: [Types.ObjectId]
    favorites?: [Types.ObjectId]
    admin?: boolean,
    token: string,
}

const UserSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    adress: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    token: { type: String, required: true, unique: true },
    favorites: [{ type: Types.ObjectId, ref: 'Product' }],
    orders: [{ type: Types.ObjectId, ref: 'Order' }]
})

const modelUserName = 'User'

export default (connection && connection.models[modelUserName]) ?
    connection.models[modelUserName] as Model<User> :
    model<User>(modelUserName, UserSchema)