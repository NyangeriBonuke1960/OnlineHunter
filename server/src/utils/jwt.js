const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateAccessToken = (payload) => {
    try{
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: "15m"})
        return token
    }
    catch(error){
        console.err(`Access token generation failed: ${error.message}`)
        return null
    }   
}

const verifyAccessToken = (req, res, next) => {
    try{
        const authHeader = req.header('Authorization')

        if(!authHeader){
            return res.status(401).json({error: "Access denied. No token provided"})
        }

        const token = authHeader.split(" ")[1]

        if(!token){
            return res.status(401).json({error: "Access denied. Invalid token"})
        }

        jwt.verify(token, secret_key, (err, user) => {
            if(err){
                return res.status(403).json({error: "Invalid token"})
            }

            req.user = user
            next()
        })
    }
    catch(error){
        console.error(`Token verification error: ${error.message}`)
        return res.status(500).json({error: "Internal server error"})
    }
}

const generateRefreshToken = (payload) => {
    try{
        const token = jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn: "7d"})
        return token
    }
    catch(error){
        console.error(`Refresh token generation failed: ${error.message}`)
        return null
    }
}

const verifyRefreshToken = (token) => {
    try{
        return jwt.verify(token, process.env.REFRESH_TOKEN)
    }
    catch(error){
        throw new Error(`Verify refresh token error: ${error.message}`)
    }
}

const generateResetToken = (payload) => {
    try{
        const token = jwt.sign(payload, process.env.RESET_TOKEN, {expiresIn: '1h'})
        return token
    }
    catch(error){
        throw new Error(`Generate reset token error: ${error.message}`)
    }
}

const verifyResetToken = (token) => {
    try{
        return jwt.verify(token, process.env.RESET_TOKEN)
    }
    catch(error){
        throw new Error(`Verify token error: ${error.message}`)
    }
}

module.exports = { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken, generateResetToken, verifyResetToken }