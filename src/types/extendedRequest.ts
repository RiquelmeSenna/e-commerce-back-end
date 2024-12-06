import { Request } from "express";


export type ExtendedRequest = Request & {
    userEmail: string
}