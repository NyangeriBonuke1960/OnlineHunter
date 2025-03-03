const PropertyModel = require('../models/PropertyModel')

class PropertyRepository{
    async createPropertyAccount(accountData){
        try{
            const newAccount = new PropertyModel(accountData)
            return await newAccount.save()  
        }
        catch(error){
            throw new Error('create account error')
        }
    }
}

module.exports = new PropertyRepository();