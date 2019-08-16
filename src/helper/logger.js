var winston = require('winston');

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
    }
}


class Logger
{
    constructor() {
        if (!Logger.instance) {
            Logger.instance = winston.createLogger(options[process.env.ENV]);
        }
    }

    getInstance() {
        return Logger.instance;
    }
}



module.exports = Logger;