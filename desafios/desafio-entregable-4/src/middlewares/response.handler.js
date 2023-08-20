const responseHandler = (statusCode, body) => (req, res) => {
    res.status(statusCode).json(body);
};

export default responseHandler;