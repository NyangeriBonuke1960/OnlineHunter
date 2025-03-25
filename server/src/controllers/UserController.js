const TokenService = require('../Application/TokenService')
const UserService = require('../Application/UserService')
const bcrypt = require('../utils/bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt')

class UserController{
    async signUpController(req, res){
        try{
            const {name, email, password} = req.body

            if(!name || !email || !password){
                return res.status(400).json({message: "All fields are required"})
            }

            const emailExists = await UserService.checkEmailService(email)
            if(emailExists){
                console.log(emailExists)
                return res.status(409).json({message: 'Email already registered'})
            }

            const passwordHash = await bcrypt.hashPassword(password)
            const user = await UserService.signupService(name, email, passwordHash)

            res.status(201).json({message: "User created successfully", user})
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async loginController(req, res){
        try{
            const {email, password} = req.body

            if(!email || !password){
                return res.status(400).json({message: "All fields are required"})
            }

            const user = await UserService.getUserByEmailService(email)
            if(!user){
                return res.status(401).json({message: "Invalid credentials"})
            }

            const isPasswordValid = await bcrypt.comparePasswords(password, user.password)
            if(!isPasswordValid){
                return res.status(401).json({message: "Invalid credentials"})
            }

            const payload = {id: user._id, email: user.email}
            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            await TokenService.updateRefreshTokenService(user, refreshToken)

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                path: "/api/refresh"
            })

            res.status(200).json({message: "Login successful", user, accessToken})
        }
        catch(error){
            res.status(500).json(error.message)
        }
    }

    async refreshTokenController(req, res){
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

    async logoutController(req, res){
        try{
            const refreshToken = req.cookies.refreshToken
            const userId = req.body.userId
            
            await TokenService.blackListRefreshTokenService(userId, refreshToken)

            res.clearCookie("refreshToken", {
                path: "/api/refresh",
                httpOnly: true,
                secure: true
            })
            res.status(200).json({message: "Logged out successfully"})
        }
        catch(error){
            res.status(500).json(error.message)
        }
    }

    async changePasswordController(req, res){
        try{
            const {userId, oldPassword, newPassword} = req.body
           
            const result = await UserService.changePasswordService(userId, oldPassword, newPassword)
            res.status(200).json(result)
        }
        catch(error){
            res.status(500).json(error)
        }
    }

}

module.exports = new UserController