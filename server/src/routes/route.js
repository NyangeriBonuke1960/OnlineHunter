const express = require('express')
const upload = require('../middlewares/upload')
const PropertyController = require('../Controllers/PropertyController')
const CommentController = require('../Controllers/CommentController')
const UserController = require('../Controllers/UserController')
const router = express.Router()


/**User Account */
router.post('/signup', UserController.signup)
router.post('/login', UserController.login)
router.post('/user_refreshtoken', UserController.refreshToken)
router.post('/logout', UserController.logout)

/**Property Account */
router.post('/create_property_account', PropertyController.postProperty)

/**Comments */
router.post('/create_comment', CommentController.postComment)
router.get('/get_comments/:postId', CommentController.getComments)

module.exports = router