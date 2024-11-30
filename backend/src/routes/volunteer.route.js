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

// module.exports = function (app) {
//     // Register volunteer
//     publicRoute.post('/register', async (req, res) => {
//         let {email, password, firstName, lastName, birthday} = req.body;
//         if (!email || !password || !firstName || !lastName || !birthday) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }

//         // check if email is already in use
//         let volunteer = await userModel.findOne({
//             Email: email
//         }).exec();
//         if (volunteer) {
//             return res.status(400).send({
//                 error: 'Email already in use'
//             });
//         }


//         // todo: encrypt password
//         await userModel.create({
            // Email: email,
            // Password: password,
            // FirstName: firstName,
            // LastName: lastName,
            // Birthday: new Date(birthday)
//         }).catch(err => {
//             console.log(err);
//             return res.status(500).send({
//                 error: 'Error registering volunteer'
//             });
//         });

//         res.send({
//             success: 'Volunteer registered'
//         });
//     });

//     publicRoute.post('/login', async (req, res) => {
//        // todo: login logic
//         let {email, password} = req.body;
//          res.send('login route');
//     });




//     // Get profile by email
//     route.get('/profile/:email', async (req, res) => {
//         let email = req.params.email;
//         if (!email) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }

//         let volunteer = await userModel.findOne({
//             Email: email
//         }, {
//             Password: 0 // let's not send the password :)
//         }).exec();

//         if (!volunteer) {
//             return res.status(404).send({
//                 error: 'Volunteer not found'
//             });
//         }

//         res.send(volunteer);
//     });



//     // Update profile
//     route.post('/profile', async (req, res) => {
        // let {experience, interests, location, preference, skills} = req.body;
        // if (!experience || !interests || !location || !preference || !skills) {
        //     return res.status(400).send({
        //         error: 'Invalid parameters'
        //     });
        // }

//         await userModel.updateOne({
//             Email: req.session.email // todo: replace with req.session.email
//         }, {
//             Experience: experience,
//             Interests: interests,
//             Location: location,
//             Preference: preference,
//             Skills: skills
//         }).catch(err => {
//             console.log(err);
//             return res.status(500).send({
//                 error: 'Error updating volunteer'
//             });
//         });

//         res.send({
//             success: 'Volunteer updated'
//         });
//     });


//     // update availability
//     route.post('/availability', async (req, res) => {
//         let {availability} = req.body;
//         if (!availability) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }

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

//         res.send({
//             success: 'Availability updated'
//         });
//     });




//     // users need to be authenticated to access this route
//     app.use('/volunteers', publicRoute);
//     app.use('/volunteers', [sessionMiddleware], route);
// }