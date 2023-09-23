import { validationResult } from 'express-validator';

const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', message: errors.array() });
    }
    next();
};

export default validationErrorHandler;