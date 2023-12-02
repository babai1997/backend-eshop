import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { globalError } from "./controllers/error.controller.js"
import { authJwt } from "./controllers/auth.controller.js"

const app = express()

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(authJwt())
app.use(globalError)


//routes import
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'
import categoryRouter from './routes/category.routes.js'
import orderRouter from './routes/order.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/orders", orderRouter)

// http://localhost:8000/api/v1/users/register

export { app }