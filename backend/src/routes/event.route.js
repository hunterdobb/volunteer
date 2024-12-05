const express = require('express');
const {
    createEvent, getOrganizationEvents, getAllEvents, getSingleEvent, deleteEvent, updateEvent,
    joinEvent, leaveEvent, getVolunteerJoinedEvents
} = require('../controllers/eventController')

const orgRequireAuth = require('../middleware/orgRequireAuth')
const volRequireAuth = require('../middleware/volRequireAuth')

const router = express.Router()


// public routes
router.get('/', getAllEvents)
router.get('/single/:id', getSingleEvent)
router.get('/organization/:id', getOrganizationEvents)
router.get('/volunteer/:volID', getVolunteerJoinedEvents)

// Require ORGANIZATION Authorization: Bearer Token 
router.post('/', orgRequireAuth, createEvent)
router.delete('/:id', orgRequireAuth, deleteEvent)
router.patch('/:id', orgRequireAuth, updateEvent)

// Require VOLUNTEER Authorization: Bearer Token 
router.post('/join/:eventID', volRequireAuth, joinEvent)
router.post('/leave/:eventID', volRequireAuth, leaveEvent)


module.exports = router