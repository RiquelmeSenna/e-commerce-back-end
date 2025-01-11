import { connection, model, Model, Schema, Types } from "mongoose"


export type Product = {
    name: string,
    price: number,
    description: string,
    brand: string,
    categoryId: Types.ObjectId,
    disponibility?: boolean,
    stock: number,
    filename: string
}

const productSchema = new Schema<Product>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    categoryId: [{ type: Types.ObjectId, ref: 'Category' }],
    disponibility: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    filename: { type: String, required: true }
})

const modelProductName = 'Product'

export default (connection && connection.models[modelProductName]) ?
    connection.models[modelProductName] as Model<Product> :
    model<Product>(modelProductName, productSchema)