'use strict'

import Product from './product.model.js'
import { checkUpdateP } from '../utils/validator.js'
import Category from "../category/category.model.js"

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message:'Test is running'})
}

export const newProduct =async(req, res)=>{
    try{
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'Category not found' })
        let product = new Product(data)
        await product.save() 
        return res.send({message: `product registered correctly ${product.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering product', err: err})
    }
}

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

export const search = async (req, res)=>{
    try{
        let { search } = req.body
        let product = await Product.find(
            {name: search}
        ).populate('category')
        if(!product) return res.status(404).send({message: 'Product not found'})
        return res.send({message: 'Product found', product})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching product'})
    }
}

export const listProduct = async (req, res) => {
    try {
        let product = await Product.find()
        return res.send(product)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error '})
    }
}