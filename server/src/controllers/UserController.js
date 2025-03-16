const UserService = require('../Application/UserService')
const bcrypt = require('../utils/bcrypt')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt')

class UserController{
    async signup(req, res){
        try{
            const {name, email, password} = req.body

            if(!name || !email || !password){
                return res.status(400).json({message: "All fields are required"})
            }

            const emailExists = await UserService.EmailExists(email)
            if(emailExists){
                console.log(emailExists)
                return res.status(409).json({message: 'Email already registered'})
            }

            const passwordHash = await bcrypt.hashPassword(password)
            const user = await UserService.createUserAccount(name, email, passwordHash)

            res.status(201).json({message: "User created successfully", user})
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async login(req, res){
        try{
            const {email, password} = req.body

            if(!email || !password){
                return res.status(400).json({message: "All fields are required"})
            }

            const user = await UserService.getUserByEmail(email)
            if(!user){
                return res.status(401).json({message: "Invalid credentials"})
            }

            const isPasswordValid = await bcrypt.comparePasswords(password, user.password)
            if(!isPasswordValid){
                return res.status(401).json({message: "Invalid credentials"})
            }

            const accessToken = await generateAccessToken(email)
            const refreshToken = await generateRefreshToken(email)

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

    async refreshToken(req, res){
        try{
            const refreshToken = req.cookies.refreshToken
            
            if(!refreshToken){
                return res.status(400).json({message: "Refresh token required"})
            }

            const decoded = await verifyRefreshToken(refreshToken)
            if(!decoded || !decoded.email){
                return res.status(400).json({message: "Invalid refresh token"})
            }

            const user = await UserService.getUserByEmail(decoded.email)
            if(!user){
                return res.status(401).json({message: "User not found"})
            }

            const newAccessToken = await generateAccessToken(user.email)
            
            res.status(200).json({accessToken: newAccessToken})
        }
        catch(error){
            res.status(500).json(error.message)
        }
    }

    async logout(){
        try{
            res.clearCookie("refreshToken", {
                path: "/api/refresh",
                httpOnly: true,
                secure: true
            })
            res.status(200).json({message: "Logged out successfully"})
        }
        catch(error){
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = new UserController