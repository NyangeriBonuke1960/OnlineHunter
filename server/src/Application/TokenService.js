const UserRepository = require("../repositories/UserRepository")
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt")

class TokenService{
    async refreshTokenService(oldRefreshToken){
        try{
            const decoded = await verifyRefreshToken(oldRefreshToken)
            if(!decoded || !decoded.email){
                throw new Error('Invalid token')
            }

            const user = await UserRepository.getUserByIdAndTokenRepository(decoded.id, oldRefreshToken)
            if(!user){
                throw new Error('User not found')
            }
            
            const tokenDoc = user.refreshTokens.find(t => t.token === oldRefreshToken)
            if(tokenDoc.blacklisted){
                throw new Error('Refresh token is blacklisted')
            }

            const payload = {id: user._id, email: user.email}
            const newAccessToken = await generateAccessToken(payload)
            const newRefreshToken = await generateRefreshToken(payload)

            await UserRepository.replaceTokenRepository(user, oldRefreshToken, newRefreshToken)

            await UserRepository.removeTokenRepository(user, oldRefreshToken)

            return {accessToken: newAccessToken, refreshToken: newRefreshToken}
        }
        catch(error){
            throw new Error(`Token refresh error: ${error.message}`)
        }
    }

    async blackListRefreshTokenService(userId, refreshToken){
        try{
            const result = await UserRepository.blackListTokenRepository(userId, refreshToken)
            console.log(refreshToken)
            console.log(result)

            const user = await UserRepository.getUserByIdRepository(userId)
            console.log(user)

            if(result.matchedCount === 0){
                throw new Error(`Refresh token not found or already blacklisted`)
            }

            if(result.modifiedCount === 0){
                return {message: 'Token was already blacklisted', alreadyBlackListed: true}
            }

            return {message: 'Token blacklisted successfully'}
        }
        catch(error){
            throw new Error(`Blacklist token error: ${error.message}`)
        }
    }
}

module.exports = new TokenService