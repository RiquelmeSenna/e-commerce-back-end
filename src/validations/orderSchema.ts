import { z } from "zod";

export const orderSchema = z.object({
    orderId: z.string({ message: 'Mande o id da ordem' })
})