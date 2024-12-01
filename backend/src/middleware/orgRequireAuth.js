const jwt = require('jsonwebtoken')
const Organization = require('../models/organization.model')

const orgRequireAuth = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: 'Not authorized' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET)
        // attach the organization _id property to the request so we can access it in other parts of the code
        req.organizationUser = await Organization.findOne({ _id }).select('_id')
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Not authorized' })
    }
}

module.exports = orgRequireAuth


// module.exports = function (req, res, next) {
//     console.log('Session middleware');
//     // todo: verify cookie session, if valid call next(), else return 401
//     // todo: attach session data to req.session
//     req['session'] = {
//         email: 'org1@org.com'
//     }
//     next();
// }