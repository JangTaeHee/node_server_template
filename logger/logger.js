const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const logDir = 'api';

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logFilename = path.join('../log/server/',logDir,'info_%DATE%.log');
const exceptionlogFilename = path.join('../log/server/',logDir,'exception_%DATE%.log');
 
function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
};
//logger 설정
var logger = new (winston.Logger)({
    transports: [
        new (winstonDaily)({
            name: 'info-file',
            filename: logFilename,
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            colorize: false,
            maxsize: 104857600,
            maxFiles: 1000,
            level: 'info',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ],
    exceptionHandlers: [
        new (winstonDaily)({
            name: 'exception-file',
            filename: exceptionlogFilename,
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: 104857600,
            maxFiles: 1000,
            level: 'error',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logger.info(decodeURI(message));
    },
  };

module.exports = logger;