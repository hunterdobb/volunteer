const Event = require('../models/event.model')
const mongoose = require('mongoose')

// let organizations create events
const createEvent = async (req, res) => {
    const { Location, Date, Description, Title, VolsNeeded, EndTime, StartTime } = req.body;

    if (!Location || !Date || !Description || !Title || !VolsNeeded || !EndTime || !StartTime) {
        return res.status(400).send({ error: 'Invalid parameters' });
    }

    try {
        // _id for the currently logged in organization
        const org_id = req.organizationUser._id

        const event = await Event.create({
            Location, Date, Description, OrgID: org_id,
            Title, VolsNeeded, CurrentVols: 0,
            EndTime, StartTime, Volunteers: []
        })
        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// get all the events matching the organization id. (newest to oldest)
const getOrganizationEvents = async (req, res) => {
    const { id } = req.params
    const events = await Event.find({ OrgID: id }).sort({ createdAt: -1 })
    res.status(200).json(events)
}

// (newest to oldest)
const getAllEvents = async (req, res) => {
    const events = await Event.find().sort({ createdAt: -1 })
    res.status(200).json(events)
}

const getSingleEvent = async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ error: 'No event found' })
    }

    const event = await Event.findById(id)
    if (!event) {
        return res.status(404).json({ error: 'No event found' })
    }

    res.status(200).json(event)
}

const deleteEvent = async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ error: 'No event found' })
    }

    const event = await Event.findByIdAndDelete(id)
    if (!event) {
        return res.status(400).json({ error: 'Unable to delete the event' })
    }

    res.status(200).json(event)
}

// update a event
const updateEvent = async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ error: 'No event found' })
    }

    const event = await Event.findByIdAndUpdate(id, { ...req.body })
    if (!event) {
        return res.status(400).json({ error: 'Unable to update the event' })
    }

    res.status(200).json(event)
}

module.exports = {
    createEvent, 
    getOrganizationEvents, 
    getAllEvents, 
    getSingleEvent, 
    deleteEvent, 
    updateEvent
};