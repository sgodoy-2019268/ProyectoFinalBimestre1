'use strict'

import { Router } from "express"
import { deleteShopp, register, test, update } from "./shopping.controller"
import { isClient, validateJwt } from "../../middlewares/validate-jwt"
import { get } from "mongoose"

const api = Router()

api.get('/test', test)
api.post('/register', [validateJwt, isClient], register)
api.get('/get', [validateJwt, isClient], get)
api.put('/update/:id', [validateJwt, isClient], update)
api.delete('/delete/:id', [validateJwt, isClient], deleteShopp)

export default api