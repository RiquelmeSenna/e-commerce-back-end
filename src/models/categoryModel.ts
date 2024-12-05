import { connection, model, Model, Schema } from "mongoose";

type Category = {
    name: string
};


const categorySchema = new Schema<Category>({
    name: { required: true, type: String }
})

const modelCategoryName = 'Category'

export default (connection && connection.models[modelCategoryName]) ?
    connection.models[modelCategoryName] as Model<Category> :
    model<Category>(modelCategoryName, categorySchema)