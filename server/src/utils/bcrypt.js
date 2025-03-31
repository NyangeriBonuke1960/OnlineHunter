const bcrypt = require('bcrypt')

class BcryptHash{
    async hashPassword(password){
        try{
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            return hashedPassword
        }
        catch(error){
            throw new Error(`Password hashing failed: ${error.message}`)
        }
    }

    async comparePasswords(password, hashedPassword){
        try{
           if(!password || !hashedPassword){
                throw new Error('Password and hashed password required')
           }
           return await bcrypt.compare(password, hashedPassword)
        }
        catch(error){
            throw new Error(`Failed dehashing password: ${error.message}`)
        }
    }
}

module.exports = new BcryptHash