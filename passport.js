const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;

const User = require('./models/userModel');

const cookieExtracor = request => {
    let token = null;
    if (request && request.cookies) {
        token = request.cookies["access_token"];
    }

    return token;
}

// authorization
passport.use(new jwtStrategy({
    jwtFromRequest : cookieExtracor,
    secretOrKey : 'chargingStations'
}, (payload, done) => {
    User.findById({_id: payload.sub}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
}));

// authentication local strategy using username and password
passport.use(new localStrategy((username, password, done) => {
    User.findOne({username}, (err, user) => {
        //something went wrong with database
        if (err) {
            return done(err);
        }
        // no user exist
        if (!user) {
            return done(null, false);
        }
        // check if password is correct
        user.comparePassword(password, done);
    });
}));