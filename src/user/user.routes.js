'use strict'

import { Router } from "express";
import { deleteU, listUser, newUser, search, test, update } from "./user.controller.js";

const api = Router()

api.get('/test', test)
api.post('/new', newUser)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteU)
api.post('/search', search)
api.get('list', listUser)

export default api