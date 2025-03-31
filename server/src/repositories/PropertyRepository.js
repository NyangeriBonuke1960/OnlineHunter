const PropertyModel = require('../models/PropertyModel')

class PropertyRepository{
    async signup(accountData){
        try{
            const newAccount = new PropertyModel(accountData)
            return await newAccount.save()  
        }
        catch(error){
            throw new Error(`create account error: ${error.message}`)
        }
    }

    async findByEmail(email){
        try{
            if(!email){
                throw new Error('Email required')
            }
            return await PropertyModel.findOne({email})
        }
        catch(error){
            throw new Error(`Find by email error: ${error}`)
        }
    }

    async updateToken(user, refreshToken){
        try{
            await PropertyModel.updateOne(
                {_id: user._id},
                {$push: {refreshTokens: {token: refreshToken, blaclisted: false, createdAt: new Date()}}}
            )
        }
        catch(error){
            throw new Error(`update token error: ${error.message}`)
        }
    }
}

module.exports = new PropertyRepository();