const mongoose = require('mongoose')

const PropertySchema = mongoose.Schema({
    upi: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    location: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        match: [/^\+?\d{7, 15}$/, 'Please enter a valid phone number'],
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
    ]
},
{
    timestamps: true
})

const Property = mongoose.model('Property', PropertySchema)
module.exports = Property