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
            return res.status(response.status).json(response.data)
        }
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
    }
}

module.exports.login = async function login(req, res) {
    try {
        const response = await axios.post('http://localhost:4329/auth/login', req.body)
        if (response.status === 200) {
            const {token, user} = response.data

            const existingUser = await orm.users.findByName(user.name)
            if (existingUser === null) await orm.users.create(user)
            return res.status(response.status).json({token})
        }
        return res.status(response.status).json(response.data)
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
    }
}
