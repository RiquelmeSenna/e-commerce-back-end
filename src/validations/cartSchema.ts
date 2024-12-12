import { z } from "zod";

export const cartProductSchema = z.object({
    idProduct: z.string()
})