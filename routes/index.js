const routes = require('express').Router()

routes.use('/auth', require('./auth'))
routes.use('/quiz', require('./quiz'))
routes.use('/solution', require('./solution'))

module.exports = routes