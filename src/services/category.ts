import { Types } from "mongoose"
import category from "../models/categoryModel"
import { findUserByEmail } from "./user"
import productModel from "../models/productModel"

export const addCategory = async (email: string, name: String) => {
    const user = await findUserByEmail(email)
    if (user.admin == false) {
        throw new Error('User is not an admin')
    }

    const hasCategory = await category.findOne({ name })

    if (hasCategory) {
        throw new Error('Category exist')
    }

    const newCategory = await category.create({ name })
    if (!newCategory) {
        throw new Error("It's not possible create a new category")
    }
    return newCategory
}

export const findCategory = async (name: string) => {
    const Category = await category.findOne({ name: { $regex: new RegExp("^" + name.toLowerCase(), 'i') } })

    if (!Category) {
        throw new Error('Cannot found the category')
    }

    return Category
}

export const updateCategory = async (email: string, name: string, id: string) => {
    const user = await findUserByEmail(email)
    if (user.admin == false) {
        throw new Error('User is not an admin')
    }

    const updatedCategory = await category.findByIdAndUpdate(id, { name }, { new: true })
    if (!updatedCategory) {
        throw new Error("It's not possible update this category")
    }
    return updatedCategory
}

export const findProductByCategory = async (id: string, page: number) => {
    const validPage = isNaN(page) || page < 1 ? 1 : page

    const productsByCategories = await category.aggregate([
        {
            $match: { _id: new Types.ObjectId(id) }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'products'
            },
        },
        {
            $unwind: '$products'
        },
        {
            $facet: {
                metadata: [{ $count: 'total' }],
                data: [
                    { $skip: (validPage - 1) * 12 },
                    { $limit: 12 },
                    {
                        $project: {
                            _id: 0,
                            __v: 0,
                            products: {
                                _id: 0,
                                categoryId: 0,
                                __v: 0,
                            }
                        }
                    },
                    {
                        $addFields: { 'products.filename': { $concat: ['http://localhost:3000/', '$products.filename',] } }
                    }
                ]
            }
        },
        {
            $project: {
                produtos: { $arrayElemAt: ["$metadata.total", 0] },
                products: '$data'
            }
        }
    ]);



    if (!productsByCategories) {
        throw new Error('error when searching category')
    }

    return productsByCategories
}

export const deleteCategory = async (email: string, id: string) => {
    const user = await findUserByEmail(email)
    if (user.admin == false) {
        throw new Error('User is not an admin')
    }

    const deletedCategory = await category.findByIdAndDelete(id)
    if (!deletedCategory) {
        throw new Error("It's not possible delete this category")
    }

    await productModel.findByIdAndUpdate(
        deletedCategory.products?.filter(item => item.id),
        { $pull: { categoryId: deletedCategory.id } }
    )

    return deletedCategory
}