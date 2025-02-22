const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())
app.use(express())

app.get('/', (req, res) => {
    console.log('Welcome to my server')
})

module.exports = app