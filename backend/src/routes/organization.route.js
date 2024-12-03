const express = require('express');

const { 
    register, login, updateAccount, getOrganization, getAllOrganizations
    // subscribe,
    // unsubscribe
} = require('../controllers/organizationController')

const orgRequireAuth = require('../middleware/orgRequireAuth')
// const volRequireAuth = require('../middleware/volRequireAuth')

const router = express.Router();

// Public routes
router.post('/register', register)
router.post('/login', login)
router.get('/:_id', getOrganization)
router.get('/', getAllOrganizations)

// Protected routes
router.patch('/', orgRequireAuth, updateAccount)

// TODO
// router.post('/subscribe/:org_id', subscribe)
// router.post('/unsubscibe/:org_id', unsubscribe)

module.exports = router

// ----- YET TO BE REFACTORED ----- //

// module.exports = function (app) {
//     // subscribe to newsletter
//     route.post('/subscribe', async (req, res) => {
//         let {orgID} = req.body;
//         let email = req.session.email;
//         if (!email) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }

//         let account = await userModel.findOne({
//             Email: email
//         }).exec();
//         if (!account) {
//             return res.status(400).send({
//                 error: 'Account not found'
//             });
//         }


//         let org = await orgModel.findOne({
//             _id: orgID
//         }).exec();
//         if (!org) {
//             return res.status(400).send({
//                 error: 'Organization not found'
//             });
//         }

//         let subscribed = org.Volunteers.includes(account._id);
//         if (subscribed) {
//             return res.status(400).send({
//                 error: 'Already subscribed'
//             });
//         }

//         org.Volunteers.push(account._id);
//         await orgModel.updateOne({
//             Email: email
//         }, {
//             Volunteers: org.Volunteers
//         }).catch(err => {
//             console.log(err);
//             return res.status(500).send({
//                 error: 'Error subscribing'
//             });
//         });
//         res.send({
//             success: 'Subscribed'
//         });
//     });



//     // unsubscribe from newsletter
//     route.post('/unsubscribe', async (req, res) => {
//         let {orgID} = req.body;
//         let email = req.session.email;
//         if (!email) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }

//         let account = await userModel.findOne({
//             Email: email
//         }).exec();
//         if (!account) {
//             return res.status(400).send({
//                 error: 'Account not found'
//             });
//         }


//         let org = await orgModel.findOne({
//             Email: email
//         }).exec();
//         if (!org) {
//             return res.status(400).send({
//                 error: 'Organization not found'
//             });
//         }

//         let subscribed = org.Volunteers.includes(account._id);
//         if (!subscribed) {
//             return res.status(400).send({
//                 error: 'Not subscribed'
//             });
//         }

//         org.Volunteers = org.Volunteers.filter(id => id !== account._id);
//         await orgModel.updateOne({
//             Email: email
//         }, {
//             Volunteers: org.Volunteers
//         }).catch(err => {
//             console.log(err);
//             return res.status(500).send({
//                 error: 'Error unsubscribing'
//             });
//         });
//         res.send({
//             success: 'Unsubscribed'
//         });
//     });

//     app.use('/organizations', publicRoute);
//     app.use('/organizations', [sessionMiddleware], route);





    // ----- REFACTORED ----- //

    //     // get organization profile by either name, email, or id
//     route.get('/profile', async (req, res) => {
//         let {name, email, id} = req.query;
//         if (!name && !email && !id) {
//             return res.status(400).send({
//                 error: 'Invalid parameters'
//             });
//         }

//         let org;
//         if (name) {
//             org = await orgModel.findOne({
//                 Name: {
//                     $regex: name,
//                     $options: 'i'
//                 }
//             }, {
//                 Password: 0
//             }).exec();
//         } else if (email) {
//             org = await orgModel.findOne({
//                 Email: email
//             }, {
//                 Password: 0
//             }).exec();
//         } else {
//             org = await orgModel.findOne({
//                 _id: id
//             }, {
//                 Password: 0
//             }).exec();
//         }

//         if (!org) {
//             return res.status(400).send({
//                 error: 'Organization not found'
//             });
//         }

//         res.send(org);
//     });