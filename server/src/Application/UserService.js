const User = require('../Domain/User')
const UserRepository = require('../repositories/UserRepository')

class UserService{
    async createUserAccount(name, email, password){
        try{
            const userAccount = new User(name, email, password)

            const savedUserAccount = await UserRepository.createUser(userAccount)
            return savedUserAccount
        }
        catch(error){
            throw new Error(`Create user Account error ${error.message}`)
        }
    }

    async EmailExists(email){
        try{
            return await UserRepository.checkEmail(email)
        }
        catch(error){
            throw new Error(`Check email error: ${error.message}`)
        }
    }

    async getUserByEmail(email){
        try{
            return await UserRepository.getUserUsingEmail(email)
        }
        catch(error){
            throw new Error(`Get user by email Error: ${error.message}`)
        }
    }
}

module.exports = new UserService