const User = require('../Domain/User')
const UserRepository = require('../repositories/UserRepository')
const bcrypt = require('../utils/bcrypt')

class UserService{
    async signupService(name, email, password){
        try{
            const userAccount = new User(name, email, password)

            const savedUserAccount = await UserRepository.signupRepository(userAccount)
            return savedUserAccount
        }
        catch(error){
            throw new Error(`Create user Account error ${error.message}`)
        }
    }

    async checkEmailService(email){
        try{
            return await UserRepository.checkEmailRepository(email)
        }
        catch(error){
            throw new Error(`Check email error: ${error.message}`)
        }
    }

    async getUserByEmailService(email){
        try{
            return await UserRepository.getUserByEmailRepository(email)
        }
        catch(error){
            throw new Error(`Get user by email Error: ${error.message}`)
        }
    }

    async changePasswordService(userId, oldPassword, newPassword){
        try{
            if(!userId || !oldPassword || !newPassword){
                throw new Error('Old password or new password missing')
            }

            if(oldPassword === newPassword){
                throw new Error('New password must be different from old password')
            }

            const user = await UserRepository.getUserByIdRepository(userId)
            if(!user){
                throw new Error('User not found')
            }

            const isMatch = await bcrypt.comparePasswords(oldPassword, user.password)
            if(!isMatch){
                throw new Error('Incorrect current password')
            }

            const newPasswordHash = bcrypt.hashPassword(newPassword)

            await UserRepository.changePasswordRepository(newPasswordHash, user._id)

            return {success: true, message: "Password changed successfully"}
        }
        catch(error){
            throw new Error(`Change password service error: ${error}`)
        }
    }
}

module.exports = new UserService