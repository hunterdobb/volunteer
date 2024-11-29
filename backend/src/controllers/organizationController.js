const Organization = require('../models/organization.model')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// login organization
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const organization = await Organization.login(email, password);
    const token = createToken(organization._id)
    res.status(200).json({ email, token })
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

    // create jwt
    const token = createToken(organization._id)

    res.status(200).json({ Email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// get account info
const getAccount = async (req, res) => {
  const organization = await Organization.findById(req.organizationUser._id)
  if (!organization) {
    return res.status(404).json({ error: 'No organization found' })
  }

  res.status(200).json(organization)
}


// get public info (not including login info)
const getPublicInfo = async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Invalid organization id' })
  }

  const organization = await Organization.findOne({ _id: id }, { Email: 0, Password: 0, _id: 0, Volunteers: 0 })
  if (!organization) {
    return res.status(404).json({ error: 'No organization found' })
  }

  res.status(200).json(organization)
}


// get public info (not including login info)
const getAll = async (req, res) => {
  const all = await Organization.find({}, { Email: 0, Password: 0, _id: 0, Volunteers: 0 })
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
  getAccount,
  updateAccount,
  getPublicInfo,
  getAll
};