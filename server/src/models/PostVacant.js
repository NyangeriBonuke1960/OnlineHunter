const mongoose = require('mongoose')

const PostVacantSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    images: [
        {type: String}
    ],
    videos: [
        {type: String}
    ],
    description: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [

    ]
},
{
    timestamps: true
})