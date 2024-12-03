const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;
const validator = require('validator');
const bcrypt = require('bcrypt')


const TimeSlotSchema = new mongoose.Schema({
    Start: { type: String, required: true },
    End: { type: String, required: true }
})

const AvailabilitySchema = new mongoose.Schema({
    Days: { type: String, required: true },
    Times: { type: [TimeSlotSchema], required: true }
})

const volunteerSchema = new Schema({
    Email: String,
    Password: String,
    Birthday: Date,
    Availability: { type: [AvailabilitySchema] },
    Experience: String,
    Interests: String,
    Location: String,
    Preference: String,
    Skills: [String],
    Events: [ObjectId],
    Organizations: [ObjectId],
    FirstName: String,
    LastName: String,
}, {
    collection: 'Volunteers',
    timestamps: true
});

// volunteer static methods

// REGISTER
volunteerSchema.statics.register = async function (
    Email, Password, FirstName, LastName, Birthday
) {
    // validation
    if (!Email || !Password || !FirstName || !LastName || !Birthday) {
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

    // encrypt password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(Password, salt)

    const volunteer = await this.create({
        Email, Password: hash,
        FirstName, LastName, Birthday: new Date(Birthday)
    })

    return volunteer
}

// LOGIN
volunteerSchema.statics.login = async function (Email, Password) {
    if (!Email || !Password) {
        throw Error('Please fill out all the fields')
    }

    const volunteer = await this.findOne({ Email });
    if (!volunteer) {
        throw Error('Account not found')
    }

    const match = await bcrypt.compare(Password, volunteer.Password)
    if (!match) {
        throw Error('Account not found')
    }

    return volunteer
}

// UPDATE
volunteerSchema.statics.updateAccount = async function (id, vol) {
    const volunteer = await this.findByIdAndUpdate(id, vol)
    if (!volunteer) { throw Error('Unable to update account') }
    return volunteer
}

module.exports = mongoose.model('Volunteers', volunteerSchema)