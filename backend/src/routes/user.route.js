const express = require('express');
const sessionMiddleware = require('../middleware/session')
const userSchema = require('../models/user.model');
const mongoose = require('mongoose');
const userModel = mongoose.model('Users', userSchema);
const route = express.Router();

module.exports = function (app) {

    route.get('/', async (req, res) => {
        let users = await userModel.find({}).exec();
        res.send(users);
    });

    // users need to be authenticated to access this route
    app.use('/users', [sessionMiddleware], route);
}