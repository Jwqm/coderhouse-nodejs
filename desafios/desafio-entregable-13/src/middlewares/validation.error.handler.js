import { validationResult } from 'express-validator';
import { BadRequestError } from '../errors/custom.error.js';

const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new BadRequestError(40000, errors.array());
    }
    next();
};

export default validationErrorHandler;