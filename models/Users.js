const mongoose = require('mongoose')

const User = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('users', User)