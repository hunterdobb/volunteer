const cron = require('node-cron');
const {eventReminder} = require('./emailController');
const {getTodaysEvents} = require('./eventContoller');
const Volunteer = require('../models/volunteer.model');
const Organization = require('../models/organization.model');

const startCronJobs = async () => {

    // every day at 7am
    cron.schedule('0 07 * * *', async () => {
        let events = await getTodaysEvents();
        events = events.filter((evt) => evt.Volunteers.length > 0);
        await Promise.all(events.map(async (evt) => {
            let volunteers = await Volunteer.find({_id: {$in: evt.Volunteers}});
            let organization = await Organization.findOne({_id: evt.OrgID});
            await Promise.all(volunteers.map(async (volunteer) => {
                await eventReminder(volunteer.Email, evt, organization);
                // timeout to prevent rate limiting
                await new Promise((resolve) => setTimeout(resolve, 200));
            }));
        }));
    });
    console.log('started cron job for event reminders');

}


module.exports = startCronJobs;