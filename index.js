const express = require('express')
const app = express()
const cors = require('cors')
const discussion = require('./chat-init');
const swaggerDocs = require('./swagger-init')

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

app.listen(4564, () => {
    let chatConnectionRetry = 5;
    /**
     * Function to check if discussions are enabled for the quiz, checks after exponential delay
     */
    function checkConnection() {
        if (discussion.connected) {
            console.log('Discussion enabled !')
        } else if (chatConnectionRetry) {
            setTimeout(checkConnection, (2**(5-chatConnectionRetry)) * 1000)
            chatConnectionRetry--;
        } else {
            console.log('Failed to enable discussion ')
        }
    }
    checkConnection()
})
swaggerDocs(app, 4564)