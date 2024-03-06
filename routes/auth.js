const routes = require('express').Router()
const controller = require('../controllers').auth
const passport = require('../passport-init')

// Your login route using passport-local and JWT with RSA
routes.post('/register', controller.register)
routes.post('/login', controller.login);

module.exports = routes