const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;

const orm = require('./orm')
const fs = require('fs')
const path = require('path')
const publicKey = fs.readFileSync(path.join(__dirname,'keys','public.key'));

passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey, // Use the public key for verification
      algorithms: ['RS256'], // Specify the algorithm used to sign the token
    },
    async (jwtPayload, done) => {
      const user = await orm.users.findById(jwtPayload.sub)
      if (!user) {
        return done(null, false, { message: 'User not found.' });
      }
  
      return done(null, user);
    }
  ));

module.exports = passport