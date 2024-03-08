'use strict'

import { Router } from "express";
import { validateJwt, isAdmin } from "../../middlewares/validate-jwt.js";
import { deleteC, newCategory, search, listCategory, test, update } from "./category.controller.js";


const api = Router()


api.get('/test', test)
api.post('/new', [validateJwt, isAdmin], newCategory)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteC)
api.post('/search', [validateJwt, isAdmin], search)
api.get('/list', listCategory)

export default api