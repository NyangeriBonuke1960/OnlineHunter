class Comment{
    constructor(text, userId, postId, parentId){
        if(!text || !userId || !postId){
            throw new Error('Text, userid, postid and parentid are required')
        }

        this.text = text
        this.userId = userId
        this.postId = postId
        this.parentId = parentId || null
    }
}

module.exports = Comment