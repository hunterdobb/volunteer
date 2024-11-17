const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');


// builds a router object that nests all the routes
module.exports = function() {
    const route = express.Router();
    authRoute(route);
    userRoute(route);
    // todo: add more routes here
    return route;
}