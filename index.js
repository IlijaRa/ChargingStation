import express, { json } from "express";
import { PORT, mongoDbUrl } from "./config.js"
import { mongoose } from 'mongoose'
import { User } from "./models/userModel.js";

const app = express();
const api = "api";

app.use(express.json());

app.get("/", (request, response) => {
    console.log(request)
    return response.status(234).send("Charging station application")
})

app.post(`/${api}/Users/AddUser`, async (request, response) => {
    try{
        if(!request.body.firstName || !request.body.lastName || !request.body.username || !request.body.dateOfBirth || !request.body.emailAddress || !request.body.isBlocked) {
            return response.status(400).send({ 
                message: "Send all required fields: firstName, lastName, username, dateOfBirth, emailAddress, isBlocked" 
            });
        }

        const newUser = {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            username: request.body.username,
            dateOfBirth: request.body.dateOfBirth,
            emailAddress: request.body.emailAddress,
            isBlocked: request.body.isBlocked
        };

        const book = await User.create(newUser);

        return response.status(201).send(book);
    } catch(error) {
        console.log(error.message)
        response.status(500).send({message: error.message });
    }
});

app.get(`/${api}/Users/GetAllUsers`, async (request, response) => {
    try{
        const users = await User.find({});
        return response.status(200).json({
            count: users.length,
            data: users
        });
    } catch(error) {
        console.log(error.message)
        response.status(500).send({message: error.message });
    }
});

mongoose.connect(mongoDbUrl).then(() => {
    console.log(`App successfully connected to database`);
    app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
    })
}).catch((error) => {
    console.log(`App failed to connect to database: ${error}`);
});