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
    },
    refreshTokens: [{
        token: {type: String, required: true},
        createdAt: {type: String, default: Date.now, expires: '7d'},
        blacklisted: {type: Boolean, default: false}
    }],
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)