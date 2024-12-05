const jwt = require('jsonwebtoken');
const Organization = require('../models/organization.model');

const orgRequireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.organizationUser = await Organization.findById(_id);
    if (!req.organizationUser) {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = orgRequireAuth;