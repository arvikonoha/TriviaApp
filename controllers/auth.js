const orm = require('../orm')
const axios =  require('axios')
module.exports.register = async function register(req, res) {
    try {
        const response = await axios.post('http://localhost:4329/auth/register', req.body)
        if (response.status === 200) {
            const {token, user} = response.data
            await orm.users.create(user)
            return res.json({token})
        } else {
            res.status(response.status).json(response.data)
        }
    } catch (error) {
        res.json({error: 'Internal server error'})
    }
}

module.exports.login = async function login(req, res) {
    try {
        const response = await axios.post('http://localhost:4329/auth/login', req.body)
        res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error)
        res.json({error: 'Internal server error'})
    }
}
