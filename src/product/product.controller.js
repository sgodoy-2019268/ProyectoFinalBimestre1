'use strict'

import Product from './product.model.js'
import { checkUpdateP } from '../utils/validator.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message:'Test is running'})
}

// Se agrega la producto0
export const newProduct =async(req, res)=>{
    try {
        let data = req.body
        let product = new Product(data)
        await product.save()
        return res.send({message: `Registered succesfully, can be logged with name ${product.name}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error registering product', err: err})
    }
}

// Se edita la producto 
export const update = async (req, res)=>{
    try {
        let data = req.body
        let{id} = req.params
        let update = checkUpdateP(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updateProduct = await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateProduct) return res.status(404).send({menssage: 'Category not found and not upadate'})
        return res.send({menssage:'Update new', updateProduct})
    } catch (err) {
        return res.status(500).send({message:'Error updatting account'})
    }
}

// Se elimina la producto
export const deleteP = async (req, res)=>{
    try {
        let{ id } = req.params
        let deleteProduct = await Product.findOneAndDelete({_id: id})
        if(!deleteProduct.deleteCount === 0) return res.status(404).send({message: 'Product not found and not delete'})
        return res.send({message: 'Delete successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error deleting account'})
    }
}

// Se busca una producto
export const search = async (req, res)=>{
    try {
        let {search} = req.body
        let product = await Product.find(
            {name: search}
        )
        if(!product) return res.status(404).send({menssage: 'product not found'})
        return res.send({menssage: 'Product found', product})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error searching product'})
    }
}

// Se listan los productos
export const listProduct = async (req, res) => {
    try {
        let product = await Product.find()
        return res.send(product)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error '})
    }
}