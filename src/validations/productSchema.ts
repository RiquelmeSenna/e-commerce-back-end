import { z } from "zod";

export const productIdSchema = z.object({
    productId: z.string({ message: 'Mande o id!' })
})

export const newProductSchema = z.object({
    brand: z.string(({ message: "Mande uma marca" })).min(2),
    category: z.string({ message: 'Mande uma categoria' }),
    name: z.string({ message: 'Mande um nome' }),
    price: z.string({ message: 'Mande um valor' }),
    description: z.string({ message: "Mande uma descrição" }).min(2, { message: 'No minimo de 2 caracteres' }),
    stock: z.string({ message: 'Mande o estoque' }),

})

export const updateProductSchema = z.object({
    brand: z.string().min(2).optional(),
    categoryId: z.string().optional(),
    name: z.string().optional(),
    price: z.number().optional(),
    description: z.string().min(2, { message: 'No minimo de 2 caracteres' }).optional(),
    stock: z.number().optional(),
    disponibility: z.boolean().optional()
})

