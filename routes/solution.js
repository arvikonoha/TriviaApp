const routes = require('express').Router()
const passport = require('../passport-init')
const controllers = require('../controllers')

routes.use(passport.authenticate('jwt', { session: false }))
routes.post('/', controllers.solution.create)

/**
 * My submissions
 * Scores (Dynamically generated)
 * Order by scores
 */

module.exports = routes