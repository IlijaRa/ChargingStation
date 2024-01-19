import express from "express";
import { PORT, mongoDbUrl } from "./config.js"
import { mongoose } from 'mongoose'

const app = express();

app.get("/", (request, response) => {
    console.log(request)
    return response.status(234).send("Charging station application")
})

mongoose.connect(mongoDbUrl).then(() => {
    console.log(`App successfully connected to database`);
    app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
    })
}).catch((error) => {
    console.log(`App failed to connect to database: ${error}`);
});