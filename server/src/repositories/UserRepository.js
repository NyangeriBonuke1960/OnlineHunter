const User = require('../models/UserModel')

class UserRepository{
    async signupRepository(userData){
        try{
            const newAccount = new User(userData)
            return await newAccount.save()
        }
        catch(error){
            throw new Error(`User repository error: ${error.message}`)
        }
    }

    async checkEmailRepository(email){
        try{
            if(!email){
                throw new Error('Email parameter required')
            }
            const user = await User.findOne({email})

           return !!user
        }
        catch(error){
            throw new Error(`Check email error : ${error.message}`)
        }
    }

    async getUserByEmailRepository(email){
        try{
            const user = await User.findOne({email: email})
            return user
        }
        catch(error){
            throw new Error(`Get user by emial error: ${error.message}`)
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
                {$push: {refreshTokens: {token: refreshToken}}}
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
            const result = await User.updateOne(
                {_id: userId, 'refreshTokens.token': refreshToken, "refreshTokens.blacklisted": {$ne: true}},
                {$set: {'refreshTokens.$.blacklisted': true}}
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
            throw new Error(`Change password error: ${error}`)
        }
    }
}

module.exports = new UserRepository