import { RequestHandler } from "express"
import categoryModel from "../models/categoryModel"

export const getCategory: RequestHandler = async (req, res) => {
    const category = await categoryModel.find()

    res.json({ category })
}