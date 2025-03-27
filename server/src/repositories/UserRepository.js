const User = require('../models/UserModel')

class UserRepository{
    async signup(userData){
        try{
            const newAccount = new User(userData)
            return await newAccount.save()
        }
        catch(error){
            throw new Error(`User repository error: ${error.message}`)
        }
    }

    async findByEmail(email){
        try{
            if(!email){
                throw new Error('Email parameter required')
            }
            
            return await User.findOne({email})
        }
        catch(error){
            throw new Error(`Check email error : ${error.message}`)
        }
    }

    async getUserByIdRepository(id){
        try{
            const user = await User.findById(id)
            return user
        }
        catch(error){
            throw new Error(`Get user by id error: ${error.message}`)
        }
    }

    async updateTokenRepository(user, refreshToken){
        try{
            await User.updateOne(
                {_id: user._id},
                {$push: {refreshTokens: {token: refreshToken, blacklisted: false, createdAt: new Date()}}}
            )
        }
        catch(error){
            throw new Error(`Upadate token error: ${error.message}`)
        }
    }

    async replaceTokenRepository(user, oldRefreshToken, newRefreshToken){
        try{
            await User.updateOne(
                {_id: user._id, 'refreshTokens.token': oldRefreshToken},
                {
                    $set: {'refreshTokens.$.token': newRefreshToken, 'refreshTokens.$.createdAt': new Date()},
                }
            )
        }
        catch(error){
            throw new Error(`Replace token error: ${error.message}`)
        }
    }

    async removeTokenRepository(user, oldRefreshToken){
        try{
            await User.updateOne(
                {_id: user._id},
                {$pull: {refreshTokens: {token: oldRefreshToken}}}
            )
        }
        catch(error){
            throw new Error(`Remove token error: ${error.message}`)
        }
    }

    async getUserByIdAndTokenRepository(id, oldRefreshToken){
        try{
            const user = await User.findOne({
                _id: id,
                'refreshTokens.token': oldRefreshToken
            })
           return user
        }
        catch(error){
            throw new Error(`Find user error: ${error.message}`)
        }
    }

    async blackListTokenRepository(userId, refreshToken){
        try{
            if(!userId || !refreshToken){
                throw new Error('User id and refresh token required')
            }

            const result = await User.updateOne(
                {_id: userId},
                {$set: { 'refreshTokens.$[elem].blacklisted': true }},
                {
                    arrayFilters: [
                        {'elem.token': refreshToken, 'elem.blacklisted': {$ne: true}}
                    ]
                }
            )

            return result
        }
        catch(error){
            throw new Error(`Black list token error: ${error.message}`)
        }
    }

    async changePasswordRepository(passwordHash, userId){
        try{
            const result = await User.updateOne(
                {_id: userId},
                {$set: {password: passwordHash}}
            )

            if(result.modifiedCount === 0){
                throw new Error('Password update failed')
            }

            return {message: "Password updated successfully"}
        }
        catch(error){
            throw new Error(`Change password error: ${error.message}`)
        }
    }

    async storeTokenandExpiryDate(id, token, time){
        try{
            const result = await User.updateOne(
                {_id: id},
                {$set: {resetPasswordToken: token, resetPasswordExpires: Date.now() + time}}
            )

            if(result.modified === 0){
                throw new Error('Store token and expiry date error')
            }

            return result
        }
        catch(error){
            throw new Error(`Store token and expiry date error: ${error.message}`)
        }
    }

    async findUserReset(id, token){
        try{
            const user = await User.findOne({
                _id: id,
                resetPasswordToken: token,
                resetPasswordExpires: {$gt: Date.now()}
            })
            if(!user){
                throw new Error('Invalid or expired reset token')
            }
            return user
        }
        catch(error){
            throw new Error(`Find user rest error: ${error.message}`)
        }
    }

    async saveResetPassword(id, hashPassword){
        try{
            await User.updateOne(
                {_id: id},
                {$set: {password: hashPassword}},
                {$unset: {resetPasswordToken: "", resetPasswordExpires: ""}}
            )
        }
        catch(error){
            throw new Error(`Save reset password error: ${error.message}`)
        }
    }
}

module.exports = new UserRepository