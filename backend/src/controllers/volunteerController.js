const Volunteer = require('../models/volunteer.model')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// login volunteer
const login = async (req, res) => {
  const { Email, Password } = req.body

  try {
    const volunteer = await Volunteer.login(Email, Password);
    const token = createToken(volunteer._id)
    res.status(200).json({ email: Email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// register volunteer
const register = async (req, res) => {
  const { Email, Password, FirstName, LastName, Birthday } = req.body;

  try {
    const volunteer = await Volunteer.register(
      Email, Password, FirstName, LastName, Birthday
    );

    // create jwt
    const token = createToken(volunteer._id)

    res.status(200).json({ email: Email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// get public info (not including password)
const getVolunteer = async (req, res) => {
  const { _id } = req.params
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(404).json({ error: 'Invalid volunteer id' })
  }

  const volunteer = await Volunteer.findOne({ _id }, { Password: 0 })
  if (!volunteer) { return res.status(404).json({ error: 'No volunteer found' }) }

  res.status(200).json(volunteer)
}

// get public info (not including password)
const getVolunteerFromEmail = async (req, res) => {
  const { Email } = req.params;
  const volunteer = await Volunteer.findOne({ Email })
  if (!volunteer) { return res.status(404).json({ error: 'No volunteer found' }) }

  res.status(200).json(volunteer)
}

// get public info (not including password)
const getAllVolunteers = async (req, res) => {
  const all = await Volunteer.find({}, { Password: 0 }).sort({ createdAt: -1 })
  if (!all) { return res.status(404).json({ error: 'No volunteers found' }) }
  res.status(200).json(all)
}


// update account info
const updateAccount = async (req, res) => {
  try {
    const volunteer = await Volunteer.updateAccount(req.volunteerUser._id, { ...req.body })
    res.status(200).json(volunteer)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  login,
  register,
  updateAccount,
  getVolunteer,
  getAllVolunteers,
  getVolunteerFromEmail
};