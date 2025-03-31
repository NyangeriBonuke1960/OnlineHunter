const PropertyService = require("../Application/PropertyService");
const TokenService = require("../Application/TokenService");

class PropertyController{
    async signup(req, res){
        try{
            const {title, email, password} = req.body;

            const property = await PropertyService.signup(title, email, password)
            
            res.status(201).json({message: "Property created successfully", property})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }

    async login(req, res){
        try{
            const {email, password} = req.body
            const {refreshToken, accessToken} = await PropertyService.login(email, password)

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                path: "/api/refresh"
            })

            res.json({refreshToken, accessToken})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }

    async refreshToken(req, res){///CCCCCCcorrect refresh token
        try{
            const getRefreshToken = req.cookies.refreshToken

            if(!getRefreshToken){
                res.status(400).json({message: 'Refresh token required'})
            }

            const tokens = await TokenService.refreshTokenService(getRefreshToken)
            const accessToken = tokens.accessToken
            const refreshToken = tokens.refreshToken

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                path: "/api/refresh"
            })

            res.status(200).json({message: 'tokens refreshed', accessToken})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }
}

module.exports = new PropertyController()