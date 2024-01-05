export const sendResponse = (statusCode, body) => (req, res) => {
    const response = { httpCode: statusCode, body: { status: 'success', ...body } };
    res.status(response.httpCode).json(response.body);
    req.logger.debug(`${req.method} en ${req.url} - con id ${req.logger.id} - response ${JSON.stringify(response)}`);
    req.logger.http(`${req.method} en ${req.url} - con id ${req.logger.id} - Finalizo a las ${new Date().toLocaleTimeString()}`);
};

export default {
    sendResponse,
};