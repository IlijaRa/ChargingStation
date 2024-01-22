const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/User');
const vehicleRouter = require('./routes/Vehicle');
const chargerRouter = require('./routes/Charger');
const appointmentRouter = require('./routes/Appointment');

const api = 'api';
const PORT = 5555;
const dbUrl = 'mongodb+srv://admin:admin@chargingstationsmongodb.gxgr2hi.mongodb.net/?retryWrites=true&w=majority';

app.use(cookieParser());
app.use(express.json());
app.use(cors());

mongoose.connect(dbUrl).then(() => {
    console.log(`App successfully connected to database`);
    app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
    })
}).catch((error) => {
    console.log(`App failed to connect to database: ${error}`);
});

app.use(`/${api}/users`, userRouter);
app.use(`/${api}/vehicles`, vehicleRouter);
app.use(`/${api}/chargers`, chargerRouter);
app.use(`/${api}/appointments`, appointmentRouter);