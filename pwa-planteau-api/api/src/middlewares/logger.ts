import winston from 'winston';

const logLevels = {
    error: 0,
    warning: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const logger = winston.createLogger({
    levels: logLevels,
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        //   new winston.transports.File({ filename: 'logs/app.log' })
    ],
});

export default logger;