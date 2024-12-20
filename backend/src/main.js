require('dotenv').config(); // loads environment variables from a .env file into process.env

// packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require("mongoose");

const organizationRoutes = require('./routes/organization.route')
const eventRoutes = require('./routes/event.route')
const volunteerRoutes = require('./routes/volunteer.route')
const startCronJobs = require('./controllers/cronController')

const app = express();

// middleware
app.use(express.json()); // for parsing application/json
app.use(cors()); // cross-origin resource sharing
app.use(helmet()); // security middleware (https://helmetjs.github.io/)
app.use((req, res, next) => { console.log(req.path, req.method); next() })
//app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded (if needed)
app.use(express.static('public')); // Serve static files

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// routes
app.use('/api/organization', organizationRoutes);
app.use('/api/event', eventRoutes)
app.use('/api/volunteer', volunteerRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
        startCronJobs().then(() => {
            console.log('cron Jobs started')
        })

    })
    .catch((error) => { console.log(error) })