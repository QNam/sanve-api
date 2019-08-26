"use strict";

const httpClient = require('http');
var request = require('request-promise');
const Logger = require('../helper/logger');

const logger = new Logger().getInstance(); 

// var speedSMSurl = 'https://api.speedsms.vn/index.php/sms/send';
var speedSMSurl = 'https://ena4go9bv3bxm.x.pipedream.net/';

function sendSMS(phone, content) 
{
    var token = "Basic " + process.env.SPEED_SMS_TOKEN + ':x'

    var options = {
        uri: speedSMSurl,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: token
        },
        body: {
            to: phone,
            content: content,
            sms_type: 2,
        },
        json: true,
    };

    return request(options)
    .then(body => logger.debug(body))
    .catch(err => {});
}

module.exports = {
    sendSMS 
};