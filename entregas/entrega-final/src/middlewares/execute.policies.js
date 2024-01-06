import { UnauthorizedError } from '../errors/custom.error.js';

const executePolicies = (policies) => {
    return (req, res, next) => {
        if (!req.user && req.session.user) req.user = req.session.user;
        if (policies[0] === "PUBLIC") return next();
        if (policies[0] === "NO_AUTH" && !req.user) return next();
        if (policies[0] === "NO_AUTH" && req.user) throw new UnauthorizedError(40000, "Already Logged In");
        if (policies[0] === "AUTH" && req.user) return next();
        if (policies[0] === "AUTH" && !req.user) throw new UnauthorizedError(40001, "Not logged");
        if (!req.user) throw new UnauthorizedError(40002, "Not logged");
        if (!policies.includes(req.user.role.toUpperCase())) {
            throw new UnauthorizedError(40003, "Cannot access");
        }
        next();
    };
};

export default executePolicies;