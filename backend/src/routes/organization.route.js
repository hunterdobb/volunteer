const express = require('express');

const { 
    register, login, updateAccount, getOrganization, getAllOrganizations,
    subscribe, unsubscribe, getVolunteerSubscribedOrganizations
} = require('../controllers/organizationController')

const orgRequireAuth = require('../middleware/orgRequireAuth')
const volRequireAuth = require('../middleware/volRequireAuth')

const router = express.Router();


// Public routes
router.post('/register', register)
router.post('/login', login)
router.get('/:_id', getOrganization)
router.get('/', getAllOrganizations)
router.get('/volunteer/:volID', getVolunteerSubscribedOrganizations)

// Require ORGANIZATION Authorization: Bearer Token 
router.patch('/', orgRequireAuth, updateAccount)

// Require VOLUNTEER Authorization: Bearer Token 
router.post('/subscribe/:org_id', volRequireAuth, subscribe)
router.post('/unsubscribe/:org_id', volRequireAuth, unsubscribe)


module.exports = router