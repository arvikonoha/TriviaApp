const mongoose = require('mongoose')

const Quiz = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
    },
    source: {
        type: String,
        default: 'self',
    },
    time: {
        type: String,
        required: true,
        default: '10m'
    },
    difficulty: {
        type: String,
        default: 'Easy'
    },
    category: {
        type: [String],
        default: ['ALL'],
        required: true,
    },
    questions: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            options: {
                type: [{
                    description: {
                        type: String,
                        required: true
                    },
                    isAnswer: {
                        type: String,
                        required: true
                    }
                }],
                validate: {
                validator(array) {
                    return array.length >= 2;
                },
                message: 'Options must have at least 2 items.',
                },
            }
        }
    ]
})

Quiz.index({ 'questions.title': 'text' });
Quiz.index({ 'hash': 1 }, {unique: true});

module.exports = mongoose.model('quiz', Quiz)