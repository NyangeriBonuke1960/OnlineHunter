const mongoose = require('mongoose')

const PropertySchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        match: [/^\+?\d{7, 15}$/, 'Please enter a valid phone number'],
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        trim: true
    },
    images: [
        {   type: String,
            trim: true
        }
    ],
    videos: [
        {   type: String,
            trim: true
        }
    ],
    role: {
        type: String,
        enum: ["manager"],
        default: "manager"
    },
    refreshTokens: [{
        token: {type: String, required: true},
        blacklisted: {type: Boolean, default: false},
        createdAt: {type: String, default: Date.now, expires: '7d'}
    }]
},
{
    timestamps: true
})

const PropertyModel = mongoose.model('Property', PropertySchema)
module.exports = PropertyModel