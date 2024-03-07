const orm = require('../orm')
const crypto = require('crypto')

module.exports.get = async function get(req, res) {
    let filter = {}
    let page = 0
    let select = ''
    const textFilters = ['title']
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
            filter = Object.entries(req.query).reduce((accumulator, [key, value]) => {
                if (textFilters.includes(key))
                    accumulator[key] = { $regex: `^${value}`, $options: 'i' }
                else accumulator[key] = value
                return accumulator
            }, {})
            
            select = 'title _id category'
        }
        const response = await orm.quiz.list(filter, page, select)
        return res.json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal server error'})
    }
}

module.exports.post = async function post(req, res) {
    try {
        const quizDetails = req.body
        const questionTitles = quizDetails.questions.map(({title}) => title).join();
        const dataToHash = `${quizDetails.title}${quizDetails.difficulty}${quizDetails.source}${quizDetails.category.sort()}${questionTitles}`;
        const hash = crypto.createHash('sha256');
        hash.update(dataToHash)
        quizDetails.hash = hash.digest('hex');
        const response = await orm.quiz.create(quizDetails)
        return res.json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal server error'})
    }
}

module.exports.submissions = async (req, res) => {
    try {
        const {id} = req.params
        const user = req.user.id
        const submissions = await orm.solution.listSubmissions(user, id)
        return res.json(submissions)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal error'})
    }
}

module.exports.leaderboard = async (req, res) => {
    try {
        const {id} = req.params
        const rankings = await orm.solution.listRankings(id)
        return res.json(rankings)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal error'})
    }
}