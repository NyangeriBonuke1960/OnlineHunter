const TokenService = require('../Application/TokenService')
const UserService = require('../Application/UserService')
const bcrypt = require('../utils/bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt')

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

            const payload = {id: user._id, email: user.email}
            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            await TokenService.updateRefreshToken(user, refreshToken)

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

            const tokens = await TokenService.refreshToken(refreshToken)
            
            res.status(200).json({message: 'Tokens refreshed', ...tokens})
        }
        catch(error){
            res.status(500).json(error.message)
        }
    }

    async logout(){
        try{
            const refreshToken = req.cookies.refreshToken
            const userId = req.user.id
            
            await TokenService.blackListRefreshToken(userId, refreshToken)

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