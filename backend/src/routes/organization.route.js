const express = require('express');
const sessionMiddleware = require('../middleware/session')
const orgSchema = require('../models/organization.model');
const userSchema = require('../models/volunteer.model');
const mongoose = require('mongoose');
const orgModel = mongoose.model('Organizations', orgSchema);
const userModel = mongoose.model('Volunteers', userSchema);
const route = express.Router();
const publicRoute = express.Router();

module.exports = function (app) {


    publicRoute.post('/register', async (req, res) => {
        let {email, password, name, type, category, info, website, location} = req.body;
        if (!email || !password || !name || !type || !category || !info || !website || !location) {
            return res.status(400).send({
                error: 'Invalid parameters'
            });
        }

        // check if email is already in use
        let org = await orgModel.findOne({
            Email: email
        }).exec();
        if (org) {
            return res.status(400).send({
                error: 'Email already in use'
            });
        }


        // todo: encrypt password

        await orgModel.create({
            Email: email,
            Password: password,
            Name: name,
            Type: type,
            Category: category,
            Desc: info,
            Website: website,
            Location: location
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                error: 'Error registering organization'
            });
        })
        res.send({
            success: 'Organization registered'
        });
    });


    // sign up for an organization as volunteer
    route.post('/sign-up', async (req, res) => {
        let {orgId} = req.body;
        let volunteerEmail = 'test'; // todo: replace with req.session.email
        if (!orgId) {
            return res.status(400).send({
                error: 'Invalid parameters'
            });
        }
        let volunteer = await userModel.findOne({
            Email: volunteerEmail
        }).exec();
        if (!volunteer) {
            return res.status(400).send({
                error: 'Volunteer not found'
            });
        }
        let volunteerId = volunteer._id;
        let org = await orgModel.findOne({
            _id: orgId
        }).exec();
        if (!org) {
            return res.status(400).send({
                error: 'Organization not found'
            });
        }
        // check if volunteer is already signed up
        let myOrgs = volunteer.Organizations;
        if (myOrgs.includes(orgId)) {
            return res.status(400).send({
                error: 'Already signed up'
            });
        }

        myOrgs.push(orgId); // if not, sign up
        await userModel.updateOne({
            Email: volunteerEmail
        }, {
            Organizations: myOrgs
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                error: 'Error signing up'
            });
        });

        // add volunteer to organization
        let volunteers = org.Volunteers;
        volunteers.push(volunteerId);
        await orgModel.updateOne({
            _id: orgId
        }, {
            Volunteers: volunteers
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                error: 'Error signing up'
            });
        });
        res.send({
            success: 'Signed up'
        });
    });

    // cancel sign up for an organization as volunteer
    route.post('/leave', async (req, res) => {
        let {orgId} = req.body;
        let volunteerEmail = 'test'; // todo: replace with req.session.email
        if (!orgId) {
            return res.status(400).send({
                error: 'Invalid parameters'
            });
        }
        let volunteer = await userModel.findOne({
            Email: volunteerEmail
        }).exec();
        if (!volunteer) {
            return res.status(400).send({
                error: 'Volunteer not found'
            });
        }
        let volunteerId = volunteer._id;
        let org = await orgModel.findOne({
            _id: orgId
        }).exec();
        if (!org) {
            return res.status(400).send({
                error: 'Organization not found'
            });
        }
        // check if volunteer is already signed up
        let myOrgs = volunteer.Organizations;
        if (!myOrgs.includes(orgId)) {
            return res.status(400).send({
                error: 'Not signed up'
            });
        }

        myOrgs = myOrgs.filter(id => id !== orgId); // if signed up, cancel
        await userModel.updateOne({
            Email: volunteerEmail
        }, {
            Organizations: myOrgs
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                error: 'Error leaving'
            });
        });

        // remove volunteer from organization
        let volunteers = org.Volunteers;
        volunteers = volunteers.filter(id => id !== volunteerId);
        await orgModel.updateOne({
            _id: orgId
        }, {
            Volunteers: volunteers
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                error: 'Error leaving'
            });
        });
        res.send({
            success: 'Left'
        });
    });





    app.use('/organizations', publicRoute);
    app.use('/organizations', [sessionMiddleware], route);
}