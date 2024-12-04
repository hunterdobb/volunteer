const cron = require('node-cron');
const {eventReminder} = require('./emailController');
const {getTodaysEvents, getOldEvents} = require('./eventContoller');
const Volunteer = require('../models/volunteer.model');
const Organization = require('../models/organization.model');
const Event = require('../models/event.model');

const startCronJobs = async () => {
    // every day at 5am send reminders to volunteers for events occurring that day and delete old events
    cron.schedule('0 0 * * *', async () => {
        let events = await getTodaysEvents();
        events = events.filter((evt) => evt.Volunteers.length > 0);
        await Promise.all(events.map(async (evt) => {
            let volunteers = await Volunteer.find({_id: {$in: evt.Volunteers}});
            let organization = await Organization.findOne({_id: evt.OrgID});
            await Promise.all(volunteers.map(async (volunteer) => {
                await eventReminder(volunteer.Email, evt, organization);
                await new Promise((resolve) => setTimeout(resolve, 200)); // timeout to prevent rate limiting
            }));
        }));

        let oldEvents = await getOldEvents();
        if (oldEvents.length === 0) {
            return;
        }
        Event.deleteMany({_id: {$in: oldEvents.map(evt => evt._id)}}, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
}


module.exports = startCronJobs;