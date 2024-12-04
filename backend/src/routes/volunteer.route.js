const express = require('express')

const {
    login, register, getVolunteer, getAllVolunteers, updateAccount
} = require('../controllers/volunteerController')

const router = express.Router()

const volRequireAuth = require('../middleware/volRequireAuth')

// Public routes
router.post('/register', register)
router.post('/login', login)
router.get('/:_id', getVolunteer)
router.get('/', getAllVolunteers)

// Protected routes
router.patch('/', volRequireAuth, updateAccount)


module.exports = router



//     // Get profile by email
//     route.get('/profile/:email', async (req, res) => {
//         let email = req.params.email;
//         if (!email) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }
//
//         let volunteer = await userModel.findOne({
//             Email: email
//         }, {
//             Password: 0 // let's not send the password :)
//         }).exec();
//
//         if (!volunteer) {
//             return res.status(404).send({
//                 error: 'Volunteer not found'
//             });
//         }
//
//         res.send(volunteer);
//     });




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