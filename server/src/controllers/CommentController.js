const CommentService = require('../Application/CommentService')

class CommentController{
    async postComment(req, res){
        try{
            const {text, userId, postId, parentId} = req.body
            const comment = await CommentService.createComment(text, userId, postId, parentId)
            res.status(201).json({message: "comment created successfully", comment})
        }
        catch(error){
            res.status(500).json(`Controller error: ${error.message}`)
        }
    }

    async getComments(req, res){
        try{
            const postId = req.params.postId
            if(!postId){
                res.status(400).json('Enter postId')
                return
            }
            
            const comments = await CommentService.getComments(postId)
            res.status(201).json({message: "Comments fetched successfully"}, comments)
        }
        catch(error){
            res.status(500).json(`Controller error: ${error.message}`)
        }
    }
}

module.exports = new CommentController