const express = require('express');
const {
    createEvent, getOrganizationEvents, getAllEvents, getSingleEvent, deleteEvent, updateEvent
} = require('../controllers/eventContoller')

const orgRequireAuth = require('../middleware/orgRequireAuth')

const router = express.Router()

// public routes
router.get('/', getAllEvents)
router.get('/single/:id', getSingleEvent)
router.get('/organization/:id', getOrganizationEvents)

// routes that require jwt auth (must be logged in with correct org. account)
router.post('/', orgRequireAuth, createEvent)
router.delete('/:id', orgRequireAuth, deleteEvent)
router.patch('/:id', orgRequireAuth, updateEvent)

module.exports = router

// module.exports = function (app) {
//     // sign up for an event as volunteer
//     route.post('/sign-up', async (req, res) => {
//         let {eventID} = req.body;
//         let volunteerEmail = req.session.email; // todo: replace with req.session.email
//         if (!eventID) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }
//         let volunteer = await userModel.findOne({
//             Email: volunteerEmail
//         }).exec();
//         if (!volunteer) {
//             return res.status(400).send({
//                 error: 'Volunteer not found'
//             });
//         }

//         let event = await eventModel.findOne({
//             _id: eventID
//         }).exec();
//         if (!event) {
//             return res.status(400).send({
//                 error: 'Event not found'
//             });
//         }

//         if (!event.VolsNeeded) {
//             return res.status(400).send({
//                 error: 'Event is full'
//             });
//         }

//         let volunteerId = volunteer._id;
//         let org = await orgModel.findOne({
//             _id: event.OrgID
//         }).exec();
//         if (!org) {
//             return res.status(400).send({
//                 error: 'Organization not found'
//             });
//         }
//         // check if volunteer is already signed up
//         let myEvents = volunteer.Events;
//         if (myEvents.includes(eventID)) {
//             return res.status(400).send({
//                 error: 'Already signed up'
//             });
//         }

//         myEvents.push(eventID); // if not, sign up
//         await userModel.updateOne({
//             Email: volunteerEmail
//         }, {
//             Events: myEvents
//         }).catch(err => {
//             console.log(err);
//             return res.status(500).send({
//                 error: 'Error signing up'
//             });
//         });
//         // add volunteer to event
//         let eventVolunteers = event.Volunteers;
//         if (!eventVolunteers.includes(volunteerId)) {
//             eventVolunteers.push(volunteerId);
//             await eventModel.updateOne({
//                 _id: event._id
//             }, {
//                 Volunteers: eventVolunteers,
//                 CurrentVols: event.CurrentVols + 1,
//                 VolsNeeded: event.VolsNeeded - 1
//             }).catch(err => {
//                 console.log(err);
//                 return res.status(500).send({
//                     error: 'Error signing up'
//                 });
//             });
//         }


//         res.send({
//             success: 'Signed up'
//         });
//     });



//     // cancel sign up for an organization as volunteer
//     route.post('/leave', async (req, res) => {
//         let {eventID} = req.body;
//         let volunteerEmail = req.session.email; // todo: replace with req.session.email
//         if (!eventID) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }
//         let volunteer = await userModel.findOne({
//             Email: volunteerEmail
//         }).exec();
//         if (!volunteer) {
//             return res.status(400).send({
//                 error: 'Volunteer not found'
//             });
//         }
//         let event = await eventModel.findOne({
//             _id: eventID
//         }).exec();
//         if (!event) {
//             return res.status(400).send({
//                 error: 'Organization not found'
//             });
//         }

//         let organization = await orgModel.findOne({
//             _id: event.OrgID
//         }).exec();

//         if (!organization) {
//             return res.status(400).send({
//                 error: 'Organization not found'
//             });
//         }

//         // check if volunteer is already signed up
//         let myEvents = volunteer.Events;
//         if (!myEvents.includes(eventID.toString())) {
//             return res.status(400).send({
//                 error: 'Not signed up'
//             });
//         }
//         myEvents = myEvents.filter(id => id.toString() !== eventID); // if signed up, cancel
//         await userModel.updateOne({
//             Email: volunteerEmail
//         }, {
//             Events: myEvents,
//         }).catch(err => {
//             console.log(err);
//             return res.status(500).send({
//                 error: 'Error leaving'
//             });
//         });

//         // remove volunteer from event
//         let eventVolunteers = event.Volunteers;
//         let volunteerId = volunteer._id.toString();
//         eventVolunteers = eventVolunteers.filter(id => id.toString() !== volunteerId);
//         await eventModel.updateOne({
//             _id: event._id
//         }, {
//             Volunteers: eventVolunteers,
//             CurrentVols: event.CurrentVols - 1,
//             VolsNeeded: event.VolsNeeded + 1
//         }).catch(err => {
//             console.log(err);
//             return res.status(500).send({
//                 error: 'Error leaving'
//             });
//         });
//         res.send({
//             success: 'Left'
//         });
//     });



//     // get all events
//     route.get('/', async (req, res) => {
//         let events = await eventModel.find({
//             VolsNeeded: {
//                 $gt: 0
//             }
//         }, {
//             Title: 1,
//             Description: 1,
//             Location: 1,
//             Date: 1,
//             StartTime: 1,
//             EndTime: 1,
//             VolsNeeded: 1,
//             CurrentVols: 1,
//             OrgID: 1
//         }).exec();
//         res.send(events);
//     });

//     app.use('/events', publicRoute);
//     app.use('/events', [sessionMiddleware], route);
// }