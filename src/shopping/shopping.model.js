import { Schema, model } from "mongoose"

const shoppingSchema = Schema({
    date:{
        type: Date,
        required: true
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    client:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
},{
    versionKey: false
})

export default model('shopping', shoppingSchema)