const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const Event = new Schema({
    Location: String,
    Date: Date,
    Description: String,
    OrgID: ObjectId,
    Title: String,
    VolsNeeded: Number,
    CurrentVols: Number,
    EndTime: Date,
    StartTime: Date,
    Volunteers: [ObjectId],
}, {
    collection: 'Events'
});

module.exports = Event;