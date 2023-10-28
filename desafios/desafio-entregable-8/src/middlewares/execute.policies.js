const executePolicies = (policies) => {
    return (req, res, next) => {
        if (!req.user && req.session.user) req.user = req.session.user;
        if (policies[0] === "PUBLIC") return next();
        if (policies[0] === "NO_AUTH" && !req.user) return next();
        if (policies[0] === "NO_AUTH" && req.user)
            throw new UnauthorizedError(40000, "Already Logged In");
        if (policies[0] === "AUTH" && req.user) return next();
        if (policies[0] === "AUTH" && !req.user)
            throw new UnauthorizedError(40000, "Not logged");
        if (!policies.includes(req.user.role.toUpperCase())) {
            res.sendForbidden("Cannot access");
        }
        next();
    };
};

export default executePolicies;