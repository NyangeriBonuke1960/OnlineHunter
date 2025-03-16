const Comment = require('../models/CommentModel')

class CommentRepository{
    async saveComment(data){
        try{
            const newComment = new Comment(data)
            return await newComment.save()
        }
        catch(error){
            throw new Error(`Create comment error ${error.message}`)
        }
    }

    async fetchComments(postId){
        try{
            const comments = await Comment.aggregate([
                {$match: {postId: new mongoose.Types.ObjectId(postId), parentId: null}},
                {$lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "parentId",
                    as: "replies"
                }},
                {$sort: {createdAt: -1}}
            ])
            return comments
        }
        catch(error){
            throw new Error(`Fetch comment error ${error.message}`)
        }
    }
}

module.exports = new CommentRepository