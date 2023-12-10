import passport from "passport";
import { UnauthorizedError } from '../errors/custom.error.js';

const passportCall = (strategy, options = {}) => {
    return (req, res, next) => {
        passport.authenticate(strategy, options, async (error, user, info) => {
            if (error) return next(error);
            if (!options.strategyType) {
                return res.sendInternalError("strategyType not defined");
            }
            if (!user) {
                switch (options.strategyType) {
                    case "LOCALS": {
                        throw new UnauthorizedError(40000, info.message ? info.message : info.toString());

                        /*return res.status(401).send({
                            status: "error",
                            error: info.message ? info.message : info.toString(),
                        });*/
                    }
                    case "JWT": {
                        req.user = null;
                        return next();
                    }
                }
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

export default passportCall;