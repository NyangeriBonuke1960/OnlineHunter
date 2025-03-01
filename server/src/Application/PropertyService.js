const Property = require('../Domain/Property')
const PropertyRepository = require('../repositories/PropertyRepository')

class PropertyService{
    async createProperty(upi, title, location, description, email, phoneNumber, images, videos, role){
        const property = new Property(upi, title, location, description, email, phoneNumber, images, videos, role)

        if(!property.isValid()){
            throw new Error('Invalid property data')
        }

        return await PropertyRepository.save(property)
    }

    async getAllProperties(){
        return await PropertyRepository.getAll()
    }
}

module.exports = new PropertyService()