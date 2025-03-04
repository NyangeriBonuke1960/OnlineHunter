const PropertyService = require("../Application/PropertyService");
const { hashPassword } = require("../utils/hashPassword");
const { generateAccessToken } = require("../utils/jwt");

class PropertyController{
    async postProperty(req, res){
        try{
            const { title, email, password } = req.body;

            const passwordHash = await hashPassword(password)
            const property = await PropertyService.createPropertyAccount(title, email, passwordHash)
            
            res.status(201).json({message: "Property created successfully", property})
        }
        catch(error){
            res.status(400).json({error: error.message})
        }
    }
}

module.exports = new PropertyController()