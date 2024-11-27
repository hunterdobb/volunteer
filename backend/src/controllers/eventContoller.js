const Event = require('../models/event.model')
const mongoose = require('mongoose')

// let organizations create events
const createEvent = async (req, res) => {
    let {title, desc, location, date, startTime, endTime, duration, volunteersNeeded} = req.body;
    let orgEmail = req.session.email;
    if (!title || !desc || !location || !date || !startTime || !endTime || !duration || !volunteersNeeded) {
        return res.status(400).send({
            error: 'Invalid parameters'
        });
    }

    // check if organization exists with session email
    let org = await orgModel.findOne({
        Email: orgEmail
    }).exec();
    if (!org) {
        return res.status(400).send({
            error: 'Organization not found'
        });
    }

    // check if event already exists
    let event = await eventModel.findOne({
        Title: title
    }).exec();

    if (event) {
        return res.status(400).send({
            error: 'Event already exists'
        });
    }

    // create event
    await eventModel.create({
        Title: title,
        Description: desc,
        Location: location,
        Date: new Date(startTime),
        StartTime: new Date(startTime),
        EndTime: new Date(endTime),
        VolsNeeded: volunteersNeeded,
        CurrentVols: 0,
        OrgID: org._id
    }).catch(err => {
        console.log(err);
        return res.status(500).send({
            error: 'Error creating event'
        });
    });

    res.send({
        success: 'Event created'
    });
};

module.exports = {
    createEvent
  };