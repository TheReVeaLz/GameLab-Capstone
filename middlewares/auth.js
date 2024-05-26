const ApplicationError = require("../config/errors/ApplicationError.js");
const jwt = require("jsonwebtoken");
const Auth = require("../app/services/auth.js");

const authorize = async (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if (authorization && authorization.substring(0, 7) === "Bearer ") authorization = authorization.substring(7, authorization.length);
        const user = await Auth.authorize(authorization);
        req.user = user;
        next();
    } catch (err) {
        res.status(err.statusCode || 500).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const authorize2 = async (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if (authorization && authorization.substring(0, 7) === "Bearer ") authorization = authorization.substring(7, authorization.length);
        const user = await Auth.authorize(authorization);
        req.user = user;
        next();
    } catch (err) {
        req.user = "guest";
        next();
    }
}

const isRoot = (req, res, next) => {
    const { role } = req.user;
    if (role !== "ROOT") {
        res.status(403).json({
            status: "FAIL",
            message: "FORBIDDEN."
        })
        return;
    }
    next();
}

const isRootOrAdmin =  (req, res, next) => {
    const { role } = req.user;
    if (!(role === "ROOT" || role === "ADMIN")) {
        res.status(403).json({
            status: "FAIL",
            message: "FORBIDDEN."
        })
        return;
    }
    next();
}

module.exports = {
    authorize,
    authorize2,
    isRoot,
    isRootOrAdmin
}