const UserRepository = require("../repositories/UserRepository")
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt")

class TokenService{
    async updateRefreshToken(user, refreshToken){
        try{
            await UserRepository.updateToken(user, refreshToken)
        }
        catch(error){
            throw new Error(`Update refresh token error: ${error.message}`)
        }
    }

    async refreshToken(oldRefreshToken){
        try{
            const decoded = await verifyRefreshToken(oldRefreshToken)
            if(!decoded || !decoded.email){
                return res.status(400).json({message: "Invalid refresh token"})
            }

            const user = await UserRepository.getUserByIdAndToken(decoded.id, oldRefreshToken)
            if(!user){
                return res.status(401).json({message: "User not found"})
            }

            const tokenDoc = user.RefreshTokens.find(t => t.token === oldRefreshToken)
            if(tokenDoc.blacklisted){
                throw new Error('Refresh token is blacklisted')
            }

            const payload = {id: user._id, email: user.email}
            const newAccessToken = await generateAccessToken(payload)
            const newRefreshToken = await generateRefreshToken(payload)

            await UserRepository.replaceToken(user, oldRefreshToken, newRefreshToken)

            await UserRepository.removeToken(user, oldRefreshToken)

            return {accessToken: newAccessToken, refreshToken: newRefreshToken}
        }
        catch(error){
            throw new Error(`Token refresh error: ${error.message}`)
        }
    }

    async blackListRefreshToken(userId, refreshToken){
        try{
            const result = await UserRepository.blackListToken(userId, refreshToken)
            if(result.modifiedCount === 0){
                throw new Error(`Refresh token not found or already blacklisted`)
            }

            return {message: 'Token blacklisted successfully'}
        }
        catch(error){
            throw new Error(`Blacklist token error: ${error.message}`)
        }
    }
}

module.exports = new TokenService