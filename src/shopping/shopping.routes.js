'use strict'

import { Router } from "express"
import { register, get, test, update, generateAndDeleteInvoices } from "../shopping/shopping.controller.js"
import { isClient, validateJwt } from "../../middlewares/validate-jwt.js"

const api = Router()

api.get('/test', test)
api.post('/new', [validateJwt, isClient], register)
api.get('/get', [validateJwt, isClient], get)
api.put('/update/:id', [validateJwt, isClient], update)
api.get('/factura', [validateJwt, isClient], generateAndDeleteInvoices)

export default api