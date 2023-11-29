import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const DB = process.env.MONGODB_URI.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);
        const connectionInstance = await mongoose.connect(`${DB}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB