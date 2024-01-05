import { v4 as uuidv4 } from 'uuid';
import LoggerService from '../services/logger.service.js';
import config from "../config/config.js";

const loggerService = new LoggerService(config.logging.LEVEL);
export const addLogger = (req, res, next) => {
    const requestId = uuidv4();
    req.logger = loggerService.logger;
    req.logger.id = requestId;
    req.logger.http(`${req.method} en ${req.url} - con id ${req.logger.id} - Inicio a las ${new Date().toLocaleTimeString()}`);
    next();
}