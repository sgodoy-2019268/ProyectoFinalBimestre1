'use strict'

import { Router } from "express";
import { deleteC, newCategory, search, listCategory, test, update } from "./category.controller.js";


const api = Router()


api.get('/test', test)
api.post('/new', newCategory)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteC)
api.post('/search', search)
api.get('/see', listCategory)

export default api