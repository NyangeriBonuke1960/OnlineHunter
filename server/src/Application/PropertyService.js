const Property = require('../Domain/Property')
const PropertyRepository = require('../repositories/PropertyRepository')

class PropertyService{
    async createPropertyAccount(title, email, password){
        try{
            const propertyAccount = new Property(title, email, password)

            if(!propertyAccount.isValid()){
                throw new Error('Invalid property data')
            }

            const savedPropertyAccount = await PropertyRepository.createPropertyAccount(propertyAccount)
            return savedPropertyAccount
        }
        catch(error){
            throw new Error(`Create property account error: ${error.message}`)
        }
    }
}

module.exports = new PropertyService()