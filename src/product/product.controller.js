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
        console.error(err)
        if(err.keyValue.name) return res.status(400).send({message: `Product ${err.keyValue.name} is alredy taken`})
        return res.status(500).send({message: 'Error updating product'})
    }
}

export const deleteP = async (req, res)=>{
    try{
        let { id } = req.params
        let deletedProduct = await Product.findOneAndDelete({_id: id}) 
        if(!deletedProduct) return res.status(404).send({message: 'Product not found and not deleted'})
        return res.send({message: `Product with name ${deletedProduct.name} deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting Product'})
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

export const searchByCategory = async (req, res) => {
    try {
        let data = await Product.find().populate('category')
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error obtaining information' })
    }
}

export const exhausted = async (req, res) => {
    try {
        let data = await Product.findOne({ stock: 0 }).populate('category')
        if (!data) return res.status(444).send({ message: "there are no products out of stock" })
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
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