const routes = require('express').Router()

routes.use('/auth', require('./auth'))
routes.use('/quiz', require('./quiz'))
routes.use('/solution', require('./solution'))
routes.use('/discuss', require('./discuss'))

module.exports = routes