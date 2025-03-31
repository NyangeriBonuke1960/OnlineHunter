const express = require('express')
const upload = require('../middlewares/upload')
const PropertyController = require('../Controllers/PropertyController')
const CommentController = require('../Controllers/CommentController')
const UserController = require('../Controllers/UserController')
const router = express.Router()


/**User Account */
router.post('/signup', UserController.signup)
router.post('/login', UserController.login)
router.post('/user-refreshtoken', UserController.refreshToken)
router.post('/logout', UserController.logout)
router.post('/change-password', UserController.changePassword)
router.post('/forgot-password', UserController.forgotPassword)
router.post('/password-reset', UserController.resetPassword)

/**Property Account */
router.post('/create-property-account', PropertyController.postProperty)

/**Comments */
router.post('/create_comment', CommentController.postComment)
router.get('/get-comments/:postId', CommentController.getComments)

module.exports = router