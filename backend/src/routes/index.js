const express = require('express');
const userRoute = require('./user.route');
const volunteerRoute = require('./volunteer.route');
const organizationRoute = require('./organization.route');
const eventRoutes = require('./event.route');

// builds a router object that nests all the routes
module.exports = function() {
    const route = express.Router();
    userRoute(route);
    volunteerRoute(route);
    organizationRoute(route);
    eventRoutes(route);
    // todo: add more routes here
    return route;
}