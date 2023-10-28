export const sendResponse = (statusCode, body) => (req, res) => {
    res.status(statusCode).json({ status: 'success', ...body });
};

export default {
    sendResponse,
};