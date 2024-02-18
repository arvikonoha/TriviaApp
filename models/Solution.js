const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    quizID: {
        type: mongoose.Schema.ObjectId,
        ref: 'quiz',
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    answers: [{
        question: {
            type: String,
            required: true,
        },
        answer: String,
    }],
    timetaken: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('solution', Schema)