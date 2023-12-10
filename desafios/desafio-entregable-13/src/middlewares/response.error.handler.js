import { BadRequestError, CustomError, NotFoundError, UnauthorizedError } from '../errors/custom.error.js';

const responseErrorHandler = (err, req, res, next) => {
    const response = { httpCode: '', body: { status: 'error', code: err.code, message: err.message } };

    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof BadRequestError) {
        response.httpCode = 400;
    } else if (err instanceof UnauthorizedError) {
        response.httpCode = 401;
    } else if (err instanceof NotFoundError) {
        response.httpCode = 404;
    } else if (err instanceof CustomError) {
        response.httpCode = 500;
    } else {
        response.httpCode = 500;
        response.body.code = 90000;
        response.body.message = "Internal server error";
    }

    req.logger.error(`${req.method} en ${req.url} - con id ${req.logger.id} - ${JSON.stringify(response.body)}`);
    req.logger.debug(`${req.method} en ${req.url} - con id ${req.logger.id} - response ${JSON.stringify(response)}`);
    req.logger.http(`${req.method} en ${req.url} - con id ${req.logger.id} - Finalizo a las ${new Date().toLocaleTimeString()}`);
    return res.status(response.httpCode).send(response.body);
};

export default responseErrorHandler;