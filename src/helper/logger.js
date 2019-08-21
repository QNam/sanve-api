var winston = require('winston');
require('dotenv').config();

const options = {
    dev: {
        level: 'info',
        format: winston.format.simple(),
        transports: [
            new winston.transports.Console()
        ]
    },
    production: {
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console()
        ]
    },
    debug: {
        level: 'debug',
        format: winston.format.simple(),
        transports: [
            new winston.transports.Console()
        ]
    }
}


class Logger
{
    constructor() {
        if (!Logger.instance) {
            Logger.instance = winston.createLogger(options[process.env.ENV]);
            Logger.instance.info(process.env.ENV);
        }
    }

    getInstance() {
        return Logger.instance;
    }
}



module.exports = Logger;