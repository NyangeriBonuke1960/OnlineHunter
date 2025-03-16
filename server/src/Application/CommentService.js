const Comment = require('../Domain/Comment')
const CommentRepository = require('../repositories/CommentRepository')

class CommentService{
    async createComment(text, userId, postId, parentId){
        try{
            const createComment = new Comment(text, userId, postId, parentId)
            const savedComment = await CommentRepository.saveComment(createComment)
            return savedComment
        }
        catch(error){
            throw new Error(`Create comment error ${error.message}`)
        }
    }

    async getComments(postId){
        try{
            const comments = await CommentRepository.fetchComments(postId)
            return comments
        }
        catch(error){
            throw new error(`Get comments error: ${error.message}`)
        }
    }
}

module.exports = new CommentService