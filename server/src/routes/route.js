const express = require('express')
const PropertyController = require('../controllers/PropertyController')
const upload = require('../middlewares/upload')
const router = express.Router()

router.post('/properties', upload.fields([
    {name: "images", maxCount: 5},
    {name: "videos", maxCount: 2}
]), PropertyController.postProperty)

module.exports = router