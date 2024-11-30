const Organization = require('../models/organization.model')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// login organization
const login = async (req, res) => {
  const { Email, Password } = req.body

  try {
    const organization = await Organization.login(Email, Password);
    const token = createToken(organization._id)
    res.status(200).json({ email: Email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// signup organization
const register = async (req, res) => {
  const { Email, Password, Name, Type, Category, Desc, Website, Location } = req.body;

  try {
    const organization = await Organization.register(
      Email, Password, Name, Type, Category, Desc, Website, Location
    );
    const token = createToken(organization._id)
    res.status(200).json({ email: Email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// get public info (not including login info)
const getOrganization = async (req, res) => {
  const { _id } = req.params
  if (!mongoose.isValidObjectId(_id)) {
    console.log(_id)
    return res.status(404).json({ error: 'Invalid organization id' })
  }

  const organization = await Organization.findOne({ _id }, { Password: 0 })
  if (!organization) {
    return res.status(404).json({ error: 'No organization found' })
  }

  res.status(200).json(organization)
}


// get public info (not including login info)
const getAllOrganizations = async (req, res) => {
  const all = await Organization.find({}, { Password: 0 })
  if (!all) { return res.status(404).json({ error: 'No organizations found' }) }
  res.status(200).json(all)
}


// update account info
const updateAccount = async (req, res) => {
  try {
    const organization = await Organization.updateAccount(req.organizationUser._id, { ...req.body })
    res.status(200).json(organization)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  login,
  register,
  updateAccount,
  getOrganization,
  getAllOrganizations
};