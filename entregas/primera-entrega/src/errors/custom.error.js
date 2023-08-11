class CustomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

class NotFoundError extends CustomError {
    constructor(code, message) {
        super(code, message);
    }
}

module.exports = {
    NotFoundError,
    CustomError
};