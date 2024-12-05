const Event = require('../models/event.model');
const Organization = require('../models/organization.model');
const Volunteer = require('../models/volunteer.model');
const { sendEventEmail } = require('./emailController');
const mongoose = require('mongoose');

// Let organizations create events
const createEvent = async (req, res) => {
  try {
    const { Location, Date, Description, Title, VolsNeeded, EndTime, StartTime } = req.body;

    if (!Location || !Date || !Description || !Title || !VolsNeeded || !EndTime || !StartTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const orgID = req.organizationUser._id; // Extracted from orgRequireAuth middleware
    const newEvent = await Event.create({
      OrgID: orgID,
      Location,
      Date,
      Description,
      Title,
      VolsNeeded,
      CurrentVols: 0,
      EndTime,
      StartTime,
      Volunteers: [],
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get all the events matching an organization ID (newest to oldest)
const getOrganizationEvents = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid organization ID' });
    }

    const events = await Event.find({ OrgID: id }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching organization events:', error.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Sign up for an event as a volunteer
const joinEvent = async (req, res) => {
  const { eventID } = req.params;
  const vol_id = req.volunteerUser._id;

  if (!eventID) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const volunteer = await Volunteer.findOne({ _id: vol_id }, { Password: 0 });
  if (!volunteer) {
    return res.status(404).json({ error: 'Volunteer not found' });
  }

  const event = await Event.findOne({ _id: eventID });
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  if (event.VolsNeeded == 0) {
    return res.status(400).json({ error: 'Event is full' });
  }

  const organization = await Organization.findOne({ _id: event.OrgID });
  if (!organization) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  // Check if volunteer is already signed up
  const myEvents = volunteer.Events;
  if (myEvents.includes(eventID)) {
    return res.status(400).json({ error: 'Already signed up' });
  }

  // Add event to volunteer's Events
  myEvents.push(eventID);
  try {
    await Volunteer.updateOne({ _id: vol_id }, { Events: myEvents });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error joining event' });
  }

  // Add volunteer to organization's event
  const eventVolunteers = event.Volunteers;
  if (!eventVolunteers.includes(vol_id)) {
    eventVolunteers.push(vol_id);
    await Event.updateOne(
      { _id: event._id },
      {
        Volunteers: eventVolunteers,
        CurrentVols: event.CurrentVols + 1,
        VolsNeeded: event.VolsNeeded - 1,
      }
    ).catch((err) => {
      console.log(err);
      return res.status(500).send({ error: 'Error signing up' });
    });
  }

  res.send({ success: 'Signed up' });
};

// Get all events (newest to oldest)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching all events:', error.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get a single event
const getSingleEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'No event found' });
  }

  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ error: 'No event found' });
  }

  res.status(200).json(event);
};

// Delete an event
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'No event found' });
  }

  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    return res.status(400).json({ error: 'Unable to delete the event' });
  }

  res.status(200).json(event);
};

// Update an event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'No event found' });
  }

  const event = await Event.findByIdAndUpdate(id, { ...req.body });
  if (!event) {
    return res.status(400).json({ error: 'Unable to update the event' });
  }

  res.status(200).json(event);
};

// Get all events happening today
const getTodaysEvents = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await Event.find({ StartTime: { $gte: today, $lt: tomorrow } });
};

// Get all past events
const getOldEvents = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return await Event.find({ Date: { $lt: today } });
};

module.exports = {
  createEvent,
  getOrganizationEvents,
  getAllEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent,
  getTodaysEvents,
  getOldEvents,
  joinEvent,
};
