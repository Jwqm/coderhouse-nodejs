import express from 'express';
import { sendResponse } from '../middlewares/response.handler.js';

const router = express.Router();

router.get('/loggerTest', async (req, res, next) => {

    /*
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    */
    req.logger.fatal("127.0.0.1 - there's no place like home");
    req.logger.error("127.0.0.1 - there's no place like home");
    req.logger.info("127.0.0.1 - there's no place like home");
    req.logger.warning("127.0.0.1 - there's no place like home");
    req.logger.http("127.0.0.1 - there's no place like home");
    req.logger.debug("127.0.0.1 - there's no place like home");

    return sendResponse(201, { message: 'Se ejecuto test log' })(req, res);
})

export default router;
