const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Volunteer = new Schema({
    Email: String,
    Password: String,
    Birthday: Date,
    Availability: String,
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