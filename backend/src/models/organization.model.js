const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Organization = new Schema({
    Email: String,
    Password: String,
    Name: String,
    Type: String,
    Category: Number,
    Desc: String,
    Website: String,
    Location: String,
    Events: [ObjectId],
    NumEvents: Number,
    Volunteers: [ObjectId],
}, {
    collection: 'Organizations'
});

module.exports = Organization;