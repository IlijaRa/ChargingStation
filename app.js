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