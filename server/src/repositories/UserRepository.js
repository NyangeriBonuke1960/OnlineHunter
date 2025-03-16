const User = require('../models/UserModel')

class UserRepository{
    async createUser(userData){
        try{
            const newAccount = new User(userData)
            return await newAccount.save()
        }
        catch(error){
            throw new Error(`User repository error: ${error.message}`)
        }
    }

    async checkEmail(email){
        try{
            if(!email){
                throw new Error('Email parameter required')
            }
            const user = await User.findOne({email: email})

            return user !== null
        }
        catch(error){
            throw new Error(`Check email error : ${error.message}`)
        }
    }

    async getUserUsingEmail(email){
        try{
            const user = await User.findOne({email: email})
            return user
        }
        catch(error){
            throw new Error(`Get user by emial error: ${error.message}`)
        }
    }
}

module.exports = new UserRepository