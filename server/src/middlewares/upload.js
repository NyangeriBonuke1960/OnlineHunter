const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, '/media')
    },
    fileName: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4']

    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }
    else{
        cb(new Error('Invalid file type. Only images and videos are allowed'))
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 10 * 1024 * 1024},
    fileFilter: fileFilter
})
module.exports = upload