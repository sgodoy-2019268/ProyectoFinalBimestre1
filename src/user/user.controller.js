'use strict'

import { checkUpdateU } from '../utils/validator.js'
import User from './user.model.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const newUser = async(req, res)=>{
    try {
       let data = req.body
       let user = new Product(data)
       await user.save()
       return res.send({message: `Registered succesfully, can be logged with name ${user.name}`}) 
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const update = async(req, res)=>{
    try {
        let data = req.body
        let {id} = req.params
        let update = checkUpdateU(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updateUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
    return re.send({message: 'Update new', updateUser})
    } catch (err) {
        return res.status(500).send({message:'Error updatting account'})
    }
}

export const deleteU = async (req, res)=>{
    try {
        let {id} = req.params
        let deleteUsuario = await Product.findOneAndDelete({_id: id})
        if(!deleteUsuario.deleteCount === 0) return res.status(404).send({message: 'Usuario not fund and not delete'})
        return res.send({message: 'Delete successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

export const search = async(req, res)=>{
    try {
        let {search} = req.body
        let product = await User.find(
            {name: search}
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching user'})
    }
}
