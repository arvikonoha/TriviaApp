const orm = require('../orm')
const crypto = require('crypto')

module.exports.get = async function get(req, res) {
    let filter = {}
    let page = 0
    let select = ''
    try {
        if (req.params.id) {
            filter = {_id: req.params.id}
            select = {
                title: 1,
                category: 1,
                _id: 1,
                time: 1,
                'questions._id': 1,
                'questions.title': 1,
                'questions.description': 1,
                'questions.options.description': 1,
            }
        } else {
            page = req.query.page
            delete req.query.page
            filter = req.query
            select = 'title _id category'
        }
        const response = await orm.quiz.list(filter, page, select)
        res.json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports.post = async function post(req, res) {
    try {
        const quizDetails = req.body
        const dataToHash = quizDetails.title+ quizDetails.difficulty + JSON.stringify(quizDetails.category.sort());
        const hash = crypto.createHash('sha256');
        hash.update(dataToHash)
        quizDetails.hash = hash.digest('hex');
        const response = await orm.quiz.create(quizDetails)
        res.json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports.bulk = async function bulk(req, res) {
    try {
        const quizList = req.body
        const response = await orm.quiz.createMany(quizList)
        res.json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports.submissions = async (req, res) => {
    try {
        const {id} = req.params
        const user = req.user.id
        const submissions = await orm.solution.listSubmissions(user, id)
        res.json(submissions)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal error'})
    }
}