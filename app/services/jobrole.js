const JobRole = require('../repositories/jobrole');
const ApplicationError = require('../../config/errors/ApplicationError');

const findAll = async (payload = {}) => {
    try {
        return await JobRole.findAll(payload);
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

const findOne = async (payload) => {
    try {
        return await JobRole.findOne();
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

module.exports = {
    findAll,
    findOne
}