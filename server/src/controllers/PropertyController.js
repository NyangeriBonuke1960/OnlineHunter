const PropertyService = require("../Application/PropertyService");

class PropertyController{
    async postProperty(req, res){
        try{
            const {upi, title, location, description, email, phoneNumber, role} = req.body;

            const images = req.files["images"] ? req.file["images"].map(file => file.path) : []
            const videos = req.files["videos"] ? req.file["videos"].map(file => file.path) : []

            const property = await PropertyService.createProperty(upi, title, location, description, email, phoneNumber, images, videos, role)

            res.status(201).json({message: "Property created successfully", property})
        }
        catch(error){
            res.status(400).json({error: error.message})
        }
    }
}

module.exports = new PropertyController()