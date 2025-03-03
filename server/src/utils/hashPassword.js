const bcrypt = require('bcrypt')

const hashPassword = async(passowrd) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passowrd, saltRounds)
    return hashedPassword
}

module.exports = {hashPassword}