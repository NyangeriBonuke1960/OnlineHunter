const TokenService = require('../Application/TokenService')
const UserService = require('../Application/UserService')

class UserController{
    async signup(req, res){
        try{
            const {name, email, password} = req.body

            const user = await UserService.signup(name, email, password)

            res.status(201).json({message: "User created successfully", user})
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async login(req, res){
        try{
            const {email, password} = req.body

            const {accessToken, refreshToken, user} = await UserService.login(email, password)

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                path: "/api/refresh"
            })

            res.status(200).json({message: "Login successful", user, accessToken})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }

    async refreshToken(req, res){
        try{
            const getRefreshToken = req.cookies.refreshToken
            
            if(!getRefreshToken){
                return res.status(400).json({message: "Refresh token required"})
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
           
            res.status(200).json({message: 'Tokens refreshed', accessToken})
        }
        catch(error){
            res.status(500).json(error.message)
        }
    }

    async logout(req, res){
        try{
            const refreshToken = req.cookies.refreshToken
            const userId = req.body.userId
            
            const result = await TokenService.blackListRefreshTokenService(userId, refreshToken)

            res.clearCookie("refreshToken", {
                path: "/api/refresh",
                httpOnly: true,
                secure: true
            })
            res.status(200).json({message: result.alreadyBlackListed ? 'Logged out succesfully: token was already blacklisted' : 'Logged out successfully'})
        }
        catch(error){
            res.status(500).json(error.message)
        }
    }

    async changePassword(req, res){
        try{
            const {userId, oldPassword, newPassword} = req.body
           
            const result = await UserService.changePasswordService(userId, oldPassword, newPassword)
            res.status(200).json(result)
        }
        catch(error){
            res.status(500).json(error.message)
        }
    }

    async forgotPassword(req, res){
        try{
            const {email} = req.body
            const result = await UserService.requestPasswordResetService(email)
            res.status(200).json(result)
        }
        catch(error){
            res.status(500).json(error.message)
        }
    }

    async resetPassword(req, res){
        try{
            const {token, newPassword} = req.body
            const result = await UserService.resetPassword(token, newPassword)
            res.status(200).json(result)
        }
        catch(error){
            res.status(500).json(error.message)
        }
    }

}

module.exports = new UserController