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
        res.status(400).json({error: error.message})
    }
};

module.exports = {
    createEvent
  };