class User{
    constructor(name, email, password) {
        if(!name || !email || !password){
            throw new Error('Name, email or password missing')
        }

        this.name = name
        this.email = email
        this.password = password
    }

    isValidEmail() {
        return /^\S+@\S+\.\S+$/.test(this.email);
    }

    isValid() {
        return !!this.title && !!this.email;
    }
}

module.exports = User