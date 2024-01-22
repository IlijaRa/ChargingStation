const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;

const User = require('./models/userModel');

const cookieExtractor = request => {
    let token = null;
    if (request && request.cookies) {
        token = request.cookies["access_token"];
    }

    return token;
}

// Authorization
passport.use(new jwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: 'chargingStations'
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

// Authentication local strategy using username and password
passport.use(new localStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false);
        }
        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));