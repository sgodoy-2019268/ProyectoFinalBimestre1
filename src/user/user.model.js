import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    surname:{
        type: String,
        require: true
    },
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        miniLength: [8, 'Password must be 8 characters'],
        require: true
    },
    email:{
        type: String,
        require: true
    },
    phone:{
        type: String,
        require: true
    },
    role:{
        type: String,
        uppercase: true,
        enum: [ADMIN, USER],
        require: true
    }
})

export default mongoose.model('user', userSchema)