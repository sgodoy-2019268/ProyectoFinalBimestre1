'use strict'

import { hash, compare } from 'bcrypt'

export const encrypt = async (password) => {
    try {
        return hash(password, 10)
    } catch (err) {
        console.error(err)
        return err
    }
}

//Validar la contraseña
export const checkPassword = async (password, hash) => {
    try {
        return await compare(password, hash)
    } catch (err) {
        console.error(err);
        return err
    }
}

export const checkUpdateC = (data, Id)=>{
    if(Id){
        if(Object.entries(data).length === 0){
            return false
        }
        return true
    }else{
        return false
    }
}

export const checkUpdateP = (data, Id)=>{
    if(Id){
        if(Object.entries(data).length === 0){
            return false
        }
        return true
    }else{
        return false
    }
}

export const checkUpdate = (data, userId)=>{
    if(userId){
        if(
            Object.entries(data).length === 0 ||
            data.password ||
            data.password == '' ||
            data.role ||
            data.role == ''
        ) {
            return false
        }
        return true
    }else{
        if(
            Object.entries(data).length === 0 ||
            data.keeper ||
            data.keeper == ''
        ) {
            return false
        }
        return true
    }
}