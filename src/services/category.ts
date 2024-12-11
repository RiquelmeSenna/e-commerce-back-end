import { Types } from "mongoose"
import category from "../models/categoryModel"
import { findUserByEmail } from "./user"

export const addCategory = async (email: string, name: String) => {
    const user = await findUserByEmail(email)
    if (user.admin == false) {
        throw new Error('User is not an admin')
    }

    const newCategory = await category.create({ name })
    if (!newCategory) {
        throw new Error("It's not possible create a new category")
    }
    return newCategory
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

export const deleteCategory = async (email: string, id: string) => {
    const user = await findUserByEmail(email)
    if (user.admin == false) {
        throw new Error('User is not an admin')
    }

    const deletedCategory = await category.findByIdAndDelete(id)
    if (!deletedCategory) {
        throw new Error("It's not possible delete this category")
    }

    return deletedCategory
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
                                __v: 0
                            }
                        }
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