const ApplicationError = require("../../config/errors/ApplicationError.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepo = require("../repositories/user.js");

const JWT_SECRET_KEY = 'GAMELAB';

const encryptPassword = async (password, salt = 10) => {
    try {
        return await bcrypt.hash(password, salt);
    } catch (err) {
        throw new ApplicationError(`Encrypt password error. ${err.message}`, 500);
    }
}

const cmpPassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (err) {
        throw new ApplicationError(`Password compare error. ${err.message}`, 400);
    }
}

const createToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 3600 });
}

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET_KEY);
}

const authorize = async (token) => {
    try {
        if (!token) {
            throw new ApplicationError("Unauthorized", 401);
        }
        
        const decoded = verifyToken(token);
        const { id } = decoded;

        const user = await UserRepo.findByPk(id);
        
        if (!user) {
            throw new ApplicationError("Unauthorized", 401);
        }

        return user;
    } catch (err) {
        throw new ApplicationError(err.message, err.statusCode || 500);
    }
}

module.exports = {
    encryptPassword,
    cmpPassword,
    createToken,
    verifyToken,
    authorize
}