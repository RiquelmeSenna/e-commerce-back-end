import { Types } from "mongoose";
import product, { Product } from "../models/productModel"
import { findUserByEmail } from "./user"
import category from "../models/categoryModel";

export const getAll = async (page: number) => {
    const products = await product.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $project: {
                _id: 0,
                __v: 0,
                categoryId: 0,
                category: {
                    _id: 0,
                    products: 0,
                    __v: 0
                }
            }
        },
        { $skip: (page - 1) * 12 },
        { $limit: 12, },
        {
            $addFields: { price: { $concat: [{ $toString: { $round: ['$price', 2] } }, ".99"] } }
        }
    ])
    if (!products || products.length == 0) {
        throw new Error('there is no product')
    }
    return products
}

export const getOne = async (id: string) => {
    const oneProduct = await product.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $project: {
                _id: 0,
                __v: 0,
                categoryId: 0,
                category: {
                    _id: 0,
                    products: 0,
                    __v: 0,
                }
            }
        },
        {
            $addFields: {
                price: { $concat: [{ $toString: { $round: ['$price', 2] } }, ".00"] }
            }
        }

    ])

    if (!oneProduct || oneProduct.length == 0) {
        throw new Error("We don't find this product")
    }

    return oneProduct
}

export const getProductsByName = async (name: string, page: number) => {
    const validPage = isNaN(page) || page < 1 ? 1 : page
    const products = await product.aggregate([
        {
            $match: { name: { $regex: '.*' + name + '.*', $options: 'i' } }
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $project: {
                _id: 0,
                __v: 0,
                categoryId: 0,
                category: {
                    _id: 0,
                    products: 0,
                    __v: 0,
                },
            }
        },
        { $skip: (validPage - 1) * 12, },
        { $limit: 12, },
        {
            $addFields: {
                price: { $concat: [{ $toString: { $round: ['$price', 2] } }, ".99"] }
            }
        },
    ])

    if (!products || products.length == 0) {
        throw new Error('Error in search product or not found products')
    }

    return products
}

export const addProduct = async (email: string, data: Product) => {
    const adminUser = await findUserByEmail(email)
    if (adminUser.admin == false) {
        throw new Error("User is not an admin")
    }

    const newProduct = await product.create({
        brand: data.brand,
        categoryId: data.categoryId,
        name: data.name,
        price: data.price,
        description: data.description, //Depois mudar esse objeto
        stock: data.stock
    })

    if (newProduct.stock < 1) {
        await product.findByIdAndUpdate(
            newProduct.id, { disponibility: false },
            { new: true }
        )
    }

    if (!newProduct) {
        throw new Error("Not possible create a product")
    }

    await category.findByIdAndUpdate(
        newProduct.categoryId,
        {
            $push: { products: newProduct.id },
        },
        { new: true }
    )

    return newProduct
}

export const updateProduct = async (email: string, id: string, data: Product) => {
    const adminUser = await findUserByEmail(email)

    if (adminUser.admin == false) {
        throw new Error("User is not an admin")
    };

    const updatedProduct = await product.findByIdAndUpdate(
        id,
        {
            name: data.name,
            price: data.price,
            disponibility: data.disponibility,
            description: data.description,
            brand: data.brand,
            categoryId: data.categoryId,
            stock: data.stock
        },
        { new: true }
    )

    if (!updatedProduct) {
        throw new Error('Is not possible update the product')
    }

    if (updatedProduct.stock < 1) {
        await product.findByIdAndUpdate(
            updatedProduct.id,
            { disponibility: false, },
            { new: true }
        )
    }
    if (updatedProduct.stock > 0) {
        await product.findByIdAndUpdate(
            updatedProduct.id,
            { disponibility: true, },
            { new: true }
        )
    }

    await category.findByIdAndUpdate(
        updatedProduct.categoryId,
        {
            $push: { products: updatedProduct.id }
        },
    )

    return updatedProduct
}

export const deleteProduct = async (email: string, id: string) => {
    const adminUser = await findUserByEmail(email)
    if (adminUser.admin == false) {
        throw new Error("User is not an admin")
    }

    const deleteProduct = await product.findByIdAndDelete(id)
    if (!deleteProduct) {
        throw new Error('Cannot possible delete product')
    }

    return deleteProduct
}