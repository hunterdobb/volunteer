const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// just a sample model, i'm not sure how the db will be setup
// make sure model name matches the collection name (or specify the collection name in the schema)
const User = new Schema({
    id: ObjectId,
    name: String,
    email: String,
    password: String,
}, {
    collection: 'Users'
});

module.exports = User;