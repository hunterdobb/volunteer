module.exports = function (req, res, next) {
    console.log('Session middleware');
    // todo: verify cookie session, if valid call next(), else return 401
    next();
}