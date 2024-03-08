'use strict'

import { Router } from "express";
import { validateJwt, isAdmin } from '../../middlewares/validate-jwt.js'
import { deleteU, listUser, login, newUser, search, test, update } from "./user.controller.js";

const api = Router()

api.get('/test', [validateJwt, isAdmin], test)
api.post('/new',  newUser)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteU)
api.post('/search', [validateJwt, isAdmin], search)
api.get('list', listUser)
api.post('/login', login)

export default api