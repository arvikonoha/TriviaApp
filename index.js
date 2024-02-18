const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27015/quiz-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Mongo connected successfully")
})

app.use(cors())
app.use(express.json())

const passport = require('./passport-init')
app.use(passport.initialize())
app.use('/', require('./routes'))

app.listen(4564)