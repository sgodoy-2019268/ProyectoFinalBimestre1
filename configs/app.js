'use strict'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from "dotenv"
import categoryRoutes from '../src/category/category.routes.js'
import productRoutes from '../src/product/product.routes.js'


const app = express()
config();
const port = process.env.PORT || 3056

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev')) 

app.use('/category', categoryRoutes)
app.use('/product', productRoutes)


export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}