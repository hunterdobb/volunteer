const express = require('express')

const {
    login, register, getVolunteer, getAllVolunteers, updateAccount, getVolunteerFromEmail
} = require('../controllers/volunteerController')

const router = express.Router()

const volRequireAuth = require('../middleware/volRequireAuth')


// Public routes
router.post('/register', register)
router.post('/login', login)
router.get('/:_id', getVolunteer)
router.get('/', getAllVolunteers)
router.get('/email/:Email', getVolunteerFromEmail)

// Require VOLUNTEER Authorization: Bearer Token 
router.patch('/', volRequireAuth, updateAccount)


module.exports = router



// --- NOT SURE IF WE NEED THIS --- //

//     // update availability
//     route.post('/availability', async (req, res) => {
//         let {availability} = req.body;
//         if (!availability) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }
//
//         await userModel.updateOne({
//             Email: req.session.email // todo: replace with req.session.email
//         }, {
//             Availability: availability
//         }).catch(err => {
//             console.log(err);
//             return res.status(500).send({
//                 error: 'Error updating volunteer availability'
//             });
//         });
//
//         res.send({
//             success: 'Availability updated'
//         });
//     });