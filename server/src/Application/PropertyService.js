const PropertyRepository = require('../repositories/PropertyRepository')
const bcrypt = require('../utils/bcrypt')
const jwt = require('../utils/jwt')

class PropertyService{
    async signup(title, email, password){
        try{
           if(!title || !email || !password){
                throw new Error('Missing credentials')
           }

           const exists = await PropertyRepository.findByEmail(email)
           if(exists){
                throw new Error('User already exists')
           }

           const hashPassword = await bcrypt.hashPassword(password)
            
           const user = await PropertyRepository.signup({title, email, password: hashPassword})
           return user
        }
        catch(error){
            throw new Error(`Create property account error: ${error.message}`)
        }
    }

    async login(email, password){
        try{
            if(!email || !password){
                throw new Error('Email or password required')
            }

            const user = await PropertyRepository.findByEmail(email)
            if(!user){
                throw new Error('Wrong credentials')
            }

            const checkPassword = await bcrypt.comparePasswords(password, user.password)
            if(!checkPassword){
                throw new Error('Wrong credentials')
            }

            const payload = {id: user._id, email: user.email}
            const accessToken = await jwt.generateAccessToken(payload)
            const refreshToken = await jwt.generateRefreshToken(payload)

            await PropertyRepository.updateToken(user, refreshToken)

            return {accessToken, refreshToken}
        }
        catch(error){
            throw new Error(`Login property error: ${error.message}`)
        }
    }
}

module.exports = new PropertyService()