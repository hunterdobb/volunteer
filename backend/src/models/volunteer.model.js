const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const TimeSlotSchema = new mongoose.Schema({
    Start: {type: String, required: true},
    End: {type: String, required: true}
})

const AvailabilitySchema = new mongoose.Schema({
    Days: {type: String, required: true},
    Times: {type: [TimeSlotSchema], required: true}
})

const Volunteer = new Schema({
    Email: String,
    Password: String,
    Birthday: Date,
    Availability: {type: [AvailabilitySchema]},
    Experience: String,
    Interests: String,
    Location: String,
    Preference: String,
    Skills: String,
    Events: [ObjectId],
    Organizations: [ObjectId],
    FirstName: String,
    LastName: String,
}, {
    collection: 'Volunteers'
});

module.exports = Volunteer;