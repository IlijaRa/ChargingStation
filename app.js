const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const PORT = 5555;
const dbUrl = 'mongodb+srv://admin:admin@chargingstationsmongodb.gxgr2hi.mongodb.net/?retryWrites=true&w=majority';

app.use(cookieParser());
app.use(express.json());

mongoose.connect(dbUrl).then(() => {
    console.log(`App successfully connected to database`);
    app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
    })
}).catch((error) => {
    console.log(`App failed to connect to database: ${error}`);
});

const User = require('./models/userModel');

const userInput = {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-01-15T00:00:00.000Z",
    username: "johndoe",
    emailAddress: "john.doe@example.com",
    password: "securePassword123",
    role: "driver",
    isBlocked: false
};

const user = new User(userInput);
user.save();