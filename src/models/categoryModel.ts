import { connection, model, Model, Schema, Types } from "mongoose";

type Category = {
    name: string,
    products?: [Types.ObjectId]
};


const categorySchema = new Schema<Category>({
    name: { required: true, type: String },
    products: [{ type: Types.ObjectId, ref: 'Product' }]
})

const modelCategoryName = 'Category'

export default (connection && connection.models[modelCategoryName]) ?
    connection.models[modelCategoryName] as Model<Category> :
    model<Category>(modelCategoryName, categorySchema)