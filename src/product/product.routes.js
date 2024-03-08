'use strict'

import { Router } from "express"
import {validateJwt, isAdmin} from "../../middlewares/validate-jwt.js"
import { deleteP, newProduct, search, listProduct, test, update } from "./product.controller.js"

const api = Router()

api.get('/test', test)
api.post('/new', [validateJwt, isAdmin], newProduct)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteP)
api.post('/search', [validateJwt, isAdmin], search)
api.get('/list', [validateJwt, isAdmin], listProduct)

export default api