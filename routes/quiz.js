const passport = require('../passport-init')

const routes = require('express').Router()
const controllers = require('../controllers')

routes.use(passport.authenticate('jwt', { session: false }))
routes.get('/', controllers.quiz.get)
routes.get('/:id', controllers.quiz.get)
routes.post('/', controllers.quiz.post)
routes.post('/bulk', controllers.quiz.bulk)
routes.get('/:id/submissions', controllers.quiz.submissions)

module.exports = routes