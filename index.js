import express from "express";
import { PORT, mongoDbUrl } from "./config.js";
import { mongoose } from 'mongoose';
import driverRoutes from "./routes/driverRoutes.js";

const app = express();
const api = "api";

app.use(express.json());

app.get("/", (request, response) => {
    console.log(request)
    return response.status(234).send("Charging station application")
})

app.get(`/${api}/Drivers`, driverRoutes);

mongoose.connect(mongoDbUrl).then(() => {
    console.log(`App successfully connected to database`);
    app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
    })
}).catch((error) => {
    console.log(`App failed to connect to database: ${error}`);
});