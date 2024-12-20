const nodemailer = require('nodemailer');


// gmail
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
}

const transporter = nodemailer.createTransport(emailConfig);


const sendTestEmail = async (email) => {
    let message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Test Email',
        text: 'This is a test email from the Volunteer Portal'
    }
    try {
        await transporter.sendMail(message)
    } catch (error) {
        console.log(error)
    }
}

const sendEventEmail = async (email, event, organization) => {
    const htmlBody = `
    <h1>There is a new event from ${organization.Name}!</h1>
    <h2><a href="https://localhost:3000">${event.Title}</a></h2>
    <p>${event.Description}</p>
    <p>${event.Date}</p>
    <p>Starts at ${new Date(event.StartTime).toLocaleDateString([], {
        hour: '2-digit',
        minute: '2-digit'
    })}</p>
    <p>Location: ${event.Location}</p>
    `
    let message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `There is a new event from ${organization.Name}!`,
        html: htmlBody
    }
    try {
        await transporter.sendMail(message)
    } catch (error) {
        console.log(error)
    }
}


const eventReminder = async (email, event, organization) => {
    const htmlBody = `
    <h1>Reminder: ${event.Title} is coming up!</h1>
    <p>${event.Description}</p>
    <p>${new Date(event.Date).toLocaleDateString([], {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })}</p>
    <p>Starting time: ${
        new Date(event.StartTime).toLocaleDateString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    }</p>
    <p>Location: ${event.Location}</p>
    `
    let message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Reminder: ${event.Title} is coming up!`,
        html: htmlBody
    }
    try {
        await transporter.sendMail(message)
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    sendEventEmail,
    eventReminder,
    sendTestEmail
}