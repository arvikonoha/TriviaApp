const orm = require('../orm')
module.exports.create = async (req, res) => {
    try {
        const author = req.user
        const {quizID, answers, timetaken} = req.body
        const response = await orm.solution.create({
            author: author.id,
            quizID,
            answers,
            timetaken
        })
        res.json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal error'})
    }
}
