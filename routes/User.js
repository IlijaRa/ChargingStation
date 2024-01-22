const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const jwt = require('jsonwebtoken');
const User =require('../models/userModel');

const signToken = userId => {
    return jwt.sign({
        iss: "chargingStations",
        sub: userId
    }, "chargingStations", { expiresIn: "1h" });
}

userRouter.post('/register', async (request, response) => {
    try {
        const { firstName, lastName, dateOfBirth, username, emailAddress, password, role, isBlocked } = request.body;
        const existingUser = await User.findOne({ username });
    
        if (existingUser) {
            return response.status(400).json({ message: { msgBody: "Username is already taken.", msgError: true } });
        }
    
        const newUser = new User({firstName, lastName, dateOfBirth, username, emailAddress, password, role, isBlocked});      
        newUser.save();

        return response.status(201).json({ message: { msgBody: "Account successfully created.", msgError: false } });
    } catch (error) {
        console.error('Error during user registration:', error);
        response.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
    }
});

userRouter.post('/login', passport.authenticate('local', { session: false }), async (request, response) => {
    if (!request.isAuthenticated()) {
        return response.status(400).json({ message: { msgBody: "Your authentication failed, contact the admin for more information.", msgError: true } });
    }

    const { _id, firstName, lastName, dateOfBirth, username, emailAddress, password, role, isBlocked } = request.user;
    const token = signToken(_id);
    response.cookie('access_token', token, { httpOnly: true, sameSite: true });
    response.status(200).json({isAuthenticated: true, user: { username, role }})
});

userRouter.post('/logout', passport.authenticate('jwt', { session: false }), async (request, response) => {
    response.clearCookie('access_token');
    response.json({ user: { username: "", role: "" }, success: true });
});

userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), async (request, response) => {
    const { username, role } = request.user;
    response.status(200).json({ isAuthenticated: true, user: { username, role }});
});

module.exports = userRouter;