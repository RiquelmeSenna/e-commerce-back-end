import express, { response, urlencoded } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { authRouter } from './routers/authRouter'
import { cartRouter } from './routers/cartRouter'
import { categoryRouter } from './routers/categoryRouter'
import { orderRouter } from './routers/orderRouter'
import { productRouter } from './routers/productRouter'
import { userRouter } from './routers/userRouter'
import { mongoConnect } from './database/mongo'

const server = express()

mongoConnect()
server.use(cors())
server.use(helmet())
server.use(urlencoded({ extended: true }))
server.use(express.json())

server.use('/auth', authRouter)
server.use('/cart', cartRouter)
server.use('/category', categoryRouter)
server.use('/order', orderRouter)
server.use('/product', productRouter)
server.use('/user', userRouter)

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server as be running in:http://localhost:${port}`)
})