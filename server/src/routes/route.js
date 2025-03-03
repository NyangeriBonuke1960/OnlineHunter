const express = require('express')
const upload = require('../middlewares/upload')
const PropertyController = require('../Controllers/PropertyController')
const router = express.Router()

router.post('/create_property_account', PropertyController.postProperty)

module.exports = router