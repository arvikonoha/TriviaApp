const passport = require('passport')
const Users = require('./models/Users')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;

const bcrypt = require("bcrypt")
const orm = require('./orm')
const fs = require('fs')
const path = require('path')
const publicKey = fs.readFileSync(path.join(__dirname,'keys','public-key.pem'));

passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey, // Use the public key for verification
      algorithms: ['RS256'], // Specify the algorithm used to sign the token
    },
    async (jwtPayload, done) => {
      const user = await orm.users.findById(jwtPayload.userId)
      if (!user) {
        return done(null, false, { message: 'User not found.' });
      }
  
      return done(null, user);
    }
  ));
  
passport.use(new LocalStrategy({
  usernameField: 'name',
  passwordField: 'password'
},async (name, password, done) => {
    try {
        const user = await Users.findOne({name})
        if (!user) {
            done(new Error("User name or password is invalid"), null)
        } else {
            const hashedPassword = user.password
            const isValid = await bcrypt.compare(password, hashedPassword)
            if (!isValid) done(new Error("User name or password is invalid"), null)
            else done(null, user)
        }
    } catch (error) {
        done(new Error('Internal server error'), null)
    }
}))

module.exports = passport