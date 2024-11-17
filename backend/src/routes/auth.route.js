const express = require('express');
const sessionMiddleware = require('../middleware/session')

const route = express.Router();

module.exports = function (app) {

    route.post('/login', async (req, res) => {
        let {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).send('Invalid parameters');
        }
        // todo: authorize
        res.send('login route');
    });

    route.post('/register', async (req, res, next) => {
        // todo: register
        res.send('register route');
    })

    app.use('/auth', route);
}