'use strict'

import { checkUpdate, encrypt, checkPassword } from '../utils/validator.js'
import User from './user.model.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const newUser = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save() 
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const update = async(req, res)=>{
    try{     
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedU = await User.findOneAndUpdate(
            {_id: id},
            data, 
            {new: true}
        )
        if(!updatedU) return res.status(401).send({message: 'User not found and not updated'})
        return res.send({message: 'Updated user', updatedUser: updatedU})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteU = async (req, res)=>{
    try{
        let { id } = req.params
        let deletedU = await User.findOneAndDelete({_id: id}) 
        if(!deletedU) return res.status(404).send({message: 'Account not found and not deleted'})
        return res.send({message: `Account with username ${deletedU.username} deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

export const search = async(req, res)=>{
    try{
        let { search } = req.body
        let user = await User.find({name: search})
        if(!user) return res.status(404).send({message: 'User not found'})
        return res.send({message: 'User found', user})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching user'})
    }
}

export const listUser = async(req, res)=>{
    try {
        let user = await User.find()
        return res.send(user)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error'})
    }
}

export const login = async(req, res)=>{
    try{
        let { username, password , email} = req.body
        let user = await User.findOne({$or:[{username}, {email}]}) 
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`, 
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}