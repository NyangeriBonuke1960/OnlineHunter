const mongoose = require('mongoose')

const PropertySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
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
    email: {
        type: String,
        required: true,
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
    ],
},
{
    timestamps: true
})

const PropertyModel = mongoose.model('Property', PropertySchema)
module.exports = PropertyModel