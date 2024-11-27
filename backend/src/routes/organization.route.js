const express = require('express');

const { 
    register, login, updateAccount,
    getPrivateInfo,
    getPublicInfo,
    getAll
    // subscribe,
    // unsubscribe
} = require('../controllers/organizationController')

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.patch('/account/:id', updateAccount)
router.get('/account/:id', getPrivateInfo)

router.get('/:id', getPublicInfo)
router.get('/', getAll)


// router.post('/subscribe/:id', subscribe)
// router.post('/unsubscibe/:id', unsubscribe)

module.exports = router

// ----- YET TO BE REFACTORED ----- //

// module.exports = function (app) {
//     //
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

    // register organization
    // publicRoute.post('/register', async (req, res) => {
    //     let {email, password, name, type, category, info, website, location} = req.body;
    //     if (!email || !password || !name || !type || !category || !info || !website || !location) {
    //         return res.status(400).send({
    //             error: 'Invalid parameters'
    //         });
    //     }

    //     // check if email is already in use
    //     let org = await orgModel.findOne({
    //         Email: email
    //     }).exec();
    //     if (org) {
    //         return res.status(400).send({
    //             error: 'Email already in use'
    //         });
    //     }

    //     // todo: encrypt password

    //     await orgModel.create({
    //         Email: email,
    //         Password: password,
    //         Name: name,
    //         Type: type,
    //         Category: category,
    //         Desc: info,
    //         Website: website,
    //         Location: location
    //     }).catch(err => {
    //         console.log(err);
    //         return res.status(500).send({
    //             error: 'Error registering organization'
    //         });
    //     })
    //     res.send({
    //         success: 'Organization registered'
    //     });
    // });

    // login organization
    // publicRoute.post('/login', async (req, res) => {
    //     let {email, password} = req.body;
    //     // todo: login logic
    //     res.send('org login route');
    // });
// }