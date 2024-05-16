var nodemailer = require('nodemailer');
const fs = require("fs");
const { logger } = require('../utils/logger');
const secure = process.env.NODE_ENV === "production"

exports.sendMail = () => {
    var mail = nodemailer.createTransport({
        service: 'gmail',
        secure: secure,
        auth: {
            user: process.env.EMAIL_ADDRESSE,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_ADDRESSE,
        to: process.env.EMAIL_ADDRESSE,
        subject: 'Log File For https://Canevas.cnagri.dz',
        text: `Date: ${new Date()}`,
        attachments: [
            {
                filename: 'stdActLog.log',
                path: './logs/stdActLog.log'
            }
        ]
    };

    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('sendMail Error: ' + new Date() + ' ' + error);
            console.error("---------------------------------------------------------------");

        } else {
            fs.createWriteStream('./logs/stdActLog.log');
            console.log('Email sent: ' + new Date() + ' ' + info.response);
        }
    });
}