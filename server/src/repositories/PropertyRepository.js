const PropertyModel = require('../models/PropertyModel')

class PropertyRepository{
    async save(property){
        const propertyModel = new PropertyModel(property)
        return await propertyModel.save()
    }

    async getAll(){
        return await PropertyModel.find()
    }
}

module.exports = new PropertyRepository();