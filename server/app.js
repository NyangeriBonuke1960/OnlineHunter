const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const router = require('./src/routes/route')
const CookieParser = require('cookie-parser')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(CookieParser())

app.use('/api', router)

module.exports = app