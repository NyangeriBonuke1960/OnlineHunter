class Property {
    constructor(title, email, password) {
        if (!title || !email || !password) {
            throw new Error('Title, email and password are required');
        }

        this.title = title;
        this.email = email;
        this.password = password;
       
    }

    isValidEmail() {
        return /^\S+@\S+\.\S+$/.test(this.email);
    }

    isValid() {
        return !!this.title && !!this.email;
    }
}

module.exports = Property;
