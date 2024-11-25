const Organization = require('../models/organization.model')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// login organization
const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const organization = await Organization.login(email, password);

        // create a token
        const token = createToken(organization._id)

        res.status(200).json({email, token})
      } catch (error) {
        res.status(400).json({error: error.message})
      } 
}

// signup organization
const register = async (req, res) => {
    const { Email, Password, Name, Type, Category, Desc, Website, Location } = req.body;

    try {
      const organization = await Organization.register(
        Email, Password, Name, Type, Category, Desc, Website, Location);
  
      // create jwt
      const token = createToken(organization._id)
  
      res.status(200).json({Email, token})
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  };
  
  module.exports = {
    login,
    register
  };