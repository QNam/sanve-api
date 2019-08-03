var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'quocnamutc@gmail.com',
    pass: 'quocnama;;1'
  }
});

module.exports = transporter;