const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator');
// const { options } = require('../routes/organization.route');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const organizationSchema = new Schema({
    Email: { type: String, require: true, unique: true },
    Password: { type: String, require: true },
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
    collection: 'Organizations',
    timestamps: true
});


// organization static methods

// REGISTER
organizationSchema.statics.register = async function (
    Email, Password, Name, Type, Category, Desc, Website, Location
) {
    // validation
    if (!Email || !Password || !Name || !Type || !Desc || !Website || !Location) {
        throw Error('Please fill out all the fields')
    }
    if (!validator.isEmail(Email)) {
        throw Error('Invalid Email')
    }
    if (!validator.isStrongPassword(Password)) {
        throw Error('Password is too weak')
    }
    const exists = await this.findOne({ Email });
    if (exists) {
        throw Error('Email already in use')
    }
    if (!validator.isURL(Website)) {
        throw Error('Invalid Website URL')
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(Password, salt)

    const organization = await this.create({
        Email, Password: hash,
        Name, Type, Category, Desc, Website, Location
    })

    return organization
}

// LOGIN
organizationSchema.statics.login = async function (Email, Password) {
    if (!Email || !Password) {
        throw Error('Please fill out all the fields')
    }

    const organization = await this.findOne({ Email });
    if (!organization) {
        throw Error('Account not found')
    }

    const match = await bcrypt.compare(Password, organization.Password)
    if (!match) {
        throw Error('Account not found')
    }

    return organization
}

// UPDATE
organizationSchema.statics.updateAccount = async function (id, info) {
    // validation
    if (!info.Name || !info.Type || !info.Desc || !info.Website || !info.Location) {
        throw Error('Please fill out all the fields')
    }
    if (!validator.isURL(info.Website)) {
        throw Error('Invalid Website URL')
    }

    const organization = await this.findByIdAndUpdate(id, info)
    if (!organization) {
        throw Error('Unable to update account')
    }

    return organization
}

module.exports = mongoose.model('Organizations', organizationSchema);