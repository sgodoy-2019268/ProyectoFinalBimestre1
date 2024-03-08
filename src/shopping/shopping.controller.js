'use strict'

import Shopping from "../shopping/shopping.model.js"
import { checkUpdate } from "../utils/validator.js"
import Product from "../product/product.model.js"
import Client from "../user/user.model.js"
import jwt from "jsonwebtoken"
import DocumentPDF from 'pdfkit'
import fs from 'fs'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        let data = req.body
        let secretKey = process.env.SECRET_KEY
        let {token} = req.headers
        let {uid} = jwt.verify(token, secretKey)
        data.client = uid
        let product = await Product.findOne({ _id: data.product })
        if (!product) return res.status(404).send({ message: 'Product not found' })
        let client = await Client.findOne({ _id: data.client })
        if (!client) return res.status(404).send({ message: 'Client not found' })
        let restaStock = await Product.findById(data.product)
        restaStock.stock -= parseInt(data.amount)
        await restaStock.save()
        let shopping = new Shopping(data)
        await shopping.save()
        return res.send({message: `Purchase registered correctly ${shopping.date} and the stock is updated`, restaStock})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering purchase', err: err})
    }
}

export const update = async(req, res)=>{ 
    try {
        let { id } = req.params  
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Some data cannot be updated or missing data' })
        let secretKey = process.env.SECRET_KEY
        let { token } = req.headers
        let { uid } = jwt.verify(token, secretKey)
        let originalShopping = await Shopping.findById(id)
        if (!originalShopping) return res.status(404).send({ message: 'Purchase not found' })
        if (originalShopping.client.toString() !== uid) return res.status(403).send({ message: 'Unauthorized to update this purchase' })
        let updatedShopping = await Shopping.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('product')
        let product = await Product.findById(originalShopping.product)
        let updateAmount =originalShopping.amount  - data.amount
    
        product.stock += updateAmount
        await product.save()

        if (!updatedShopping) return res.status(401).send({ message: 'Purchase not found and not updated' })
        return res.send({ message: 'Purchase updated', updatedShopping })
    } catch (err) {
        console.error(err)
        if (err.keyValue.description) return res.status(400).send({ message: `Purchase ${err.keyValue.description} is already taken` })
        return res.status(500).send({ message: 'Error updating purchase' })
    }
}

export const get = async (req, res) => {
    try {
        let secretKey = process.env.SECRET_KEY
        let { token } = req.headers
        let { uid } = jwt.verify(token, secretKey)

        let compras = await Compra.find({ client: uid })

        return res.send({ compras })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting purchases' })
    }
}

export const generateAndDeleteInvoices = async (req, res) => {
    try{
    const currentDate = new Date().toLocaleDateString('en-US', { timeZone: 'UTC' })
        const shopping = await Shopping.find({ client: uid }).populate('product')
        const fileName = `invoices_${uid}.pdf`

        const doc = new DocumentPDF()
        doc.pipe(fs.createWriteStream(fileName))

        doc.fontSize(12).text('Invoices', { align: 'center' }).moveDown()

        let total = 0
        shopping.forEach((shopping, index) => {
            const totalShopping = shopping.product.price * shopping.amount
            total += totalShopping

            if (index === 0) {
                doc.fontSize(10).text('Date: ' + currentDate).moveDown()
                doc.fontSize(10).text('Client'+ shopping.client.name, {align: 'right'}).moveDown()
            }

            doc.fontSize(10)
                .text('Product: ' + shopping.product.name, + '|||' + { continued: true })
                .text('----------')
                .text('Price: ' + `Q${shopping.product.price.toFixed(2)}`, + '|||' + { continued: true })
                .text('----------')
                .text('Amount: ' + shopping.amount, + '|||' + { continued: true })
                .text('----------')
                .text('Total: ' + `Q${totalShopping.toFixed(2)}`)
                .text('----------')
                .moveDown()
        })

        doc.fontSize(12).text('Total: ' + `Q${total.toFixed(2)}`, { align: 'right' }).moveDown()

        doc.end()

        await Shopping.deleteMany({ client: uid })

        res.download(fileName)
    } catch (error) {
        console.error('Error generating invoices and deleting purchases:', error)
        res.status(500).send('Error generating invoices and deleting purchases')
    }
}