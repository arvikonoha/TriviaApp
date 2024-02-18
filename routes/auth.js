const routes = require('express').Router()
const controller = require('../controllers').auth
const passport = require('../passport-init')

// Your login route using passport-local and JWT with RSA
routes.post('/register', controller.register)
routes.post('/login', passport.authenticate('local', { session: false }), controller.login);

module.exports = routes