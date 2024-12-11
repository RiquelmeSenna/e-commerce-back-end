import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string({ message: 'Mande um nome' }).min(2, { message: 'Nome da categoria deve ter no minimo de 2 caracteres' })
})

export const categorySchema = z.object({
    idCategory: z.string({ message: 'Mande o id' })
})