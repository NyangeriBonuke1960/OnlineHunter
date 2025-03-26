const UserRepository = require('../repositories/UserRepository')
const { generateAccessToken, generateRefreshToken, generateResetToken, verifyResetToken } = require('../utils/jwt')
const bcrypt = require('../utils/bcrypt')
const EmailService = require('./EmailService')
const TokenService = require('./TokenService')
const token_expiry = 3600000

class UserService{
    async signup(name, email, password){
        try{
            if(!name || !email || !password){
                throw new Error('Name, email or password missing')
            }

            const emailExists = await UserRepository.findByEmail(email)
            if(emailExists){
                throw new Error('Email already exists')
            }

            const passwordHash = await bcrypt.hashPassword(password)
            
            
            return await UserRepository.signup({name, email, password: passwordHash})
        }
        catch(error){
            throw new Error(`Create user Account error ${error.message}`)
        }
    }

    async login(email, password){
        try{
            if(!email || !password){
                throw new Error('Invalid credentials')
            }

            const user = await UserRepository.findByEmail(email)
            if(!user){
                throw new Error('Invalid credentials')
            }

            const isPasswordValid = await bcrypt.comparePasswords(password, user.password)
            if(!isPasswordValid){
                throw new Error('Invalid credentials')
            }

            const payload = {id: user._id, email: user.email}
            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            await UserRepository.updateTokenRepository(user, refreshToken)

            return {accessToken, refreshToken, user}
        }
        catch(error){
            throw new Error(`Login error: ${error}`)
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

    async requestPasswordResetService(email){
        try{
            if(!email){
                throw new Error('Email is required')
            }

            const user = await UserRepository.getUserByEmailRepository(email)

            if(!user){
                throw new Error('No account with this email was found')
            }

            const payload = {id: user._id}
            const resetToken = await generateResetToken(payload)
            
            await UserRepository.storeTokenandExpiryDate(user._id, resetToken, token_expiry)

            await EmailService.sendPasswordResetEmail(email, resetToken)

            return {success: true, message: 'Password reset email sent'}
        }
        catch(error){
            throw new Error(`request reset password error: ${error}`)
        }
    }

    async resetPassword(token, newPassword){
        try{
            if(!token || !newPassword){
                throw new Error('token and password are required')
            }

            const decoded = await verifyResetToken(token)

            const user = await UserRepository.findUserReset(decoded.id, token)

            const hashPassword = await bcrypt.hashPassword(newPassword)

            await UserRepository.saveResetPassword(decoded.id, hashPassword)

            return {success: true, message: 'Password reset successful'}
        }
        catch(error){
            throw new Error(`Password reset failed: ${error.message}`)
        }
    }
}

module.exports = new UserService