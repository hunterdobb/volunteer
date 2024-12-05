const Organization = require('../models/organization.model')
const Volunteer = require('../models/volunteer.model')
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


// register organization
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


// get single organization
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


// get all organizations (newst to oldest)
const getAllOrganizations = async (req, res) => {
  const all = await Organization.find({}, { Password: 0 }).sort({ createdAt: -1 })
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

// volunteer subscibe to organization
const subscribe = async (req, res) => {
  const { org_id } = req.params;
  const vol_id = req.volunteerUser._id

  const volunteer = await Volunteer.findOne({ _id: vol_id }, { Password: 0 })
  if (!volunteer) { return res.status(404).json({ error: 'No volunteer found' }) }

  const organization = await Organization.findOne({ _id: org_id }, { Password: 0 })
  if (!organization) { return res.status(404).json({ error: 'No organization found' }) }

  const subscribed = organization.Volunteers.includes(volunteer._id);
  if (subscribed) { return res.status(400).json({ error: 'Already subscribed' }); }

  organization.Volunteers.push(volunteer._id);

  try {
    await Organization.updateOne({ _id: org_id }, { Volunteers: organization.Volunteers })
  } catch (error) {
    return res.status(500).json({ error: 'Error subscribing' });
  }

  // add organization id to volunteers Organization array

  // check if volunteer is already subscribed
  const myOrganizations = volunteer.Organizations;
  if (myOrganizations.includes(org_id)) { return res.status(400).json({ error: 'Already subscribed' }) }

  // add organization to volunteers Organizations array
  myOrganizations.push(org_id);
  try {
      await Volunteer.updateOne({ _id: vol_id }, { Organizations: myOrganizations })
  } catch (error) {
      return res.status(500).json({ error: 'Error subscribing' })
  }

  res.status(200).send({ success: 'Subscribed' });
}


// volunteer unsubscribe from organization
const unsubscribe = async (req, res) => {
  const { org_id } = req.params;
  const vol_id = req.volunteerUser._id

  const volunteer = await Volunteer.findOne({ _id: vol_id }, { Password: 0 })
  if (!volunteer) { return res.status(404).json({ error: 'No volunteer found' }) }

  const organization = await Organization.findOne({ _id: org_id }, { Password: 0 })
  if (!organization) { return res.status(404).json({ error: 'No organization found' }) }

  const subscribed = organization.Volunteers.includes(volunteer._id);
  if (!subscribed) { return res.status(400).json({ error: 'Already unsubscribed' }); }

  organization.Volunteers.splice(organization.Volunteers.indexOf(vol_id), 1)

  try {
    await Organization.updateOne({ _id: org_id }, { Volunteers: organization.Volunteers })
  } catch (error) {
    return res.status(500).json({ error: 'Error unsubscribing' });
  }

  // ensure volunteer is currently subscribed
  const myOrganizations = volunteer.Organizations;
  if (!myOrganizations.includes(org_id)) { return res.status(500).json({ error: 'Not currently subscibed' }) }

  // remove orgaization from volunteers Organizations
  myOrganizations.splice(myOrganizations.indexOf(org_id), 1)

  try {
      await Volunteer.updateOne({ _id: vol_id }, { Organizations: myOrganizations })
  } catch (error) {
      return res.status(500).json({ error: "Error unsubscribing" })
  }

  res.status(200).send({ success: 'Unubscribed' });
}


// get all the orgaizations a volunteer is subscribed to. (newest to oldest)
const getVolunteerSubscribedOrganizations = async (req, res) => {
  const { volID } = req.params

  const volunteer = await Volunteer.findOne({ _id: volID }, { Password: 0 })
  if (!volunteer) { return res.status(404).json({ error: 'No volunteer found' }) }
  const myOrganizations = volunteer.Organizations

  const orgaizations = await Organization.find({ _id: { $in: myOrganizations } }).sort({ createdAt: -1 })
  res.status(200).json(orgaizations)
}


module.exports = {
  login, register, updateAccount,
  getOrganization, getAllOrganizations,
  subscribe, unsubscribe, getVolunteerSubscribedOrganizations
};