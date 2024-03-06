const routes = require('express').Router()
const controllers = require('../controllers')

routes.put('/:name', controllers.discuss.getOrCreateDiscussion)
routes.get('/:name', controllers.discuss.getQuizComments)

module.exports = routes