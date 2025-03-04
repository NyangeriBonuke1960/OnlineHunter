const bcrypt = require('bcrypt')

const hashPassword = async(password) => {
    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
    catch(error){
        console.error(`Failed to hash password: ${error.message}`)
        throw new Error('Password hashing failed')
    }
}

module.exports = {hashPassword}