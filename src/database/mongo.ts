import mongoose from "mongoose"

export const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string)
        console.log('Connected to database')
    } catch (error) {
        console.log(error)
    }
}

export const mongoConnectTest = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL_TEST as string)
        console.log('Connected to test database')
    } catch (error) {
        console.log(error)
    }
}