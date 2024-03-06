const axios = require('axios')

module.exports.getOrCreateDiscussion = async (req, res) => {
    try {
        const {name} = req.params
        const response = await axios.put(`http://localhost:4000/rooms/${name}/project/quiz-app`, null, {headers: {
            authorization: req.headers['authorization']
        }})
        return res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Internal server error'})
    }
}

module.exports.getQuizComments = async (req, res) => {
    try {
        const {name} = req.params
        const response = await axios.get(`http://localhost:4000/messages/by-room`, {headers: {
            authorization: req.headers['authorization']
        }, params: {room: name, project: 'quiz-app'}})
        return res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Internal server error'})
    }
}