import { z } from "zod";

export const registerSchema = z.object({
    name: z.string({ message: 'Mande  um nome' }).min(2, { message: 'O nome deve ter no minimo 2 caracteres' }),
    email: z.string({ message: 'Mande um Email' }).email({ message: "Mande um Email válido" }),
    adress: z.string({ message: 'Mande um endereço' }),
    password: z.string({})
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*!&@#])[0-9a-zA-Z$*!&@#]{8,}$/,
            { message: 'A senha deve conter uma letra maiuscula, uma minuscula, um numero e um caractere especial!' }),
})

export const loginSchema = z.object({
    email: z.string({ message: 'Mande um Email' }).email({ message: "Mande um Email válido" }),
    password: z.string({ message: 'Mande uma senha' })
})

export const updateUserSchema = z.object({
    name: z.string().min(2, { message: 'O nome deve ter no minimo 2 caracteres' }).optional(),
    email: z.string().email({ message: "Mande um Email válido" }).optional(),
    adress: z.string().optional(),
    password: z.string({})
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*!&@#])[0-9a-zA-Z$*!&@#]{8,}$/,
            { message: 'A senha deve conter uma letra maiuscula, uma minuscula, um numero e um caractere especial!' }).optional(),
})