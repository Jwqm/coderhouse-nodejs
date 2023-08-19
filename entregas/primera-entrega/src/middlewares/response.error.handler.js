const { CustomError, NotFoundError } = require('../errors/custom.error.js');
const responseErrorHandler = (err, req, res, next) => {
    console.error("Error occurred:", err);

    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof NotFoundError) {
        return res.status(404).send({ code: err.code, error: err.message });
    } else if (err instanceof CustomError) {
        return res.status(500).send({ code: err.code, error: err.message });
    }

    return res.status(500).send({ code: 90000, error: "Internal server error" });
};

module.exports = responseErrorHandler;