const jwt = require('jsonwebtoken')
const Volunteer = require('../models/volunteer.model')

const volRequireAuth = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: 'Not authorized' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET)
        // attach the volunteer _id property to the request so we can access it in other parts of the code
        req.volunteerUser = await Volunteer.findOne({ _id }).select('_id')
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Not authorized' })
    }
}

module.exports = volRequireAuth