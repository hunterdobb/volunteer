const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const organizationSchema = new Schema({
    Email: {type: String, require: true, unique: true},
    Password: {type: String, require: true},
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
organizationSchema.statics.register = async function(
    email, password, name, type, category, desc, website, location
) {
    // validation
    if (!email || !password || !name || !type || !desc || !website || !location) {
        throw Error('Invalid parameters')
    }
    if (!validator.isEmail(email)) {
        throw Error('Invalid Email')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is too weak')
    }
    const exists = await this.findOne({ Email: email  });
    if (exists) {
        console.log('Email already in use')
        throw Error('Email already in use')
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const organization = await this.create({
        Email: email,
        Password: hash,
        Name: name,
        Type: type,
        Category: category,
        Desc: desc,
        Website: website,
        Location: location
    })

    return organization

    // await orgModel.create({
    //     Email: email,
    //     Password: hash,
    //     Name: name,
    //     Type: type,
    //     Category: category,
    //     Desc: info,
    //     Website: website,
    //     Location: location
    // }).catch(err => {
    //     console.log(err);
    //     return res.status(500).send({
    //         error: 'Error registering organization'
    //     });
    // })
    // res.send({
    //     success: 'Organization registered'
    // });
}

organizationSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const organization = await this.findOne({ Email: email });
    if (!organization) {
        throw Error('Account not found')
    }

    const match = await bcrypt.compare(password, organization.Password)
    if (!match) {
        throw Error('Account not found')
    }

    return organization
}

module.exports = mongoose.model('Organizations', organizationSchema);