class Property{
    constructor(upi, title, location, description='', email='', phoneNumber='', images=[], videos=[], role){
        if(!upi || !title || !location){
            throw new Error('UPI, title and location are required')
        }

        this.upi = upi;
        this.title = title;
        this.location = location;
        this.description = description;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.images = images;
        this.videos = videos;
        this.role = role
        this.createdAt = new Date()
        this.updatedAt = new Date()
    }

    isValidEmail(){
        return /^\S+@\S+\.\S+$/.test(this.email)
    }

    isValidPhoneNumber(){
        return /^\+?\d{7, 15}$/.test(this.phoneNumber)
    }

    isValid(){
        return !!this.upi && !!this.title && !!this.location
    }
}

module.exports = Property