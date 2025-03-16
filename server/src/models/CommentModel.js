const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    postId: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

CommentSchema.index({postId: 1, parentId: 1})

module.exports = mongoose.model('Comment', CommentSchema)