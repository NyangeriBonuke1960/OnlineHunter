const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {   
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user" 
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)