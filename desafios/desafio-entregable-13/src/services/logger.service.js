import winston from 'winston';

export default class LoggerService {
    constructor(level) {
        this.options = {
            levels: {
                fatal: 0,
                error: 1,
                warning: 2,
                info: 3,
                http: 4,
                debug: 5,
            },
            colors: {
                fatal: 'magenta',
                error: 'red',
                warning: 'yellow',
                info: 'blue',
                http: 'green',
                debug: 'white'
            }
        };
        this.logger = this.createLogger(level);
    }

    createLogger = (level) => {
        return winston.createLogger({
            levels: this.options.levels,
            transports: [
                new winston.transports.Console({
                    level: level.toLowerCase(),
                    format: winston.format.combine(
                        winston.format.colorize({ colors: this.options.colors }),
                        winston.format.simple()
                    )
                }),
                new winston.transports.File({
                    filename: './errors.log',
                    level: 'error',
                    format: winston.format.simple()
                })
            ]
        });
    }
};