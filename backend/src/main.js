const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./routes');
const mongoose = require("mongoose");
require('dotenv').config(); // loads environment variables from a .env file into process.env


async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database. \n', error);
    }
}

const app = express();

app.use(express.json()); // for parsing application/json
//app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded (if needed)
app.use(cors()); // cross-origin resource sharing
app.use(helmet()); // security middleware (https://helmetjs.github.io/)

app.use('/api', router());


connect().then(r => {});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

