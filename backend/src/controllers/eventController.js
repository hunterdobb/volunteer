const Event = require('../models/event.model')
const Organization = require('../models/organization.model')
const Volunteer = require('../models/volunteer.model')
const { sendEventEmail } = require('./emailController')
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

        // add eventID to Organization Events array
        const organization = await Organization.findOne({ _id: org_id })
        if (!organization) { return res.status(404).json({ error: 'Organization not found' }) }

        const orgEvents = organization.Events;
        orgEvents.push(event._id);

        try {
            await Organization.updateOne({ _id: org_id }, { Events: orgEvents })
        } catch (error) {
            console.log(err);
            return res.status(500).json({ error: 'Unable to add the Event to your Organization' })
        }

        res.status(200).json(event)

        // send email to all volunteers (subscribers) of the organization
        const org = await Organization.findById(org_id);
        const volunteers = await org.Volunteers; // subscribers
        await Promise.all(volunteers.map(async (vol_id) => {
            const volunteer = await Volunteer.findById(vol_id);
            await sendEventEmail(volunteer.Email, event, org);
            await new Promise((resolve) => setTimeout(resolve, 200));
        }));

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};


// join an event as volunteer
const joinEvent = async (req, res) => {
    const { eventID } = req.params
    const vol_id = req.volunteerUser._id
    if (!eventID) { return res.status(400).json({ error: 'Invalid parameters' }) }

    const volunteer = await Volunteer.findOne({ _id: vol_id }, { Password: 0 })
    if (!volunteer) { return res.status(404).json({ error: 'Volunteer not found' }) }

    const event = await Event.findOne({ _id: eventID })
    if (!event) { return res.status(404).json({ error: 'Event not found' }) }
    
    if (event.VolsNeeded == 0) { return res.status(400).json({ error: 'Event is full' }); }

    const organization = await Organization.findOne({ _id: event.OrgID })
    if (!organization) { return res.status(404).json({ error: 'Organization not found' }) }

    // check if volunteer is already signed up
    const myEvents = volunteer.Events;
    if (myEvents.includes(eventID)) { return res.status(400).json({ error: 'Already signed up' }) }

    // add event to volunteers Events
    myEvents.push(eventID);
    try {
        await Volunteer.updateOne({ _id: vol_id }, { Events: myEvents })
    } catch (error) {
        console.log(err);
        return res.status(500).json({ error: 'Error joining event' })
    }

    // add volunteer to organizations event
    const eventVolunteers = event.Volunteers;
    if (!eventVolunteers.includes(vol_id)) {
        eventVolunteers.push(vol_id);
        await Event.updateOne({ _id: event._id }, {
            Volunteers: eventVolunteers,
            CurrentVols: event.CurrentVols + 1,
            VolsNeeded: event.VolsNeeded - 1
        }).catch(err => {
            console.log(err);
            return res.status(500).send({ error: 'Error joining event' })
        })
    }

    res.send({ success: 'Signed up' });
}


// leave an event as volunteer
const leaveEvent = async (req, res) => {
    const { eventID } = req.params
    const vol_id = req.volunteerUser._id
    if (!eventID) { return res.status(400).json({ error: 'Invalid parameters' }) }

    const volunteer = await Volunteer.findOne({ _id: vol_id }, { Password: 0 })
    if (!volunteer) { return res.status(404).json({ error: 'Volunteer not found' }) }

    const event = await Event.findOne({ _id: eventID })
    if (!event) { return res.status(404).json({ error: 'Event not found' }) }
    // if (event.VolsNeeded == 0) { return res.status(400).json({ error: 'Event is full' }); }

    const organization = await Organization.findOne({ _id: event.OrgID })
    if (!organization) { return res.status(404).json({ error: 'Organization not found' }) }

    // ensure volunteer is currently joined
    const myEvents = volunteer.Events;
    if (!myEvents.includes(eventID)) { return res.status(500).json({ error: 'Already left event' }) }

    // remove event from volunteers Events
    myEvents.splice(myEvents.indexOf(eventID), 1)

    try {
        await Volunteer.updateOne({ _id: vol_id }, { Events: myEvents })
    } catch (error) {
        console.log(err);
        return res.status(500).json({ error: "Error leaving event" })
    }

    // remove volunteer from organizations event
    const eventVolunteers = event.Volunteers;
    if (eventVolunteers.includes(vol_id)) {
        eventVolunteers.splice(eventVolunteers.indexOf(vol_id), 1)

        await Event.updateOne({ _id: event._id }, {
            Volunteers: eventVolunteers,
            CurrentVols: event.CurrentVols - 1,
            VolsNeeded: event.VolsNeeded + 1
        }).catch(err => {
            console.log(err);
            return res.status(500).send({ error: 'Error leaving event' })
        })
    }

    res.status(200).json({ success: 'Successfully left event' });
}


// get all the events matching an organization id. (newest to oldest)
const getOrganizationEvents = async (req, res) => {
    const { id } = req.params
    const events = await Event.find({ OrgID: id }).sort({ createdAt: -1 })
    res.status(200).json(events)
}


// get all the events matching a volunteer id. (newest to oldest)
const getVolunteerJoinedEvents = async (req, res) => {
    const { volID } = req.params

    const volunteer = await Volunteer.findOne({ _id: volID }, { Password: 0 })
    if (!volunteer) { return res.status(404).json({ error: 'No volunteer found' }) }
    const myEvents = volunteer.Events

    const events = await Event.find({ _id: { $in: myEvents } }).sort({ createdAt: -1 })
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
    const org_id = req.organizationUser._id

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ error: 'No event found' })
    }

    const organization = await Organization.findOne({ _id: org_id })
    if (!organization) { return res.status(404).json({ error: 'Must be signed in' }) }

    const event = await Event.findByIdAndDelete(id)
    if (!event) { return res.status(400).json({ error: 'Unable to delete the event' }) }

    // remove the event id from Organizations events array
    const orgEvents = organization.Events;
    orgEvents.splice(orgEvents.indexOf(id), 1)

    try {
        await Organization.updateOne({ _id: org_id }, { Events: orgEvents })
    } catch (error) {
        return res.status(500).json({ error: 'Unable to delete the Event' })
    }

    res.status(200).json(event)
}


// update an event
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


// get all events happening today
const getTodaysEvents = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    console.log(today, tomorrow);
    let events = await Event.find({ StartTime: { $gte: today, $lt: tomorrow } })
    return events;
}


// get all events that have already happened
const getOldEvents = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return await Event.find({ Date: { $lt: today } });
}


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
    leaveEvent,
    getVolunteerJoinedEvents
};