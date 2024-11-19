const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const volunteerRoute = require('./volunteer.route');
const organizationRoute = require('./organization.route');

// builds a router object that nests all the routes
module.exports = function() {
    const route = express.Router();
    authRoute(route);
    userRoute(route);
    volunteerRoute(route);
    organizationRoute(route);
    // todo: add more routes here
    return route;
}